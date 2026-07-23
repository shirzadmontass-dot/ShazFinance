export default function Page({ title, children }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxSizing: "border-box"
      }}
    >
      {title && (
        <div
          style={{
            marginBottom: "8px"
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.5px"
            }}
          >
            {title}
          </h1>

          <div
            style={{
              marginTop: "8px",
              width: "70px",
              height: "4px",
              borderRadius: "999px",
              background:
                "linear-gradient(90deg,#2962FF,#00C853)"
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "22px"
        }}
      >
        {children}
      </div>
    </div>
  )
}