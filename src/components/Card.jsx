export default function Card({ title, children, color }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
        backdropFilter: "blur(12px)",
        borderRadius: "18px",
        padding: "22px",
        boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
        transition: "0.25s ease",
        borderLeft: `6px solid ${color || "#4caf50"}`,
        cursor: "pointer"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.03)"
        e.currentTarget.style.boxShadow = "0 14px 34px rgba(0,0,0,0.45)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.35)"
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: "12px",
          color: "white",
          fontSize: "20px",
          fontWeight: "600"
        }}
      >
        {title}
      </h3>

      <div style={{ color: "white", fontSize: "22px" }}>
        {children}
      </div>
    </div>
  )
}
