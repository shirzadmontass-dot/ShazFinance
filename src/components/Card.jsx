export default function Card({ title, children, icon }) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)"
      }}
    >
      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--text)"
          }}
        >
          {icon && (
            <span
              style={{
                fontSize: "22px",
                color: "var(--accent)"
              }}
            >
              {icon}
            </span>
          )}
          {title}
        </div>
      )}

      <div style={{ color: "var(--text)", fontSize: "16px" }}>
        {children}
      </div>
    </div>
  )
}