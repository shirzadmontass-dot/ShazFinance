import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Deposit({
  store,
  update
}) {
  if (!store) return null

  const deposit = store.deposit || {
    current: 0,
    target: 25000,
    monthly: 500
  }

  const current = Number(deposit.current || 0)
  const target = Number(deposit.target || 25000)
  const monthly = Number(deposit.monthly || 500)

  const remaining = Math.max(
    target - current,
    0
  )

  const progress =
    target > 0
      ? Math.min(
          100,
          (current / target) * 100
        )
      : 0

  const monthsRemaining =
    monthly > 0
      ? Math.ceil(remaining / monthly)
      : 0

  const [form, setForm] = useState({
    current,
    target,
    monthly
  })

  function submit(e) {
    e.preventDefault()

    update(
      "deposit.current",
      Number(form.current)
    )

    update(
      "deposit.target",
      Number(form.target)
    )

    update(
      "deposit.monthly",
      Number(form.monthly)
    )
  }

  return (
    <Page>

      <HeroBanner
        title="House Deposit 🏠"
        subtitle="Track your journey towards buying your first home."
      />

      <Grid>

        <StatCard
          title="Saved"
          icon="💰"
          value={`£${current.toLocaleString()}`}
          colour="#22C55E"
          subtitle="Current savings"
        />

        <StatCard
          title="Target"
          icon="🎯"
          value={`£${target.toLocaleString()}`}
          colour="#3B82F6"
          subtitle="Deposit goal"
        />

        <StatCard
          title="Remaining"
          icon="💷"
          value={`£${remaining.toLocaleString()}`}
          colour="#EF4444"
          subtitle="Still to save"
        />

        <StatCard
          title="Monthly Saving"
          icon="📅"
          value={`£${monthly.toLocaleString()}`}
          colour="#F59E0B"
          subtitle="Monthly contribution"
        />

        <StatCard
          title="Time Remaining"
          icon="⏳"
          value={`${monthsRemaining} Months`}
          colour="#8B5CF6"
          subtitle="Estimated"
        />

      </Grid>

      <Card title="🏠 Deposit Progress">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
            fontWeight: 700
          }}
        >
          <span>
            £{current.toLocaleString()}
          </span>

          <span>
            £{target.toLocaleString()}
          </span>
        </div>

        <div
          style={{
            height: 18,
            background: "#243244",
            borderRadius: 999,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background:
                "linear-gradient(135deg,#4ADE80,#22C55E)",
              transition: ".4s"
            }}
          />
        </div>

        <div
          style={{
            marginTop: 12,
            color: "var(--subtext)"
          }}
        >
          {progress.toFixed(1)}% complete
        </div>

      </Card>

      <Card title="✏️ Update Deposit Plan">
         <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            type="number"
            placeholder="Current Savings"
            value={form.current}
            onChange={(e) =>
              setForm({
                ...form,
                current: e.target.value
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
            placeholder="Target Deposit"
            value={form.target}
            onChange={(e) =>
              setForm({
                ...form,
                target: e.target.value
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
            placeholder="Monthly Contribution"
            value={form.monthly}
            onChange={(e) =>
              setForm({
                ...form,
                monthly: e.target.value
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
            Save Deposit Plan
          </button>

        </form>

      </Card>

    </Page>
  )
}