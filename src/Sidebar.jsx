export default function Sidebar({ screen, setScreen }) {
  const baseStyle = {
    width: "100%",
    padding: "12px 16px",
    marginBottom: "6px",
    background: "transparent",
    color: "white",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "8px",
    transition: "0.2s"
  }

  const activeStyle = {
    ...baseStyle,
    background: "#2d2d2d",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(0,0,0,0.4)"
  }

  const menuItems = [
    { name: "Dashboard", icon: "📊" },
    { name: "Income", icon: "💷" },
    { name: "Commitments", icon: "📄" },
    { name: "Debt", icon: "💳" },
    { name: "Deposit", icon: "🏦" },
    { name: "Leftover", icon: "💰" },
    { name: "Savings", icon: "🪙" },
    { name: "Goals", icon: "🎯" },
    { name: "Profile", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
    { name: "Reports", icon: "📈" },
    { name: "Notifications", icon: "🔔" },
    { name: "Help", icon: "❓" },
    { name: "Children", icon: "👶" },
    { name: "Investments", icon: "📉" },
    { name: "Tools", icon: "🛠️" },
    { name: "Planner", icon: "🗓️" },
    { name: "History", icon: "📚" }
  ]

  return (
    <div style={{
      width: "240px",
      background: "#111",
      height: "100vh",
      padding: "20px",
      borderRight: "1px solid #333",
      boxShadow: "4px 0 10px rgba(0,0,0,0.4)"
    }}>
      <h2 style={{
        color: "white",
        marginBottom: "20px",
        fontSize: "24px",
        fontWeight: "bold"
      }}>
        ShazPlan
      </h2>

      {menuItems.map(item => (
        <button
          key={item.name}
          style={screen === item.name ? activeStyle : baseStyle}
          onClick={() => setScreen(item.name)}
        >
          {item.icon} {item.name}
        </button>
      ))}
    </div>
  )
}
