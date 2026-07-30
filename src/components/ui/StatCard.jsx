import { useIsMobile } from "../../hooks/useIsMobile.js"

export default function StatCard({
  title,
  value,
  colour,
  icon,
  subtitle,
  onClick
}) {
  const isMobile = useIsMobile()

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#243B55 0%,#1B263B 100%)",
        borderRadius: isMobile ? "14px" : "22px",
        padding: isMobile ? "12px 14px" : "22px",
        border: onClick
          ? "1px solid rgba(255,138,0,0.3)"
          : "1px solid rgba(255,255,255,.08)",
        boxShadow: isMobile
          ? "0 6px 16px rgba(0,0,0,.25)"
          : "0 15px 35px rgba(0,0,0,.30)",
        transition: "all .25s ease",
        cursor: onClick ? "pointer" : "default"
      }}
    >
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "-40px",
            right: "-40px",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "rgba(255,255,255,.05)"
          }}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: isMobile ? "12px" : "15px",
              color: "rgba(255,255,255,.65)",
              fontWeight: 600,
              lineHeight: 1.2
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: isMobile ? "4px" : "12px",
              fontSize: isMobile ? "19px" : "34px",
              fontWeight: 800,
              color: colour,
              lineHeight: 1
            }}
          >
            {value}
          </div>

          {!isMobile && (
            <div
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "rgba(255,255,255,.55)"
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            width: isMobile ? "36px" : "62px",
            height: isMobile ? "36px" : "62px",
            flexShrink: 0,
            borderRadius: isMobile ? "10px" : "18px",
            background: "rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "17px" : "30px"
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
