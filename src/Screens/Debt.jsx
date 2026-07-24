import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Debt({
  store,
  add,
  remove
}) {
  if (!store) return null

  const debts = [...(store.debts || [])]

  debts.sort(
    (a, b) =>
      Number(b.balance || 0) -
      Number(a.balance || 0)
  )

  const totalDebt = debts.reduce(
    (sum, debt) =>
      sum + Number(debt.balance || 0),
    0
  )

  const totalMonthly = debts.reduce(
    (sum, debt) =>
      sum + Number(debt.minPayment || 0),
    0
  )

  const averageDebt =
    debts.length > 0
      ? totalDebt / debts.length
      : 0

  const debtFreeMonths =
    totalMonthly > 0
      ? Math.ceil(totalDebt / totalMonthly)
      : 0

  const [form, setForm] = useState({
    name: "",
    balance: "",
    minPayment: ""
  })

  function submit(e) {
    e.preventDefault()

    if (!form.name.trim()) return

    add("debts", {
      name: form.name,
      balance: Number(form.balance),
      minPayment: Number(form.minPayment)
    })

    setForm({
      name: "",
      balance: "",
      minPayment: ""
    })
  }

  return (
    <Page>

      <HeroBanner
        title="Debt Manager 💳"
        subtitle="Track every debt and watch your balances fall."
      />

      <Grid>

        <StatCard
          title="Total Debt"
          icon="💳"
          value={`£${totalDebt.toLocaleString()}`}
          colour="#EF4444"
          subtitle="Outstanding balance"
        />

        <StatCard
          title="Monthly Payments"
          icon="💷"
          value={`£${totalMonthly.toLocaleString()}`}
          colour="#3B82F6"
          subtitle="Minimum payments"
        />

        <StatCard
          title="Accounts"
          icon="📋"
          value={debts.length}
          colour="#8B5CF6"
          subtitle="Open debts"
        />

        <StatCard
          title="Average Debt"
          icon="📊"
          value={`£${averageDebt.toFixed(0)}`}
          colour="#F59E0B"
          subtitle="Per account"
        />

        <StatCard
          title="Debt Free"
          icon="🏁"
          value={`${debtFreeMonths} Months`}
          colour="#22C55E"
          subtitle="Estimated"
        />

      </Grid>

      <Card title="📉 Your Debts">

        {debts.length === 0 ? (

          <div
            style={{
              color: "var(--subtext)"
            }}
          >
            No debts added yet.
          </div>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >

            {debts.map((debt, index) => {

              const percentage =
                totalDebt > 0
                  ? (Number(debt.balance) /
                      totalDebt) *
                    100
                  : 0

              return (

                <div
                  key={index}
                  style={{
                    background: "#162032",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: 20
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 700
                        }}
                      >
                        {debt.name}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: "var(--subtext)"
                        }}
                      >
                        Balance:
                        £{Number(
                          debt.balance
                        ).toLocaleString()}
                      </div>

                      <div
                        style={{
                          color: "var(--subtext)"
                        }}
                      >
                        Monthly Payment:
                        £{Number(
                          debt.minPayment
                        ).toLocaleString()}
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        remove("debts", index)
                      }
                      style={{
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 18px",
                        cursor: "pointer",
                        background:
                          "#DC2626",
                        color: "#fff",
                        fontWeight: 700
                      }}
                    >
                      Remove
                    </button>

                  </div>

                  <div
                    style={{
                      marginTop: 18,
                      height: 10,
                      background: "#243244",
                      borderRadius: 999,
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg,#F97316,#EF4444)"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "var(--subtext)",
                      fontSize: 13
                    }}
                  >
                    {percentage.toFixed(1)}% of
                    your total debt
                  </div>

                </div>

              )
            })}

          </div>

        )}

      </Card>
      
      <Card title="➕ Add Debt">

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            placeholder="Debt Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
            }
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            type="number"
            placeholder="Outstanding Balance"
            value={form.balance}
            onChange={(e) =>
              setForm({
                ...form,
                balance: e.target.value
              })
            }
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <input
            type="number"
            placeholder="Monthly Payment"
            value={form.minPayment}
            onChange={(e) =>
              setForm({
                ...form,
                minPayment: e.target.value
              })
            }
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          />

          <button
            type="submit"
            style={{
              border: "none",
              borderRadius: 12,
              padding: 15,
              cursor: "pointer",
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(135deg,#F97316,#EF4444)"
            }}
          >
            Add Debt
          </button>

        </form>

      </Card>

    </Page>
  )
}