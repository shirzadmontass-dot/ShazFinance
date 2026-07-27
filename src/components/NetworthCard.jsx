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

  // Gauge geometry
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * health) / 100

  return (
    <Card title="Net Worth" icon="💎">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <div>
            <div
              style={{
                fontSize: 14,
                color: "var(--subtext)"
              }}
            >
              Current Net Worth
            </div>

            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: netWorth >= 0 ? "#fff" : "#EF4444",
                marginTop: 6
              }}
            >
              £{netWorth.toLocaleString()}
            </div>
          </div>

          {/* Orange circular health gauge */}
          <div
            style={{
              position: "relative",
              width: 100,
              height: 100,
              flexShrink: 0
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{
                width: "100%",
                height: "100%",
                transform: "rotate(-90deg)"
              }}
            >
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,.08)"
                strokeWidth="9"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>
                {health}%
              </div>
              <div
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: 0.05,
                  color: "var(--subtext)"
                }}
              >
                Health
              </div>
            </div>
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
