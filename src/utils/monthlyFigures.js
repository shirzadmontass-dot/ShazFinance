import { normalizeMerchant, autoCategorize, isInternalTransfer } from "./categorize.js"

function amountsSimilar(a, b, tolerance = 0.1) {
  if (a === 0 || b === 0) return false
  const diff = Math.abs(Math.abs(a) - Math.abs(b))
  return diff / Math.abs(a) <= tolerance
}

function monthKey(dateStr) {
  return (dateStr || "").slice(0, 7)
}

// Groups transactions by merchant + similar amount, and flags a group as
// "recurring" once the same merchant/amount shows up in 2+ different months.
function findRecurringGroups(transactions) {
  const byMerchant = {}
  for (const t of transactions) {
    const key = normalizeMerchant(t.description)
    if (!byMerchant[key]) byMerchant[key] = []
    byMerchant[key].push(t)
  }

  const recurring = []
  for (const key in byMerchant) {
    const txs = byMerchant[key]
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    // Cluster by similar amount within this merchant, since one merchant
    // (e.g. Amazon) can mean very different transaction types.
    const clusters = []
    for (const t of txs) {
      let cluster = clusters.find((c) => amountsSimilar(c.amount, t.amount))
      if (!cluster) {
        cluster = { amount: t.amount, transactions: [] }
        clusters.push(cluster)
      }
      cluster.transactions.push(t)
    }

    for (const cluster of clusters) {
      const months = new Set(
        cluster.transactions.map((t) => monthKey(t.date))
      )
      if (months.size >= 2) {
        recurring.push({
          key,
          amount: cluster.transactions[0].amount,
          latest: cluster.transactions[0]
        })
      }
    }
  }
  return recurring
}

// Builds this month's Income / Commitments / Expenses from real bank
// transactions.
//
// If the user has tagged accounts with a role (accountRoles: an object of
// accountId -> "spending" | "bills"), that's used directly and is far more
// accurate than guessing — e.g. "Monzo is what I spend, Lloyds is purely
// for bills" means every Lloyds transaction is a commitment, full stop.
//
// Without any tagged accounts, falls back to recurring-payment detection
// (same merchant/amount repeating across 2+ months = a real bill/salary)
// plus keyword matching, so the numbers aren't empty before that's set up.
export function computeMonthlyFigures(transactions, accountRoles = {}) {
  // Exclude transfers between the user's own accounts/pots right away —
  // otherwise moving money from a main account into a savings pot (and
  // back) gets double-counted as both income and spending.
  const realTransactions = transactions.filter(
    (t) => !isInternalTransfer(t.description)
  )

  const now = new Date()
  const thisMonth = now.toISOString().slice(0, 7)
  const thisMonthTx = realTransactions.filter(
    (t) => monthKey(t.date) === thisMonth
  )

  const billsAccountIds = new Set(
    Object.entries(accountRoles)
      .filter(([, role]) => role === "bills")
      .map(([id]) => id)
  )
  const spendingAccountIds = new Set(
    Object.entries(accountRoles)
      .filter(([, role]) => role === "spending")
      .map(([id]) => id)
  )
  const hasRoles = billsAccountIds.size > 0 || spendingAccountIds.size > 0

  if (hasRoles) {
    const income = thisMonthTx
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)

    const commitmentTx = thisMonthTx.filter(
      (t) => t.amount < 0 && billsAccountIds.has(t.accountId)
    )
    const commitments = commitmentTx.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    )

    const expenseTx = thisMonthTx.filter(
      (t) => t.amount < 0 && spendingAccountIds.has(t.accountId)
    )
    const expenses = expenseTx.reduce(
      (sum, t) => sum + Math.abs(t.amount),
      0
    )

    return {
      income,
      commitments,
      expenses,
      expenseTransactions: expenseTx,
      commitmentTransactions: commitmentTx
    }
  }

  const recurring = findRecurringGroups(realTransactions)
  const recurringKeys = new Set(recurring.map((r) => r.key))

  const recurringIncome = recurring
    .filter((r) => r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0)

  const recurringCommitments = recurring
    .filter((r) => r.amount < 0)
    .reduce((sum, r) => sum + Math.abs(r.amount), 0)

  // Income: prefer detected recurring salary; fall back to this month's
  // total incoming so the figure isn't empty before enough history exists.
  const monthIncomeFallback = thisMonthTx
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)

  const income = recurringIncome > 0 ? recurringIncome : monthIncomeFallback

  // Commitments: detected recurring bills, plus this month's spend at
  // merchants that look bill-like by name (rent, council tax, insurance,
  // etc.) even before we've seen 2 months of them.
  const keywordCommitments = thisMonthTx
    .filter((t) => t.amount < 0)
    .filter((t) => !recurringKeys.has(normalizeMerchant(t.description)))
    .filter((t) => autoCategorize(t.description) === "essential")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const commitments = recurringCommitments + keywordCommitments

  // Expenses: everything else this month, not already counted as a commitment.
  const commitmentKeys = new Set([
    ...recurringKeys,
    ...thisMonthTx
      .filter(
        (t) => t.amount < 0 && autoCategorize(t.description) === "essential"
      )
      .map((t) => normalizeMerchant(t.description))
  ])

  const commitmentTx = thisMonthTx.filter(
    (t) => t.amount < 0 && commitmentKeys.has(normalizeMerchant(t.description))
  )

  const expenseTx = thisMonthTx
    .filter((t) => t.amount < 0)
    .filter((t) => !commitmentKeys.has(normalizeMerchant(t.description)))

  const expenses = expenseTx.reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return {
    income,
    commitments,
    expenses,
    expenseTransactions: expenseTx,
    commitmentTransactions: commitmentTx
  }
}