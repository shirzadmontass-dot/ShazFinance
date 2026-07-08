export default function Sidebar({ screen, setScreen }) {
  const menu = [
    "Dashboard",
    "Income",
    "Commitments",
    "Debt",
    "Savings",
    "Deposit",
    "Reports",
    "Settings"
  ]

  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        backdropFilter: "blur(14px)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "4px 0 20px rgba(0,0,0,0.35)"
      }}
    >
      <h2 style={{ margin: 0, marginBottom: "20px", fontWeight: "600" }}>
        ShazPlan v2
      </h2>

      {menu.map(item => (
        <div
          key={item}
          onClick={() => setScreen(item)}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            cursor: "pointer",
            background:
              screen === item
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.06)",
            transition: "0.25s",
            fontWeight: screen === item ? "600" : "400"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.03)"
            e.currentTarget.style.background = "rgba(255,255,255,0.18)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)"
            e.currentTarget.style.background =
              screen === item
                ? "rgba(255,255,255,0.18)"
                : "rgba(255,255,255,0.06)"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}
