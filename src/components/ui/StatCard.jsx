export default function StatCard({
  title,
  value,
  colour,
  icon,
  subtitle
}) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg,#243B55 0%,#1B263B 100%)",
        borderRadius: "22px",
        padding: "22px",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 15px 35px rgba(0,0,0,.30)",
        transition: "all .25s ease",
        cursor: "default"
      }}
    >
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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,.65)",
              fontWeight: 600
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: "12px",
              fontSize: "34px",
              fontWeight: 800,
              color: colour,
              lineHeight: 1
            }}
          >
            {value}
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "14px",
              color: "rgba(255,255,255,.55)"
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            width: "62px",
            height: "62px",
            borderRadius: "18px",
            background: "rgba(255,255,255,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px"
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}