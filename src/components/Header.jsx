export default function Header({ screen }) {
  return (
    <div
      style={{
        height: "70px",
        backdropFilter: "blur(12px)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        padding: "0 30px",
        fontSize: "22px",
        fontWeight: "600",
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)"
      }}
    >
      {screen}
    </div>
  )
}
