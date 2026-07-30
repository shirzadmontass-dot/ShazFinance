import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import { isCreditType } from "../utils/accountTypes.js"

import {
  HeroBanner,
  Grid,
  StatCard
} from "../components/ui"

export default function NetWorth({ store }) {
  if (!store) return null

  const savings = store.savings || []
  const investments = store.investments || []
  const children = store.children || []
  const debts = store.debts || []
  const bankAccounts = store.bankAccounts || []

  const savingsTotal =
    savings.length > 0
      ? savings.reduce((sum, s) => sum + (s.balance || 0), 0)
      : 0

  const investmentsTotal =
    investments.length > 0
      ? investments.reduce((sum, i) => sum + (i.balance || 0), 0)
      : 0

  const childrenTotal =
    children.length > 0
      ? children.reduce((sum, c) => sum + (c.balance || 0), 0)
      : 0

  const depositTotal =
    typeof store.deposit === "number"
      ? store.deposit
      : Number(store.deposit?.current || 0)

  const manualDebtTotal =
    debts.length > 0
      ? debts.reduce((sum, d) => sum + (d.balance || 0), 0)
      : 0

  // Real money sitting in linked accounts counts as an asset too — except
  // credit cards / Klarna, which are money owed, counted as debt instead.
  const linkedBankTotal = bankAccounts
    .filter((a) => !isCreditType(a.type))
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const linkedCreditOwed = bankAccounts
    .filter((a) => isCreditType(a.type))
    .reduce((sum, a) => sum + Number(a.balance || 0), 0)

  const debtTotal = manualDebtTotal + linkedCreditOwed

  const totalAssets =
    savingsTotal +
    investmentsTotal +
    childrenTotal +
    depositTotal +
    linkedBankTotal

  const netWorth = totalAssets - debtTotal

  return (
    <Page title="Net Worth">
      <HeroBanner
        title="Net Worth"
        subtitle="Everything you own, minus everything you owe."
      />

      <Grid>
        <StatCard
          title="Total Net Worth"
          icon="💷"
          value={`£${netWorth.toLocaleString()}`}
          colour={netWorth >= 0 ? "var(--accent)" : "#EF4444"}
          subtitle="Assets minus debts"
        />

        <StatCard
          title="Total Debt"
          icon="💳"
          value={`£${debtTotal.toLocaleString()}`}
          colour="#EF4444"
          subtitle="Outstanding"
        />
      </Grid>

      <Card title="Assets Breakdown" icon="📈">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Bank accounts</span>
            <span>£{linkedBankTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Savings</span>
            <span>£{savingsTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Investments</span>
            <span>£{investmentsTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Children ISA</span>
            <span>£{childrenTotal.toLocaleString()}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Deposit</span>
            <span>£{depositTotal.toLocaleString()}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "700"
            }}
          >
            <span>Total Assets</span>
            <span>£{totalAssets.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card title="Summary" icon="📘">
        <div style={{ color: "var(--text)" }}>
          Your net worth represents your financial position by subtracting
          all debts from your total assets.
        </div>
      </Card>
    </Page>
  )
}
