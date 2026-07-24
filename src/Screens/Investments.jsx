import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Investments({
  store,
  add,
  remove
}) {
  if (!store) return null

  const investments = Array.isArray(store.investments)
    ? [...store.investments]
    : []

  investments.sort(
    (a, b) =>
      Number(b.balance || 0) -
      Number(a.balance || 0)
  )

  const totalInvestments = investments.reduce(
    (sum, item) =>
      sum + Number(item.balance || 0),
    0
  )

  const averageInvestment =
    investments.length
      ? totalInvestments / investments.length
      : 0

  const largestInvestment =
    investments.length
      ? Math.max(
          ...investments.map((i) =>
            Number(i.balance || 0)
          )
        )
      : 0

  const [form, setForm] = useState({
    name: "",
    balance: "",
    type: ""
  })

  function submit(e) {
    e.preventDefault()

    if (!form.name.trim()) return

    add("investments", {
      name: form.name,
      balance: Number(form.balance),
      type: form.type
    })

    setForm({
      name: "",
      balance: "",
      type: ""
    })
  }

  return (
    <Page>

      <HeroBanner
        title="Investment Portfolio 📈"
        subtitle="Track your investments and grow your future."
      />

      <Grid>

        <StatCard
          title="Portfolio Value"
          icon="💰"
          value={`£${totalInvestments.toLocaleString()}`}
          colour="#22C55E"
          subtitle="Total invested"
        />

        <StatCard
          title="Holdings"
          icon="💼"
          value={investments.length}
          colour="#3B82F6"
          subtitle="Investments"
        />

        <StatCard
          title="Average Value"
          icon="📊"
          value={`£${averageInvestment.toFixed(0)}`}
          colour="#F59E0B"
          subtitle="Per holding"
        />

        <StatCard
          title="Largest Holding"
          icon="🏆"
          value={`£${largestInvestment.toLocaleString()}`}
          colour="#8B5CF6"
          subtitle="Highest value"
        />

      </Grid>

      <Card title="📈 Portfolio">

        {investments.length === 0 ? (

          <div style={{ color: "var(--subtext)" }}>
            No investments added yet.
          </div>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >

            {investments.map((item, index) => {

              const percentage =
                totalInvestments > 0
                  ? (Number(item.balance) /
                      totalInvestments) *
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
                        £{Number(
                          item.balance
                        ).toLocaleString()}
                        {" • "}
                        {item.type}
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        remove(
                          "investments",
                          index
                        )
                      }
                      style={{
                        border: "none",
                        borderRadius: 10,
                        padding: "10px 18px",
                        cursor: "pointer",
                        background: "#DC2626",
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
                    your portfolio
                  </div>

                </div>

              )
            })}

          </div>

        )}

      </Card>
       <Card title="➕ Add Investment">

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            placeholder="Investment Name"
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
            placeholder="Current Value"
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

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value
              })
            }
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--text)"
            }}
          >
            <option value="">Select Investment Type</option>
            <option value="Stocks">Stocks</option>
            <option value="ETF">ETF</option>
            <option value="ISA">ISA</option>
            <option value="Crypto">Crypto</option>
            <option value="Pension">Pension</option>
            <option value="Property">Property</option>
            <option value="Other">Other</option>
          </select>

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
            Add Investment
          </button>

        </form>

      </Card>

    </Page>
  )
}