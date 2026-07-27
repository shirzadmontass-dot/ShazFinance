<<<<<<< HEAD
export default function Header({ screen, user, onSignOut }) {
  const today = new Date()
  const initial = user?.email ? user.email[0].toUpperCase() : "S"
=======
export default function Header({ screen }) {
  const today = new Date()
>>>>>>> 44628e0018329fc74a4bbfae1f49649fc4f21183

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 30px",
        background: "#111827",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 8px 25px rgba(0,0,0,.25)"
      }}
    >
      <div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--subtext)",
            marginBottom: "6px"
          }}
        >
          {date}
        </div>

        <div
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.5px"
          }}
        >
          {screen}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px"
        }}
      >
        <button
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          🔔
        </button>

        <button
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "14px",
            border: "none",
            background: "#1B263B",
            color: "white",
            fontSize: "20px",
            cursor: "pointer"
          }}
        >
          ⚙️
        </button>

<<<<<<< HEAD
        <button
          onClick={onSignOut}
          title={user?.email ? `Signed in as ${user.email} — click to sign out` : "Sign out"}
=======
        <div
>>>>>>> 44628e0018329fc74a4bbfae1f49649fc4f21183
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
<<<<<<< HEAD
            border: "none",
            cursor: "pointer",
=======
>>>>>>> 44628e0018329fc74a4bbfae1f49649fc4f21183
            background:
              "linear-gradient(135deg,#FF8A00,#FF3D7F)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "18px"
          }}
        >
<<<<<<< HEAD
          {initial}
        </button>
=======
          S
        </div>
>>>>>>> 44628e0018329fc74a4bbfae1f49649fc4f21183
      </div>
    </header>
  )
}