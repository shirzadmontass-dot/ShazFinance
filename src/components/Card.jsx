import { useIsMobile } from "../hooks/useIsMobile.js"

export default function Card({
  title,
  subtitle,
  icon,
  compact = false,
  children,
  style = {}
}) {
  const isMobile = useIsMobile()

  const padding = isMobile
    ? (compact ? "12px 14px" : "14px 16px")
    : (compact ? "18px 20px" : "24px")

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginBottom: compact ? 0 : (isMobile ? "12px" : "22px"),
        padding,
        borderRadius: isMobile ? "14px" : "20px",
        background:
          "linear-gradient(180deg,#243B55 0%, #1B263B 100%)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: isMobile
          ? "0 8px 20px rgba(0,0,0,.3)"
          : "0 20px 45px rgba(0,0,0,.35)",
        overflow: "hidden",
        transition: "all .25s ease",
        ...style
      }}
    >
      {!isMobile && (
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
      )}

      {title && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? 10 : (compact ? 14 : "20px")
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? "8px" : "12px",
              minWidth: 0
            }}
          >
            {icon && (
              <div
                style={{
                  width: isMobile ? "32px" : "42px",
                  height: isMobile ? "32px" : "42px",
                  flexShrink: 0,
                  borderRadius: isMobile ? "9px" : "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(255,255,255,.08)",
                  fontSize: isMobile ? "16px" : "22px"
                }}
              >
                {icon}
              </div>
            )}

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: isMobile ? 14.5 : (compact ? 16 : "20px"),
                  fontWeight: 700,
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {title}
              </div>

              {subtitle && !isMobile && (
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 12.5,
                    color: "var(--subtext)"
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              color: "rgba(255,255,255,.35)",
              fontSize: isMobile ? "18px" : "22px",
              fontWeight: "bold",
              flexShrink: 0
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
