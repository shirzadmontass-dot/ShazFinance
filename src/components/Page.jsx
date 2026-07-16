export default function Page({ title, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)"
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "var(--text)",
          marginBottom: "var(--space-2)"
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "grid",
          gap: "var(--space-3)"
        }}
      >
        {children}
      </div>
    </div>
  )
}