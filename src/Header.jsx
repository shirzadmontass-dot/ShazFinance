export default function Header({ screen }) {
  return (
    <div style={{
      width: "100%",
      background: "#181818",
      padding: "20px",
      borderBottom: "1px solid #333",
      color: "white",
      fontSize: "24px",
      fontWeight: "600",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
    }}>
      {screen}
    </div>
  )
}
