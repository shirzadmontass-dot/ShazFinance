import { useState, useEffect } from "react"
import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import NetWorthCard from "../components/NetworthCard.jsx"

import {
  HeroBanner,
  StatCard,
  Grid,
  Section
} from "../components/ui/index.js"

import { resolveCategory } from "../utils/categorize.js"
import { computeMonthlyFigures } from "../utils/monthlyFigures.js"
import MaskedValue from "../components/MaskedValue.jsx"

// Reactive width check — updates live on resize/zoom instead of
// only reading window size once at first render.
function useIsWide(breakpoint = 700) {
  const [wide, setWide] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth >= breakpoint
      : false
  )

  useEffect(() => {
    const check = () => setWide(window.innerWidth >= breakpoint)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [breakpoint])

  return wide
}

export default function Dashboard({ store, update }) {
  const wide = useIsWide()

  if (!store) return null

  const manualIncomeTotal =
    (store.income || []).reduce(
      (t, i) => t + Number(i.amount || 0),
      0
    )

  const manualCommitmentsTotal =
    (store.commitments || []).reduce(
      (t, c) => t + Number(c.amount || 0),
      0
    )

  const manualExpensesTotal =
    (store.expenses || []).reduce(
      (t, e) => t + Number(e.amount || 0),
      0
    )

  const savingsTotal =
    (store.savings || []).reduce(
      (t, s) => t + Number(s.balance || 0),
      0
    )

  // Live bank data — real linked accounts and transactions from TrueLayer
  const bankAccounts = store.bankAccounts || []
  const bankTransactions = store.bankTransactions || []
  const categoryOverrides = store.categoryOverrides || {}
  const hasBankData = bankTransactions.length > 0

  // Once a bank is linked, Income/Commitments/Expenses come from real
  // transaction data (with recurring-payment detection) instead of manual
  // entries. Manual entries still work as a fallback if no bank is linked.
  const bankFigures = hasBankData
    ? computeMonthlyFigures(bankTransactions, store.accountRoles || {})
    : null

  const incomeTotal = hasBankData ? bankFigures.income : manualIncomeTotal
  const commitmentsTotal = hasBankData
    ? bankFigures.commitments
    : manualCommitmentsTotal
  const expensesTotal = hasBankData
    ? bankFigures.expenses
    : manualExpensesTotal

  const accountRoles = store.accountRoles || {}

  // Cash Cushion = genuine free-and-clear savings only. Money already
  // earmarked for the house deposit or kids' savings isn't part of your
  // safety net — it's spoken for, so it's excluded here and counted
  // against those specific goals instead.
  const linkedSavingsBalance = bankAccounts
    .filter((a) => a.type === "SAVINGS")
    .filter((a) => {
      const role = accountRoles[a.id]
      return role !== "house" && role !== "kids"
    })
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const cashCushion = savingsTotal + linkedSavingsBalance

  const linkedHouseDepositBalance = bankAccounts
    .filter((a) => accountRoles[a.id] === "house")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const wastedOnNonEssentials = bankTransactions
    .filter((t) => t.amount < 0)
    .filter((t) => resolveCategory(t, categoryOverrides) === "discretionary")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const linkedCreditOwed = bankAccounts
    .filter((a) => a.type === "CREDIT_CARD")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const debtTotal =
    (store.debts || []).reduce(
      (t, d) => t + Number(d.balance || 0),
      0
    ) + linkedCreditOwed

  const linkedInvestmentTotal = bankAccounts
    .filter((a) => a.type === "INVESTMENT")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const investmentsTotal =
    (store.investments || []).reduce(
      (t, i) => t + Number(i.balance || 0),
      0
    ) + linkedInvestmentTotal

  // House deposit progress now includes any bank pot you've tagged
  // "House Deposit" (e.g. a LISA), on top of whatever's entered manually.
  const depositSaved =
    Number(store.deposit?.current || 0) + linkedHouseDepositBalance
  const depositTarget = Number(store.deposit?.target || 25000)

  // Money Left = real spendable balance right now — plain current/
  // transaction accounts only. Savings, credit cards, and investments
  // are all excluded (each has its own place elsewhere on the dashboard).
  const transactionAccountsBalance = bankAccounts
    .filter((a) => a.type === "TRANSACTION")
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const leftover = hasBankData
    ? transactionAccountsBalance
    : incomeTotal - commitmentsTotal - expensesTotal

  const depositPercent =
    depositTarget > 0
      ? Math.min(
          100,
          Math.round((depositSaved / depositTarget) * 100)
        )
      : 0

  // September Attack (generically: "this month's attack") is now
  // auto-tracked from real numbers instead of manual checkboxes.
  // A baseline (debt + deposit balance) is captured the first time the
  // app is opened in a new calendar month, then each step compares
  // today's numbers against that baseline for the rest of the month.
  const currentMonthKey = new Date().toISOString().slice(0, 7)
  const storedAttackPlan = store.attackPlan || {}
  const needsNewBaseline = storedAttackPlan.monthKey !== currentMonthKey

  useEffect(() => {
    if (needsNewBaseline && typeof update === "function") {
      // If there was a previous month's baseline, archive how it ended
      // before overwriting it with the new month's starting point.
      if (storedAttackPlan.monthKey) {
        const priorHistory = store.attackPlanHistory || []
        const alreadyLogged = priorHistory.some(
          (entry) => entry.monthKey === storedAttackPlan.monthKey
        )
        if (!alreadyLogged) {
          const priorDone = attackSteps.filter((s) => s.done).length
          update("attackPlanHistory", [
            ...priorHistory,
            {
              monthKey: storedAttackPlan.monthKey,
              percent: Math.round((priorDone / attackSteps.length) * 100),
              steps: attackSteps.map((s) => ({
                key: s.key,
                title: s.title,
                done: s.done
              }))
            }
          ])
        }
      }

      update("attackPlan", {
        monthKey: currentMonthKey,
        baselineDebt: debtTotal,
        baselineDeposit: depositSaved
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonthKey])

  const baselineDebt = needsNewBaseline
    ? debtTotal
    : storedAttackPlan.baselineDebt
  const baselineDeposit = needsNewBaseline
    ? depositSaved
    : storedAttackPlan.baselineDeposit

  // "Spending reset" compares this month's non-essential spend against
  // last month's, both computed from real bank transactions.
  const prevMonthDate = new Date()
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1)
  const prevMonthKey = prevMonthDate.toISOString().slice(0, 7)

  const wastedThisMonth = bankTransactions
    .filter((t) => t.amount < 0)
    .filter((t) => (t.date || "").slice(0, 7) === currentMonthKey)
    .filter((t) => resolveCategory(t, categoryOverrides) === "discretionary")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const wastedPrevMonth = bankTransactions
    .filter((t) => t.amount < 0)
    .filter((t) => (t.date || "").slice(0, 7) === prevMonthKey)
    .filter((t) => resolveCategory(t, categoryOverrides) === "discretionary")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const currentMonthName = new Date().toLocaleDateString("en-GB", {
    month: "long"
  })
  const attackPlanTitle = `${currentMonthName} Attack`

  const attackSteps = [
    {
      key: "debtTidyUp",
      title: "Debt tidy‑up",
      description:
        hasBankData || debtTotal > 0
          ? `£${debtTotal.toLocaleString()} now vs £${baselineDebt.toLocaleString()} on the 1st`
          : "Hit highest‑interest first.",
      done: hasBankData && debtTotal < baselineDebt
    },
    {
      key: "spendingReset",
      title: "Spending reset",
      description:
        wastedPrevMonth > 0
          ? `£${wastedThisMonth.toLocaleString()} wasted this month vs £${wastedPrevMonth.toLocaleString()} last month`
          : "Trim non‑essentials.",
      done: wastedPrevMonth > 0 && wastedThisMonth < wastedPrevMonth
    },
    {
      key: "depositBoost",
      title: "Deposit boost",
      description:
        hasBankData || depositSaved > 0
          ? `£${depositSaved.toLocaleString()} now vs £${baselineDeposit.toLocaleString()} on the 1st`
          : "Funnel surplus into house.",
      done: depositSaved > baselineDeposit
    }
  ]

  const doneCount = attackSteps.filter((step) => step.done).length

  const plannerPercent = Math.round(
    (doneCount / attackSteps.length) * 100
  )

  const safeRate =
    incomeTotal > 0
      ? Math.round(
          ((incomeTotal - commitmentsTotal - expensesTotal) /
            incomeTotal) *
            100
        )
      : 0

  const recentActivity =
    (store.activity || [])
      .slice()
      .sort(
        (a, b) =>
          new Date(b.date || 0) -
          new Date(a.date || 0)
      )
      .slice(0, 6)

  const upcomingBills =
    (store.commitments || [])
      .filter((c) => c.nextDate)
      .slice()
      .sort(
        (a, b) =>
          new Date(a.nextDate) -
          new Date(b.nextDate)
      )
      .slice(0, 5)


  return (
    <Page>
      {/* Top row: hero banner + net worth, full width. Activity/bills stack below. */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr)",
          gap: wide ? 24 : 16,
          alignItems: "flex-start",
          marginBottom: wide ? 20 : 12
        }}
      >
        <div style={{ minWidth: 0 }}>
          <HeroBanner
            title={
              store.profile?.name
                ? `Here's your Mula, ${store.profile.name} 👋`
                : "Here's your Mula 👋"
            }
            subtitle="Stay on top of your money with a clear, calm overview."
            currentFocusLabel={attackPlanTitle}
            currentFocusPercent={plannerPercent}
            goalLabel="Buy My Home 🏡"
            goalPercent={depositPercent}
          />

          <div style={{ marginTop: wide ? 16 : 12 }}>
            <NetWorthCard store={store} split={wide} />
          </div>

          {/* Money Left / Savings Rate / Cash Cushion – always 3-across, tight on mobile */}
          <div
            style={{
              marginTop: wide ? 16 : 10,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: wide ? 12 : 7
            }}
          >
            <div
              style={{
                padding: wide ? "16px" : "9px 6px",
                borderRadius: wide ? 16 : 12,
                background:
                  "linear-gradient(135deg,#022C22,#011619)",
                border: "1px solid rgba(34,197,94,0.35)",
                minWidth: 0
              }}
            >
              <div
                style={{
                  fontSize: wide ? 11 : 9,
                  textTransform: "uppercase",
                  letterSpacing: 0.06,
                  color: "rgba(190,242,100,0.8)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Money left
              </div>
              <div
                style={{
                  marginTop: wide ? 6 : 3,
                  fontSize: wide ? 22 : 15,
                  fontWeight: 700,
                  color: "#BBF7D0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <MaskedValue value={`£${leftover.toLocaleString()}`} />
              </div>
              {wide && (
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 11,
                    color: "rgba(148,163,184,0.9)"
                  }}
                >
                  {hasBankData
                    ? "Current account balance"
                    : "After income & outgoings"}
                </div>
              )}
            </div>

            <div
              style={{
                padding: wide ? "16px" : "9px 6px",
                borderRadius: wide ? 16 : 12,
                background: "#131A2B",
                border: "1px solid var(--border)",
                minWidth: 0
              }}
            >
              <div
                style={{
                  fontSize: wide ? 11 : 9,
                  textTransform: "uppercase",
                  letterSpacing: 0.06,
                  color: "rgba(148,163,184,0.9)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Savings rate
              </div>
              <div
                style={{
                  marginTop: wide ? 6 : 3,
                  fontSize: wide ? 22 : 15,
                  fontWeight: 700,
                  color:
                    safeRate >= 20
                      ? "#4ADE80"
                      : safeRate >= 10
                      ? "#FACC15"
                      : "#F97316"
                }}
              >
                {isNaN(safeRate) ? "–" : `${safeRate}%`}
              </div>
              {wide && (
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 11,
                    color: "rgba(148,163,184,0.9)"
                  }}
                >
                  Of this month&apos;s income
                </div>
              )}
            </div>

            <div
              style={{
                padding: wide ? "16px" : "9px 6px",
                borderRadius: wide ? 16 : 12,
                background: "#131A2B",
                border: "1px solid var(--border)",
                minWidth: 0
              }}
            >
              <div
                style={{
                  fontSize: wide ? 11 : 9,
                  textTransform: "uppercase",
                  letterSpacing: 0.06,
                  color: "rgba(148,163,184,0.9)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                Cash cushion
              </div>
              <div
                style={{
                  marginTop: wide ? 6 : 3,
                  fontSize: wide ? 22 : 15,
                  fontWeight: 700,
                  color: "#38BDF8",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                <MaskedValue value={`£${cashCushion.toLocaleString()}`} />
              </div>
              {wide && (
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 11,
                    color: "rgba(148,163,184,0.9)"
                  }}
                >
                  Across savings accounts
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity + Bills — side by side now that they span full width */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: wide
              ? "minmax(0,1fr) minmax(0,1fr)"
              : "minmax(0,1fr)",
            gap: 14,
            marginTop: wide ? 4 : 16,
            minWidth: 0
          }}
        >
          <Card
            title="Recent activity"
            subtitle="Latest movements"
            compact
          >
            {recentActivity.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  fontSize: 13,
                  color: "var(--subtext)"
                }}
              >
                As you start adding income,
                bills and spending, they&apos;ll
                show here.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }}
              >
                {recentActivity.map((item, idx) => {
                  const amount = Number(
                    item.amount || 0
                  )
                  const positive =
                    amount >= 0
                  return (
                    <div
                      key={idx}
                      style={{
                        display: "grid",
                        gridTemplateColumns: wide
                          ? "minmax(0,1.5fr) minmax(0,1fr) auto"
                          : "minmax(0,1fr)",
                        gap: 6,
                        alignItems: wide
                          ? "baseline"
                          : "flex-start",
                        padding: wide ? 8 : 7,
                        borderRadius: 10,
                        background:
                          "rgba(15,23,42,0.9)",
                        border:
                          "1px solid rgba(30,41,59,0.9)"
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600
                          }}
                        >
                          {item.label || "Activity"}
                        </div>
                        <div
                          style={{
                            marginTop: 1,
                            fontSize: 11,
                            color: "var(--subtext)"
                          }}
                        >
                          {item.category ||
                            "Uncategorised"}
                        </div>
                      </div>

                      {wide ? (
                        <>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--subtext)"
                            }}
                          >
                            {item.date
                              ? new Date(
                                  item.date
                                ).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short"
                                  }
                                )
                              : "No date"}
                          </div>

                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: positive
                                ? "#22C55E"
                                : "#F97316",
                              textAlign: "right"
                            }}
                          >
                            {positive ? "+" : "-"}£
                            {Math.abs(
                              amount
                            ).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            marginTop: 4,
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "baseline",
                            width: "100%"
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--subtext)"
                            }}
                          >
                            {item.date
                              ? new Date(
                                  item.date
                                ).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "short"
                                  }
                                )
                              : "No date"}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: positive
                                ? "#22C55E"
                                : "#F97316"
                            }}
                          >
                            {positive ? "+" : "-"}£
                            {Math.abs(
                              amount
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          <Card
            title="Upcoming bills"
            subtitle="What&apos;s due next"
            compact
          >
            {upcomingBills.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  fontSize: 13,
                  color: "var(--subtext)"
                }}
              >
                Add your regular commitments to
                see them here.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6
                }}
              >
                {upcomingBills.map((bill, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: wide
                        ? "minmax(0,1.4fr) auto auto"
                        : "minmax(0,1fr)",
                      gap: 6,
                      alignItems: "center",
                      padding: wide ? 8 : 7,
                      borderRadius: 10,
                      background:
                        "rgba(15,23,42,0.9)",
                      border:
                        "1px solid rgba(30,41,59,0.9)"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600
                        }}
                      >
                        {bill.name ||
                          bill.label ||
                          "Bill"}
                      </div>
                      <div
                        style={{
                          marginTop: 1,
                          fontSize: 11,
                          color: "var(--subtext)"
                        }}
                      >
                        {bill.frequency ||
                          "Monthly"}
                      </div>
                    </div>

                    {wide ? (
                      <>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--subtext)",
                            textAlign: "right"
                          }}
                        >
                          {bill.nextDate
                            ? new Date(
                                bill.nextDate
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short"
                                }
                              )
                            : "Next date tbc"}
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#F97316",
                            textAlign: "right"
                          }}
                        >
                          £
                          {Number(
                            bill.amount || 0
                          ).toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          marginTop: 4,
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "baseline",
                          width: "100%"
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--subtext)"
                          }}
                        >
                          {bill.nextDate
                            ? new Date(
                                bill.nextDate
                              ).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short"
                                }
                              )
                            : "Next date tbc"}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#F97316"
                          }}
                        >
                          £
                          {Number(
                            bill.amount || 0
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Core stats – smaller, more app-like tiles */}
      <Section>
        <Grid>
          <StatCard
            title="Income"
            icon="💼"
            value={<MaskedValue value={`£${incomeTotal.toLocaleString()}`} />}
            colour="var(--accent)"
            subtitle="Monthly income"
          />

          <StatCard
            title="Commitments"
            icon="📄"
            value={
              <MaskedValue value={`£${commitmentsTotal.toLocaleString()}`} />
            }
            colour="var(--accent)"
            subtitle="Monthly bills"
          />

          <StatCard
            title="Expenses"
            icon="💸"
            value={
              <MaskedValue value={`£${expensesTotal.toLocaleString()}`} />
            }
            colour="var(--accent)"
            subtitle="Monthly spending"
          />

          <StatCard
            title="Money Left"
            icon="💷"
            value={<MaskedValue value={`£${leftover.toLocaleString()}`} />}
            colour={
              leftover >= 0
                ? "#22C55E"
                : "#EF4444"
            }
            subtitle="After bills & spending"
          />

          <StatCard
            title="Savings"
            icon="🏦"
            value={<MaskedValue value={`£${cashCushion.toLocaleString()}`} />}
            colour="var(--accent)"
            subtitle="Cash savings"
          />

          <StatCard
            title="Wasted"
            icon="🧾"
            value={
              <MaskedValue
                value={`£${wastedOnNonEssentials.toLocaleString()}`}
              />
            }
            colour="#F97316"
            subtitle="Non-essential spend"
          />

          <StatCard
            title="Investments"
            icon="📈"
            value={
              <MaskedValue value={`£${investmentsTotal.toLocaleString()}`} />
            }
            colour="var(--accent)"
            subtitle="Portfolio"
          />

          <div style={{ gridColumn: wide ? "auto" : "1 / -1" }}>
            <StatCard
              title="Debt"
              icon="💳"
              value={
                <MaskedValue value={`£${debtTotal.toLocaleString()}`} />
              }
              colour="#EF4444"
              subtitle="Outstanding"
            />
          </div>
        </Grid>
      </Section>

      {/* Goals row – toned down, less loud than before */}
      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: wide
              ? "minmax(0,1.4fr) minmax(0,1fr)"
              : "minmax(0,1fr)",
            gap: 16,
            alignItems: "stretch"
          }}
        >
          <Card
            title="House deposit"
            subtitle="Progress towards your goal"
            compact
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "baseline",
                marginBottom: 10
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--subtext)"
                  }}
                >
                  Saved
                </div>
                <div
                  style={{
                    fontSize: wide ? 24 : 22,
                    fontWeight: 700
                  }}
                >
                  <MaskedValue value={`£${depositSaved.toLocaleString()}`} />
                </div>
              </div>

              <div
                style={{
                  textAlign: "right"
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--subtext)"
                  }}
                >
                  Target
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600
                  }}
                >
                  <MaskedValue value={`£${depositTarget.toLocaleString()}`} />
                </div>
              </div>
            </div>

            <div
              style={{
                height: 10,
                background: "#020617",
                borderRadius: 999,
                overflow: "hidden",
                position: "relative",
                boxShadow:
                  "0 0 0 1px rgba(15,23,42,0.9)"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: `${depositPercent}%`,
                  maxWidth: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg,var(--accent),var(--accent2))"
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                fontSize: 12
              }}
            >
              <span
                style={{
                  color: "var(--subtext)"
                }}
              >
                {depositPercent}% of target
              </span>

              <span
                style={{
                  padding:
                    "3px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.08,
                  background:
                    "rgba(34,197,94,0.10)",
                  color: "#4ADE80",
                  border:
                    "1px solid rgba(34,197,94,0.4)"
                }}
              >
                {depositPercent >= 100
                  ? "Ready"
                  : depositPercent >= 60
                  ? "On track"
                  : depositPercent >= 30
                  ? "Building"
                  : "Early days"}
              </span>
            </div>
          </Card>

          <Card
            title={`${attackPlanTitle} plan`}
            subtitle="One focused month"
            compact
          >
            <div
              style={{
                marginBottom: 10,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center"
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--subtext)"
                }}
              >
                Progress
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {plannerPercent}%
              </span>
            </div>

            <div
              style={{
                height: 9,
                background: "#020617",
                borderRadius: 999,
                overflow: "hidden",
                position: "relative",
                boxShadow:
                  "0 0 0 1px rgba(15,23,42,0.9)"
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: `${plannerPercent}%`,
                  maxWidth: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg,var(--accent),var(--accent2))"
                }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                display: "grid",
                gridTemplateColumns: wide
                  ? "repeat(3,minmax(0,1fr))"
                  : "minmax(0,1fr)",
                gap: 6,
                fontSize: 11
              }}
            >
              {attackSteps.map((step) => {
                const done = step.done
                return (
                  <div
                    key={step.key}
                    style={{
                      padding: 8,
                      borderRadius: 9,
                      background: done
                        ? "rgba(255,138,0,0.12)"
                        : "rgba(15,23,42,0.9)",
                      border: done
                        ? "1px solid rgba(255,138,0,0.5)"
                        : "1px solid rgba(30,41,59,0.9)",
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start"
                    }}
                  >
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        flexShrink: 0,
                        marginTop: 1,
                        border: done
                          ? "none"
                          : "2px solid rgba(255,255,255,.25)",
                        background: done
                          ? "var(--accent)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#1a1005",
                        fontWeight: 700
                      }}
                    >
                      {done ? "✓" : ""}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          textDecoration: done
                            ? "line-through"
                            : "none",
                          opacity: done ? 0.75 : 1
                        }}
                      >
                        {step.title}
                      </div>
                      <div
                        style={{
                          marginTop: 2,
                          color: "var(--subtext)"
                        }}
                      >
                        {step.description}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </Section>

    </Page>
  )
}
