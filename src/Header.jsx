export default function Header({ screen, user, onSignOut, onMenuClick }) {
  const today = new Date()
  const initial = user?.email ? user.email[0].toUpperCase() : "S"

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        padding: "16px 26px",
        background: "#111827",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 8px 25px rgba(0,0,0,.25)"
      }}
    >
      {/* Left: logo + name + date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          minWidth: 0
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 8,
              background:
                "linear-gradient(135deg,var(--accent),var(--accent2))"
            }}
          />
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#fff",
              whiteSpace: "nowrap"
            }}
          >
            ShazPlan
          </span>
        </div>

        <span
          style={{
            fontSize: 13,
            color: "var(--subtext)",
            whiteSpace: "nowrap"
          }}
        >
          {date}
        </span>
      </div>

      {/* Center: page title */}
      <div
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color: "white",
          letterSpacing: "-0.3px",
          textAlign: "center",
          whiteSpace: "nowrap"
        }}
      >
        {screen}
      </div>

      {/* Right: bell, settings, avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "12px"
        }}
      >
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          🔔
        </button>

        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "18px",
            cursor: "pointer"
          }}
        >
          ⚙️
        </button>

        <button
          onClick={onSignOut}
          title={
            user?.email
              ? `Signed in as ${user.email} — click to sign out`
              : "Sign out"
          }
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(135deg,#FF8A00,#FF3D7F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "16px",
            flexShrink: 0
          }}
        >
          {initial}
        </button>
      </div>
    </header>
  )
}
