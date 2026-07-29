import { useState } from "react"

import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

import { computeMonthlyFigures } from "../utils/monthlyFigures.js"
import { resolveCategory } from "../utils/categorize.js"

export default function Expenses({
  store,
  add,
  remove
}) {
  if (!store) return null

  const expenses = store.expenses || []

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Food",
    essential: true,
    amount: ""
  })

  const manualTotalSpent = expenses.reduce(
    (t, e) => t + Number(e.amount || 0),
    0
  )
  const manualEssentialSpent = expenses
    .filter((e) => e.essential)
    .reduce((t, e) => t + Number(e.amount || 0), 0)
  const manualNonEssentialSpent = expenses
    .filter((e) => !e.essential)
    .reduce((t, e) => t + Number(e.amount || 0), 0)

  const bankTransactions = store.bankTransactions || []
  const accountRoles = store.accountRoles || {}
  const categoryOverrides = store.categoryOverrides || {}
  const hasBankData = bankTransactions.length > 0

  const monthly = hasBankData
    ? computeMonthlyFigures(bankTransactions, accountRoles)
    : null

  // Once a bank is linked, this reflects real spending this month rather
  // than manually logged entries.
  const totalSpent = hasBankData ? monthly.expenses : manualTotalSpent

  const nonEssentialSpent = hasBankData
    ? (monthly.expenseTransactions || [])
        .filter(
          (t) => resolveCategory(t, categoryOverrides) === "discretionary"
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    : manualNonEssentialSpent

  const essentialSpent = hasBankData
    ? totalSpent - nonEssentialSpent
    : manualEssentialSpent

  function addExpense() {
    if (!form.description.trim()) return
    if (!form.amount) return

    add("expenses", {
      ...form,
      amount: Number(form.amount)
    })

    setForm({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "Food",
      essential: true,
      amount: ""
    })
  }

  return (
    <Page>

      <HeroBanner
        title="Expenses"
        subtitle="Track every pound you spend."
      />

      <Grid>

        <StatCard
          title="Total Spent"
          icon="💸"
          value={`£${totalSpent.toLocaleString()}`}
          colour="#EF4444"
          subtitle={
            hasBankData ? "Live from your bank this month" : "All expenses"
          }
        />

        <StatCard
          title="Essential"
          icon="🏠"
          value={`£${essentialSpent.toLocaleString()}`}
          colour="#3B82F6"
          subtitle="Needs"
        />

        <StatCard
          title="Non Essential"
          icon="🛍️"
          value={`£${nonEssentialSpent.toLocaleString()}`}
          colour="#F59E0B"
          subtitle="Wants"
        />

      </Grid>

      <Card title="➕ Add Expense">
        <div
          style={{ color: "var(--subtext)", fontSize: 13, marginBottom: 12 }}
        >
          {hasBankData
            ? "Use this for spending that doesn't go through your linked bank (cash purchases etc.) — bank spending is already tracked automatically above."
            : "Log your spending manually until a bank is linked."}
        </div>

        <div
          style={{
            display: "grid",
            gap: 16
          }}
        >

          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value
              })
            }
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
          />

          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value
              })
            }
          >
            <option>Food</option>
            <option>Fuel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Entertainment</option>
            <option>Travel</option>
            <option>Health</option>
            <option>Other</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value
              })
            }
          />

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center"
            }}
          >
            <input
              type="checkbox"
              checked={form.essential}
              onChange={(e) =>
                setForm({
                  ...form,
                  essential: e.target.checked
                })
              }
            />

            Essential Expense
          </label>

          <button
            onClick={addExpense}
            style={{
              padding: 14,
              border: "none",
              borderRadius: 12,
              background: "#22C55E",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Add Expense
          </button>

        </div>

      </Card>

      <Card title="📋 Expense History">

{expenses.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "var(--subtext)",
              padding: 30
            }}
          >
            No manual expenses added yet
            {hasBankData
              ? " — check the Bank page to see your real transaction history."
              : "."}
          </div>
        ) : (
          expenses
            .slice()
            .reverse()
            .map((expense, index) => {
              const actualIndex =
                expenses.length - 1 - index

              return (
                <div
                  key={actualIndex}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 16,
                    marginBottom: 12,
                    borderRadius: 14,
                    background: "#162032"
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16
                      }}
                    >
                      {expense.description}
                    </div>

                    <div
                      style={{
                        color: "var(--subtext)",
                        marginTop: 4,
                        fontSize: 14
                      }}
                    >
                      {expense.date} • {expense.category}
                    </div>

                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 13,
                        color: expense.essential
                          ? "#22C55E"
                          : "#F59E0B"
                      }}
                    >
                      {expense.essential
                        ? "Essential"
                        : "Non Essential"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12
                    }}
                  >
                    <strong>
                      £{Number(expense.amount).toLocaleString()}
                    </strong>

                    <button
                      onClick={() =>
                        remove("expenses", actualIndex)
                      }
                      style={{
                        border: "none",
                        borderRadius: 10,
                        background: "#EF4444",
                        color: "#fff",
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 700
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })
         )}
      </Card>
    </Page>
  )
}
