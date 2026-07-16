export default function Sidebar({ screen, setScreen, isSidebarOpen, toggleSidebar }) {
  const items = [
    "Dashboard",
    "Income",
    "Commitments",
    "Debt",
    "Deposit",
    "Leftover",
    "Savings",
    "Goals",
    "Profile",
    "Settings",
    "Reports",
    "Notifications",
    "Help",
    "Children",
    "Investments",
    "Tools",
    "Planner",
    "History",
    "Bank",
    "NetWorth"
  ]

  return (
    <div
      className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      style={{
        width: "260px",
        background: "#111",
        borderRight: "1px solid var(--border)",
        padding: "var(--space-4) var(--space-2)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        boxShadow: "var(--shadow)"
      }}
    >
      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: "var(--primary)",
          marginBottom: "var(--space-3)"
        }}
      >
        ShazPlan
      </div>

      {items.map((item) => (
        <div
          key={item}
          onClick={() => {
            setScreen(item)
            toggleSidebar()   // closes sidebar on mobile
          }}
          style={{
            padding: "var(--space-2)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            color: screen === item ? "var(--accent)" : "var(--text)",
            background: screen === item ? "rgba(124, 58, 237, 0.15)" : "transparent",
            transition: "0.2s",
            border: screen === item ? "1px solid var(--primary)" : "1px solid transparent"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}