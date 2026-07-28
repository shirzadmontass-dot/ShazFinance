const TRUELAYER_API_BASE = "https://api.truelayer.com"

export async function fetchAccountsAndTransactions(bankAccessToken) {
  const authHeaders = { Authorization: `Bearer ${bankAccessToken}` }

  const accountsRes = await fetch(`${TRUELAYER_API_BASE}/data/v1/accounts`, {
    headers: authHeaders
  })
  const accountsData = await accountsRes.json()

  if (!accountsRes.ok) {
    throw {
      status: accountsRes.status,
      data: accountsData,
      message: "Failed to fetch accounts"
    }
  }

  const accounts = accountsData.results || []
  const bankAccounts = []
  const bankTransactions = []

  for (const account of accounts) {
    const accountId = account.account_id

    let balance = 0
    try {
      const balRes = await fetch(
        `${TRUELAYER_API_BASE}/data/v1/accounts/${accountId}/balance`,
        { headers: authHeaders }
      )
      const balData = await balRes.json()
      const first = (balData.results || [])[0]
      balance = first ? Number(first.available || first.current || 0) : 0
    } catch (e) {
      console.error("balance fetch failed for", accountId, e.message)
    }

    let transactions = []
    try {
      const txRes = await fetch(
        `${TRUELAYER_API_BASE}/data/v1/accounts/${accountId}/transactions`,
        { headers: authHeaders }
      )
      const txData = await txRes.json()
      transactions = (txData.results || []).map((t) => ({
        id: t.transaction_id || `${accountId}-${t.timestamp}-${t.amount}`,
        date: (t.timestamp || "").split("T")[0],
        description: t.description || t.merchant_name || "Transaction",
        amount: Number(t.amount || 0),
        currency: t.currency || "GBP",
        accountId
      }))
    } catch (e) {
      console.error("transactions fetch failed for", accountId, e.message)
    }

    bankAccounts.push({
      id: accountId,
      name:
        account.display_name ||
        account.account_number?.number ||
        "Bank account",
      // account_type is typically "TRANSACTION" or "SAVINGS" — lets the
      // dashboard tell current accounts apart from savings accounts.
      type: account.account_type || "TRANSACTION",
      balance,
      currency: account.currency || "GBP"
    })

    bankTransactions.push(...transactions)
  }

  return { bankAccounts, bankTransactions }
}