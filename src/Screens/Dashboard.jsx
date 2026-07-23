import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import NetWorthCard from "../components/NetworthCard.jsx"

import {
  HeroBanner,
  StatCard,
  Grid,
  Section
} from "../components/ui/index.js"

const isWideScreen = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 960px)").matches

export default function Dashboard({ store, setScreen }) {
  if (!store) return null

  const incomeTotal =
    (store.income || []).reduce(
      (t, i) => t + Number(i.amount || 0),
      0
    )

  const commitmentsTotal =
    (store.commitments || []).reduce(
      (t, c) => t + Number(c.amount || 0),
      0
    )

  const expensesTotal =
    (store.expenses || []).reduce(
      (t, e) => t + Number(e.amount || 0),
      0
    )

  const savingsTotal =
    (store.savings || []).reduce(
      (t, s) => t + Number(s.balance || 0),
      0
    )

  const debtTotal =
    (store.debts || []).reduce(
      (t, d) => t + Number(d.balance || 0),
      0
    )

  const investmentsTotal =
    (store.investments || []).reduce(
      (t, i) => t + Number(i.balance || 0),
      0
    )

  const depositSaved = Number(store.deposit?.current || 0)
  const depositTarget = Number(store.deposit?.target || 25000)

  const leftover =
    incomeTotal -
    commitmentsTotal -
    expensesTotal

  const depositPercent =
    depositTarget > 0
      ? Math.min(
          100,
          Math.round((depositSaved / depositTarget) * 100)
        )
      : 0

  const plannerPercent = 62

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

  const wide = isWideScreen()

  return (
    <Page>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: wide
            ? "minmax(0,1.6fr) minmax(0,1.2fr)"
            : "minmax(0,1fr)",
          gap: wide ? 24 : 16,
          alignItems: "flex-start",
          marginBottom: wide ? 24 : 16
        }}
      >
        <div style={{ minWidth: 0 }}>
          <HeroBanner
            title="Welcome back, Shirzad 👋"
            subtitle="Your money at a glance – clear, calm and under control."
          />

          <div
            style={{
              marginTop: wide ? 16 : 12,
              display: "grid",
              gridTemplateColumns: wide
                ? "minmax(0,1.4fr) minmax(0,1fr)"
                : "minmax(0,1fr)",
              gap: 16
            }}
          >
            <NetWorthCard store={store} />

            <Card
              title="📅 This Month"
              subtitle="Key signals for your plan"
              compact={!wide}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(120px,1fr))",
                  gap: 10
                }}
              >
                <div
                  style={{
                    padding: wide ? 14 : 12,
                    borderRadius: 14,
                    background:
                      "linear-gradient(135deg,#064E3B,#022C22)",
                    border:
                      "1px solid rgba(34,197,94,0.3)"
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.06,
                      color: "rgba(209,250,229,0.7)"
                    }}
                  >
                    Money Left
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 22 : 20,
                      fontWeight: 700,
                      color: "#BBF7D0"
                    }}
                  >
                    £{leftover.toLocaleString()}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "rgba(209,250,229,0.8)"
                    }}
                  >
                    After income, bills &amp; spending
                  </div>
                </div>

                <div
                  style={{
                    padding: wide ? 14 : 12,
                    borderRadius: 14,
                    background: "#020617",
                    border:
                      "1px solid rgba(148,163,184,0.35)"
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.06,
                      color: "rgba(148,163,184,0.9)"
                    }}
                  >
                    Savings Rate
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 22 : 20,
                      fontWeight: 700,
                      color:
                        safeRate >= 20
                          ? "#4ADE80"
                          : safeRate >= 10
                          ? "#FACC15"
                          : "#F97316"
                    }}
                  >
                    {isNaN(safeRate)
                      ? "–"
                      : `${safeRate}%`}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "var(--subtext)"
                    }}
                  >
                    Of your income this month
                  </div>
                </div>

                <div
                  style={{
                    padding: wide ? 14 : 12,
                    borderRadius: 14,
                    background: "#020617",
                    border:
                      "1px solid rgba(148,163,184,0.35)"
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.06,
                      color: "rgba(148,163,184,0.9)"
                    }}
                  >
                    Cash Cushion
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 22 : 20,
                      fontWeight: 700,
                      color: "#38BDF8"
                    }}
                  >
                    £{savingsTotal.toLocaleString()}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "var(--subtext)"
                    }}
                  >
                    Across your savings pots
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: wide ? 8 : 16,
            minWidth: 0
          }}
        >
          <Card
            title="📰 Recent Activity"
            subtitle="Latest movements across your plan"
            compact={!wide}
          >
            {recentActivity.length === 0 ? (
              <div
                style={{
                  padding: 14,
                  fontSize: 14,
                  color: "var(--subtext)"
                }}
              >
                No recent activity yet. As you add
                income, bills and spending, they'll
                show here.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
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
                        gap: 8,
                        alignItems: wide
                          ? "baseline"
                          : "flex-start",
                        padding: wide ? 10 : 8,
                        borderRadius: 12,
                        background:
                          "rgba(15,23,42,0.9)",
                        border:
                          "1px solid rgba(51,65,85,0.9)"
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600
                          }}
                        >
                          {item.label || "Activity"}
                        </div>
                        <div
                          style={{
                            marginTop: 2,
                            fontSize: 12,
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
                              fontSize: 12,
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
                              fontSize: 15,
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
                            marginTop: 6,
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems: "baseline",
                            width: "100%"
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
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
                              fontSize: 15,
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
            title="📆 Upcoming Bills"
            subtitle="What's leaving your account next"
            compact={!wide}
          >
            {upcomingBills.length === 0 ? (
              <div
                style={{
                  padding: 14,
                  fontSize: 14,
                  color: "var(--subtext)"
                }}
              >
                Add your regular commitments and
                direct debits to see them here.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
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
                      gap: 8,
                      alignItems: "center",
                      padding: wide ? 10 : 8,
                      borderRadius: 12,
                      background:
                        "rgba(15,23,42,0.9)",
                      border:
                        "1px solid rgba(51,65,85,0.9)"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600
                        }}
                      >
                        {bill.name ||
                          bill.label ||
                          "Bill"}
                      </div>
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 12,
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
                            fontSize: 13,
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
                            fontSize: 15,
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
                          marginTop: 6,
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "baseline",
                          width: "100%"
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
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
                            fontSize: 15,
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

      <Section>
        <Grid>
          <StatCard
            title="Income"
            icon="💼"
            value={`£${incomeTotal.toLocaleString()}`}
            colour="#22C55E"
            subtitle="Monthly income"
          />

          <StatCard
            title="Commitments"
            icon="📄"
            value={`£${commitmentsTotal.toLocaleString()}`}
            colour="#EC4899"
            subtitle="Monthly bills"
          />

          <StatCard
            title="Expenses"
            icon="💸"
            value={`£${expensesTotal.toLocaleString()}`}
            colour="#F97316"
            subtitle="Monthly spending"
          />

          <StatCard
            title="Money Left"
            icon="💷"
            value={`£${leftover.toLocaleString()}`}
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
            value={`£${savingsTotal.toLocaleString()}`}
            colour="#3B82F6"
            subtitle="Cash savings"
          />

          <StatCard
            title="Investments"
            icon="📈"
            value={`£${investmentsTotal.toLocaleString()}`}
            colour="#F59E0B"
            subtitle="Portfolio"
          />

          <StatCard
            title="Debt"
            icon="💳"
            value={`£${debtTotal.toLocaleString()}`}
            colour="#EF4444"
            subtitle="Outstanding"
          />
        </Grid>
      </Section>

      <Section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: wide
              ? "minmax(0,1.4fr) minmax(0,1fr)"
              : "minmax(0,1fr)",
            gap: 18,
            alignItems: "stretch"
          }}
        >
          <Card
            title="🏠 House Deposit Journey"
            subtitle="Track how close you are to getting the keys"
            compact={!wide}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "baseline",
                marginBottom: wide ? 14 : 10
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--subtext)"
                  }}
                >
                  Current deposit
                </div>
                <div
                  style={{
                    fontSize: wide ? 26 : 22,
                    fontWeight: 700
                  }}
                >
                  £
                  {depositSaved.toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right"
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--subtext)"
                  }}
                >
                  Target
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 600
                  }}
                >
                  £
                  {depositTarget.toLocaleString()}
                </div>
              </div>
            </div>

            <div
              style={{
                height: wide ? 16 : 14,
                background:
                  "linear-gradient(90deg,#020617,#020617)",
                borderRadius: 999,
                overflow: "hidden",
                position: "relative",
                boxShadow:
                  "0 0 0 1px rgba(15,23,42,0.9)"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 0% 50%,rgba(74,222,128,0.35),transparent 60%)"
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: `${depositPercent}%`,
                  maxWidth: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg,#4ADE80,#22C55E)",
                  boxShadow:
                    "0 0 14px rgba(34,197,94,0.65)",
                  transition: "width .35s ease-out"
                }}
              />
            </div>

            <div
              style={{
                marginTop: 10,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                fontSize: 13
              }}
            >
              <span
                style={{
                  color: "var(--subtext)"
                }}
              >
                {depositPercent}% of your deposit
                target saved
              </span>

              <span
                style={{
                  padding:
                    wide
                      ? "4px 10px"
                      : "3px 8px",
                  borderRadius: 999,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 0.08,
                  background:
                    "rgba(34,197,94,0.12)",
                  color: "#4ADE80",
                  border:
                    "1px solid rgba(34,197,94,0.4)"
                }}
              >
                {depositPercent >= 100
                  ? "Ready for completion"
                  : depositPercent >= 60
                  ? "On track"
                  : depositPercent >= 30
                  ? "Building momentum"
                  : "Early days"}
              </span>
            </div>
          </Card>

          <Card
            title="🔥 September Attack Plan"
            subtitle="Focused push to tidy and boost your finances"
            compact={!wide}
          >
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center"
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: "var(--subtext)"
                }}
              >
                Progress towards this month's plan
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
                height: wide ? 12 : 10,
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
                    "linear-gradient(135deg,#3B82F6,#2563EB)",
                  boxShadow:
                    "0 0 14px rgba(37,99,235,0.6)"
                }}
              />
            </div>

            <div
              style={{
                marginTop: 12,
                display: "grid",
                gridTemplateColumns: wide
                  ? "repeat(3,minmax(0,1fr))"
                  : "minmax(0,1fr)",
                gap: 8,
                fontSize: 12
              }}
            >
              <div
                style={{
                  padding: wide ? 10 : 8,
                  borderRadius: 10,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  Debt clean‑up
                </div>
                <div
                  style={{
                    marginTop: 2,
                    color: "var(--subtext)"
                  }}
                >
                  Focus highest‑interest balances
                  first.
                </div>
              </div>
              <div
                style={{
                  padding: wide ? 10 : 8,
                  borderRadius: 10,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  Spending reset
                </div>
                <div
                  style={{
                    marginTop: 2,
                    color: "var(--subtext)"
                  }}
                >
                  Tighten variable expenses and
                  subscriptions.
                </div>
              </div>
              <div
                style={{
                  padding: wide ? 10 : 8,
                  borderRadius: 10,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(51,65,85,0.9)"
                }}
              >
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  Deposit boost
                </div>
                <div
                  style={{
                    marginTop: 2,
                    color: "var(--subtext)"
                  }}
                >
                  Direct every spare £ into the
                  house pot.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section>
        <Card
          title="📊 Monthly Snapshot"
          subtitle="A clean overview of how this month stacks up"
          compact={!wide}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 14
            }}
          >
            <div
              style={{
                padding: wide ? 20 : 16,
                background:
                  "radial-gradient(circle at 0 0,#172554,#020617)",
                borderRadius: 18,
                border:
                  "1px solid rgba(59,130,246,0.5)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 13
                }}
              >
                Monthly Income
              </div>

              <div
                style={{
                  fontSize: wide ? 30 : 24,
                  fontWeight: 700,
                  marginTop: 6
                }}
              >
                £{incomeTotal.toLocaleString()}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--subtext)"
                }}
              >
                All pay, benefits and side‑income
              </div>
            </div>

            <div
              style={{
                padding: wide ? 20 : 16,
                background:
                  "radial-gradient(circle at 0 0,#451A03,#020617)",
                borderRadius: 18,
                border:
                  "1px solid rgba(249,115,22,0.4)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 13
                }}
              >
                Monthly Expenses
              </div>

              <div
                style={{
                  fontSize: wide ? 30 : 24,
                  fontWeight: 700,
                  color: "#F97316",
                  marginTop: 6
                }}
              >
                £{expensesTotal.toLocaleString()}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--subtext)"
                }}
              >
                Everything outside fixed bills
              </div>
            </div>

            <div
              style={{
                padding: wide ? 20 : 16,
                background:
                  "radial-gradient(circle at 0 0,#052E16,#020617)",
                borderRadius: 18,
                border:
                  "1px solid rgba(34,197,94,0.5)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 13
                }}
              >
                Money Left
              </div>

              <div
                style={{
                  fontSize: wide ? 30 : 24,
                  fontWeight: 700,
                  color:
                    leftover >= 0
                      ? "#22C55E"
                      : "#EF4444",
                  marginTop: 6
                }}
              >
                £{leftover.toLocaleString()}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--subtext)"
                }}
              >
                Ready for savings, investing or
                overpayments
              </div>
            </div>

            <div
              style={{
                padding: wide ? 20 : 16,
                background:
                  "radial-gradient(circle at 0 0,#022C22,#020617)",
                borderRadius: 18,
                border:
                  "1px solid rgba(74,222,128,0.4)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 13
                }}
              >
                Total Assets
              </div>

              <div
                style={{
                  fontSize: wide ? 30 : 24,
                  fontWeight: 700,
                  color: "#4ADE80",
                  marginTop: 6
                }}
              >
                £
                {(
                  savingsTotal +
                  investmentsTotal +
                  depositSaved
                ).toLocaleString()}
              </div>

              <div
                style={{
                  marginTop: 6,
                  fontSize: 12,
                  color: "var(--subtext)"
                }}
              >
                Savings, investments &amp; house
                deposit combined
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  )
}