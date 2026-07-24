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

export default function Dashboard({ store }) {
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
      {/* Top row: hero + net worth & compact monthly overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: wide
            ? "minmax(0,1.5fr) minmax(0,1.1fr)"
            : "minmax(0,1fr)",
          gap: wide ? 24 : 16,
          alignItems: "flex-start",
          marginBottom: wide ? 20 : 12
        }}
      >
        <div style={{ minWidth: 0 }}>
          <HeroBanner
            title="Welcome back, Shirzad 👋"
            subtitle="Stay on top of your money with a clear, calm overview."
          />

          <div
            style={{
              marginTop: wide ? 16 : 12,
              display: "grid",
              gridTemplateColumns: wide
                ? "minmax(0,1.1fr) minmax(0,1fr)"
                : "minmax(0,1fr)",
              gap: 16
            }}
          >
            <NetWorthCard store={store} />

            <Card
              title="This Month"
              subtitle="Quick signal check"
              compact
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(120px,1fr))",
                  gap: 10
                }}
              >
                {/* Money Left – subtle green, smaller than before */}
                <div
                  style={{
                    padding: wide ? 12 : 10,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg,#022C22,#011619)",
                    border:
                      "1px solid rgba(34,197,94,0.35)"
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.06,
                      color: "rgba(190,242,100,0.8)"
                    }}
                  >
                    Money left
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 20 : 18,
                      fontWeight: 700,
                      color: "#BBF7D0"
                    }}
                  >
                    £{leftover.toLocaleString()}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 11,
                      color: "rgba(148,163,184,0.9)"
                    }}
                  >
                    After income &amp; outgoings
                  </div>
                </div>

                {/* Savings rate – smaller, pill feel */}
                <div
                  style={{
                    padding: wide ? 12 : 10,
                    borderRadius: 12,
                    background: "#020617",
                    border:
                      "1px solid rgba(148,163,184,0.28)"
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
                    Savings rate
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 20 : 18,
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
                      marginTop: 3,
                      fontSize: 11,
                      color: "rgba(148,163,184,0.9)"
                    }}
                  >
                    Of this month&apos;s income
                  </div>
                </div>

                {/* Cash cushion – calm blue */}
                <div
                  style={{
                    padding: wide ? 12 : 10,
                    borderRadius: 12,
                    background: "#020617",
                    border:
                      "1px solid rgba(148,163,184,0.28)"
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
                    Cash cushion
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: wide ? 20 : 18,
                      fontWeight: 700,
                      color: "#38BDF8"
                    }}
                  >
                    £{savingsTotal.toLocaleString()}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 11,
                      color: "rgba(148,163,184,0.9)"
                    }}
                  >
                    Across savings accounts
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right: Activity + Bills in a cleaner, app-like card stack */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
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
                  £
                  {depositTarget.toLocaleString()}
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
                    "linear-gradient(135deg,#4ADE80,#22C55E)"
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
            title="September attack plan"
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
                    "linear-gradient(135deg,#60A5FA,#2563EB)"
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
              <div
                style={{
                  padding: 8,
                  borderRadius: 9,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(30,41,59,0.9)"
                }}
              >
                <div
                  style={{
                    fontWeight: 600
                  }}
                >
                  Debt tidy‑up
                </div>
                <div
                  style={{
                    marginTop: 2,
                    color: "var(--subtext)"
                  }}
                >
                  Hit highest‑interest first.
                </div>
              </div>
              <div
                style={{
                  padding: 8,
                  borderRadius: 9,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(30,41,59,0.9)"
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
                  Trim non‑essentials.
                </div>
              </div>
              <div
                style={{
                  padding: 8,
                  borderRadius: 9,
                  background:
                    "rgba(15,23,42,0.9)",
                  border:
                    "1px solid rgba(30,41,59,0.9)"
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
                  Funnel surplus into house.
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      {/* Bottom snapshot – calmer, more compact tiles */}
      <Section>
        <Card
          title="Monthly snapshot"
          subtitle="How this month stacks up"
          compact
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(200px,1fr))",
              gap: 14
            }}
          >
            <div
              style={{
                padding: 16,
                background:
                  "radial-gradient(circle at 0 0,#111827,#020617)",
                borderRadius: 14,
                border:
                  "1px solid rgba(55,65,81,0.8)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 12
                }}
              >
                Monthly income
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginTop: 4
                }}
              >
                £{incomeTotal.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                background:
                  "radial-gradient(circle at 0 0,#111827,#020617)",
                borderRadius: 14,
                border:
                  "1px solid rgba(55,65,81,0.8)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 12
                }}
              >
                Monthly expenses
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#F97316",
                  marginTop: 4
                }}
              >
                £{expensesTotal.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                background:
                  "radial-gradient(circle at 0 0,#111827,#020617)",
                borderRadius: 14,
                border:
                  "1px solid rgba(55,65,81,0.8)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 12
                }}
              >
                Money left
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color:
                    leftover >= 0
                      ? "#22C55E"
                      : "#EF4444",
                  marginTop: 4
                }}
              >
                £{leftover.toLocaleString()}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                background:
                  "radial-gradient(circle at 0 0,#111827,#020617)",
                borderRadius: 14,
                border:
                  "1px solid rgba(55,65,81,0.8)"
              }}
            >
              <div
                style={{
                  color: "var(--subtext)",
                  fontSize: 12
                }}
              >
                Total assets
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#4ADE80",
                  marginTop: 4
                }}
              >
                £
                {(
                  savingsTotal +
                  investmentsTotal +
                  depositSaved
                ).toLocaleString()}
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </Page>
  )
}