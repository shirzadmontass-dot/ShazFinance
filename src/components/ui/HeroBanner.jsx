export default function HeroBanner({
  title,
  subtitle
}) {
  const today = new Date()

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "22px",
        padding: "22px 28px",
        background:
          "linear-gradient(135deg,#FF8A00 0%,#FF5E3A 55%,#FF3D7F 100%)",
        color: "#fff",
        boxShadow: "0 16px 35px rgba(0,0,0,.25)"
      }}
    >
      {/* Smaller Decorative Circle */}

      <div
        style={{
          position: "absolute",
          top: "-90px",
          right: "-90px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,.10)"
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2
        }}
      >
        {/* Top Row */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
          }}
        >
          <span
            style={{
              fontSize: "13px",
              opacity: .9
            }}
          >
            {date}
          </span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: 800,
            lineHeight: 1.1
          }}
        >
          {title}
        </h1>

        <p
          style={{
            marginTop: "8px",
            marginBottom: "18px",
            fontSize: "16px",
            opacity: .92,
            maxWidth: "560px"
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,.16)",
              border: "1px solid rgba(255,255,255,.18)",
              backdropFilter: "blur(14px)",
              padding: "12px 16px",
              borderRadius: "14px"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                opacity: .75
              }}
            >
              Current Focus
            </div>

            <div
              style={{
                marginTop: "4px",
                fontWeight: 700,
                fontSize: "16px"
              }}
            >
              September Attack
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,.16)",
              border: "1px solid rgba(255,255,255,.18)",
              backdropFilter: "blur(14px)",
              padding: "12px 16px",
              borderRadius: "14px"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                opacity: .75
              }}
            >
              Long Term Goal
            </div>

            <div
              style={{
                marginTop: "4px",
                fontWeight: 700,
                fontSize: "16px"
              }}
            >
              Buy My Home 🏡
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}