import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Savings({
  store,
  add,
  remove
}) {
  if (!store) return null

  const savings = [...(store.savings || [])]

  savings.sort(
    (a, b) =>
      Number(b.balance || 0) -
      Number(a.balance || 0)
  )

  const totalSavings = savings.reduce(
    (sum, item) =>
      sum + Number(item.balance || 0),
    0
  )

  const averageSavings =
    savings.length > 0
      ? totalSavings / savings.length
      : 0

  const largestSavings =
    savings.length > 0
      ? Math.max(
          ...savings.map((s) =>
            Number(s.balance || 0)
          )
        )
      : 0

  const [form, setForm] = useState({
    name: "",
    balance: ""
  })

  function submit(e) {
    e.preventDefault()

    if (!form.name.trim()) return

    add("savings", {
      name: form.name,
      balance: Number(form.balance)
    })

    setForm({
      name: "",
      balance: ""
    })
  }

  return (
    <Page>

      <HeroBanner
        title="Savings 💰"
        subtitle="Track every savings account and watch your wealth grow."
      />

      <Grid>

        <StatCard
          title="Total Savings"
          icon="💰"
          value={`£${totalSavings.toLocaleString()}`}
          colour="#22C55E"
          subtitle="Across all accounts"
        />

        <StatCard
          title="Accounts"
          icon="🏦"
          value={savings.length}
          colour="#3B82F6"
          subtitle="Savings accounts"
        />

        <StatCard
          title="Average Balance"
          icon="📊"
          value={`£${averageSavings.toFixed(0)}`}
          colour="#F59E0B"
          subtitle="Per account"
        />

        <StatCard
          title="Largest Account"
          icon="🏆"
          value={`£${largestSavings.toLocaleString()}`}
          colour="#8B5CF6"
          subtitle="Highest balance"
        />

      </Grid>

      <Card title="🏦 Savings Accounts">

        {savings.length === 0 ? (

          <div
            style={{
              color: "var(--subtext)"
            }}
          >
            No savings accounts added yet.
          </div>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >

            {savings.map((item, index) => {

              const percentage =
                totalSavings > 0
                  ? (Number(item.balance) /
                      totalSavings) *
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
                        {item.name}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: "var(--subtext)"
                        }}
                      >
                        Balance:
                        £{Number(
                          item.balance
                        ).toLocaleString()}
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        remove("savings", index)
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
                          "linear-gradient(135deg,#4ADE80,#22C55E)"
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
                    your total savings
                  </div>

                </div>

              )
            })}

          </div>

        )}

      </Card>
      <Card title="➕ Add Savings Account">

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            placeholder="Account Name"
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
            placeholder="Current Balance"
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
                "linear-gradient(135deg,#4ADE80,#22C55E)"
            }}
          >
            Add Savings
          </button>

        </form>

      </Card>

    </Page>
  )
}