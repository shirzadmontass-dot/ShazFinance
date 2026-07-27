const NAV_GROUPS = [
  {
    label: "Cash Flow",
    items: ["Income", "Commitments", "Expenses", "Leftover"]
  },
  {
    label: "Money Goals",
    items: ["Debt", "Deposit", "Savings", "Investments"]
  },
  {
    label: "Account",
    items: ["Profile", "Settings", "Reports", "Help"]
  }
]

export default function Sidebar({
  screen,
  setScreen,
  isSidebarOpen,
  toggleSidebar
}) {
  const go = (item) => {
    setScreen(item)
    toggleSidebar()
  }

  return (
    <div
      className={`sidebar ${isSidebarOpen ? "open" : ""}`}
      style={{
        width: "260px",
        background: "#111827",
        borderRight: "1px solid var(--border)",
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxShadow: "var(--shadow)",
        overflowY: "auto"
      }}
    >
      {/* Dashboard pinned above the grouped sections */}
      <NavItem
        label="Dashboard"
        active={screen === "Dashboard"}
        onClick={() => go("Dashboard")}
      />

      <div style={{ height: 14 }} />

      {NAV_GROUPS.map((group) => (
        <div key={group.label} style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--subtext)",
              padding: "0 12px",
              marginBottom: 6
            }}
          >
            {group.label}
          </div>

          {group.items.map((item) => (
            <NavItem
              key={item}
              label={item}
              active={screen === item}
              onClick={() => go(item)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function NavItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        cursor: "pointer",
        fontSize: "15px",
        fontWeight: active ? 600 : 500,
        color: active ? "#fff" : "var(--subtext)",
        background: active
          ? "linear-gradient(135deg,var(--accent),var(--accent2))"
          : "transparent",
        marginBottom: 2,
        transition: "background 0.15s, color 0.15s"
      }}
    >
      {label}
    </div>
  )
}
