export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg, #4caf50, #2e7d32)",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.25s",
        boxShadow: "0 6px 18px rgba(0,0,0,0.35)"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.05)"
        e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.45)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)"
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.35)"
      }}
    >
      {children}
    </button>
  )
}
