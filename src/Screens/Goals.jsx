import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function Goals({
  store,
  add,
  remove,
  update
}) {
  if (!store) return null

  const goals = Array.isArray(store.goals)
  ? [...store.goals]
  : []

  const totalTarget = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.target || 0),
    0
  )

  const totalCurrent = goals.reduce(
    (sum, goal) =>
      sum + Number(goal.current || 0),
    0
  )

  const overallProgress =
    totalTarget > 0
      ? Math.round(
          (totalCurrent / totalTarget) * 100
        )
      : 0

  const [form, setForm] = useState({
    name: "",
    target: ""
  })

  function submit(e) {
    e.preventDefault()

    if (!form.name.trim()) return

    add("goals", {
      name: form.name,
      target: Number(form.target),
      current: 0
    })

    setForm({
      name: "",
      target: ""
    })
  }

  return (
    <Page>

      <HeroBanner
        title="Financial Goals 🎯"
        subtitle="Stay focused and watch your goals become reality."
      />

      <Grid>

        <StatCard
          title="Goals"
          icon="🎯"
          value={goals.length}
          colour="#3B82F6"
          subtitle="Active goals"
        />

        <StatCard
          title="Target"
          icon="🏁"
          value={`£${totalTarget.toLocaleString()}`}
          colour="#F59E0B"
          subtitle="Total target"
        />

        <StatCard
          title="Saved"
          icon="💰"
          value={`£${totalCurrent.toLocaleString()}`}
          colour="#22C55E"
          subtitle="Current progress"
        />

        <StatCard
          title="Complete"
          icon="📈"
          value={`${overallProgress}%`}
          colour="#8B5CF6"
          subtitle="Overall progress"
        />

      </Grid>

      <Card title="🎯 Your Goals">

        {goals.length === 0 ? (

          <div
            style={{
              color: "var(--subtext)"
            }}
          >
            No goals added yet.
          </div>

        ) : (

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18
            }}
          >

            {goals.map((goal, index) => {

              const progress =
                Number(goal.target) > 0
                  ? Math.min(
                      (Number(goal.current) /
                        Number(goal.target)) *
                        100,
                      100
                    )
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
                        {goal.name}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          color: "var(--subtext)"
                        }}
                      >
                        £{Number(
                          goal.current
                        ).toLocaleString()}
                        {" / "}
                        £{Number(
                          goal.target
                        ).toLocaleString()}
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        remove("goals", index)
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
                        width: `${progress}%`,
                        height: "100%",
                        background:
                          "linear-gradient(135deg,#4ADE80,#22C55E)"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginTop: 10
                    }}
                  >
                    <input
                      type="number"
                      value={goal.current}
                      onChange={(e) => {
                        const updated = [...goals]

                        updated[index].current =
                          Number(e.target.value) || 0

                        update("goals", updated)
                      }}
                      placeholder="Current Amount"
                      style={{
                        width: "100%",
                        padding: 14,
                        borderRadius: 12,
                        border:
                          "1px solid var(--border)",
                        background: "var(--bg)",
                        color: "var(--text)"
                      }}
                    />
                  </div>

                </div>

              )
            })}

          </div>

        )}

      </Card>
      <Card title="➕ Add Goal">

        <form
          onSubmit={submit}
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            placeholder="Goal Name"
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
            placeholder="Target Amount"
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
            Add Goal
          </button>

        </form>

      </Card>

    </Page>
  )
}