export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "14px 20px",
        border: "none",
        borderRadius: "12px",
        background: "var(--accent)",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        width: "100%"
      }}
    >
      {children}
    </button>
  )
}