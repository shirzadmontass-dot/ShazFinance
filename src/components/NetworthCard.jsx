import Card from "./Card.jsx"

export default function NetWorthCard({ store }) {
  if (!store) return null

  const savings = (store.savings || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )

  const investments = (store.investments || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )

  const deposit = Number(store.deposit?.current || 0)

  const debts = (store.debts || []).reduce(
    (sum, item) => sum + Number(item.balance || 0),
    0
  )

  const assets = savings + investments + deposit
  const netWorth = assets - debts

  const health =
    assets > 0
      ? Math.max(0, Math.min(100, Math.round((netWorth / assets) * 100)))
      : 0

  const healthColor =
    health >= 75
      ? "#22C55E"
      : health >= 50
      ? "#FACC15"
      : "#EF4444"

  return (
    <Card title="Net Worth" icon="💎">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 16,
              color: "var(--subtext)"
            }}
          >
            Current Net Worth
          </div>

          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: netWorth >= 0 ? "#4ADE80" : "#EF4444",
              marginTop: 8
            }}
          >
            £{netWorth.toLocaleString()}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 16
          }}
        >
          <Stat
            label="Assets"
            value={assets}
            colour="#4ADE80"
            emoji="💰"
          />

          <Stat
            label="Debts"
            value={debts}
            colour="#EF4444"
            emoji="💳"
          />

          <Stat
            label="Savings"
            value={savings}
            colour="#60A5FA"
            emoji="🏦"
          />

          <Stat
            label="Investments"
            value={investments}
            colour="#F59E0B"
            emoji="📈"
          />

          <Stat
            label="House Deposit"
            value={deposit}
            colour="#A78BFA"
            emoji="🏠"
          />
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              fontWeight: 600
            }}
          >
            <span>Financial Health</span>
            <span>{health}%</span>
          </div>

          <div
            style={{
              height: 14,
              background: "#243244",
              borderRadius: 999,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: `${health}%`,
                height: "100%",
                background: healthColor,
                transition: "0.4s"
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

function Stat({ emoji, label, value, colour }) {
  return (
    <div
      style={{
        background: "#162032",
        borderRadius: 16,
        padding: 18,
        border: "1px solid var(--border)"
      }}
    >
      <div
        style={{
          fontSize: 15,
          color: "var(--subtext)"
        }}
      >
        {emoji} {label}
      </div>

      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: colour,
          marginTop: 8
        }}
      >
        £{Number(value).toLocaleString()}
      </div>
    </div>
  )
}