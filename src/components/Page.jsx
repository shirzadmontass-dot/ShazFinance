// Simple content wrapper. Background, scrolling, sidebar, and the
// mobile hamburger are all already handled by App.jsx — this used to
// duplicate all of that with its own near-black background and forced
// full-page height, which is what caused the visible "black box"
// mismatch behind cards. Now it just lays out the title + children.
export default function Page({ children, title }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      {title && (
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 16
          }}
        >
          {title}
        </h1>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        {children}
      </div>
    </div>
  )
}
