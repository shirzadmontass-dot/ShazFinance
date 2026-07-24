export default function Card({
  title,
  icon,
  children,
  style = {}
}) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginBottom: "22px",
        padding: "24px",
        borderRadius: "24px",
        background:
          "linear-gradient(180deg,#243B55 0%, #1B263B 100%)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow:
          "0 20px 45px rgba(0,0,0,.35)",
        overflow: "hidden",
        transition: "all .25s ease",
        ...style
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "rgba(255,255,255,.04)"
        }}
      />

      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            {icon && (
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,.08)",
                  fontSize: "22px"
                }}
              >
                {icon}
              </div>
            )}

            <div
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#fff"
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,.35)",
              fontSize: "22px",
              fontWeight: "bold"
            }}
          >
            ›
          </div>
        </div>
      )}

      <div
        style={{
          position: "relative",
          zIndex: 2
        }}
      >
        {children}
      </div>
    </div>
  )
}