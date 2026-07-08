export default function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.08)",
        color: "white",
        fontSize: "16px",
        outline: "none",
        transition: "0.25s"
      }}
      onFocus={e => {
        e.target.style.background = "rgba(255,255,255,0.14)"
        e.target.style.border = "1px solid rgba(255,255,255,0.25)"
      }}
      onBlur={e => {
        e.target.style.background = "rgba(255,255,255,0.08)"
        e.target.style.border = "1px solid rgba(255,255,255,0.15)"
      }}
    />
  )
}
