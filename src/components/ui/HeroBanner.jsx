import { useIsMobile } from "../../hooks/useIsMobile.js"

function ProgressChip({ label, value, percent, compact }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent || 0)))

  return (
    <div
      style={{
        flex: compact ? 1 : "none",
        minWidth: compact ? 0 : 160,
        background: "rgba(255,255,255,.16)",
        border: "1px solid rgba(255,255,255,.18)",
        backdropFilter: "blur(14px)",
        padding: compact ? "7px 10px" : "10px 14px",
        borderRadius: compact ? 10 : 14
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 6
        }}
      >
        <div style={{ fontSize: compact ? 10 : 12, opacity: 0.8 }}>
          {label}
        </div>
        <div style={{ fontSize: compact ? 11 : 13, fontWeight: 700 }}>
          {clamped}%
        </div>
      </div>

      <div
        style={{
          marginTop: compact ? 2 : 4,
          fontWeight: 700,
          fontSize: compact ? 12.5 : 15,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: compact ? 6 : 8,
          height: compact ? 5 : 6,
          borderRadius: 999,
          background: "rgba(0,0,0,0.2)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: "100%",
            background: "#fff"
          }}
        />
      </div>
    </div>
  )
}

export default function HeroBanner({
  title,
  subtitle,
  currentFocusLabel = "September Attack",
  currentFocusPercent = 0,
  goalLabel = "Buy My Home 🏡",
  goalPercent = 0
}) {
  const isMobile = useIsMobile()
  const today = new Date()

  const date = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  if (isMobile) {
    // Compact mobile version — small enough to not dominate the screen
    return (
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "16px",
          padding: "12px 14px",
          background:
            "linear-gradient(135deg,#FF8A00 0%,#FF5E3A 55%,#FF3D7F 100%)",
          color: "#fff",
          boxShadow: "0 10px 22px rgba(0,0,0,.22)"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, opacity: 0.85 }}>{date}</div>
          <h1
            style={{
              margin: 0,
              marginTop: 2,
              fontSize: "17px",
              fontWeight: 800,
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginTop: "8px"
          }}
        >
          <ProgressChip
            label="Focus"
            value={currentFocusLabel}
            percent={currentFocusPercent}
            compact
          />
          <ProgressChip
            label="Goal"
            value={goalLabel}
            percent={goalPercent}
            compact
          />
        </div>
      </div>
    )
  }

  // Desktop version — tighter padding than before, progress bars in each chip
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        padding: "16px 22px",
        background:
          "linear-gradient(135deg,#FF8A00 0%,#FF5E3A 55%,#FF3D7F 100%)",
        color: "#fff",
        boxShadow: "0 16px 35px rgba(0,0,0,.25)"
      }}
    >
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
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: "12px", opacity: 0.9 }}>{date}</span>
          <h1
            style={{
              margin: 0,
              marginTop: 2,
              fontSize: "24px",
              fontWeight: 800,
              lineHeight: 1.15
            }}
          >
            {title}
          </h1>
          <p
            style={{
              marginTop: "4px",
              marginBottom: 0,
              fontSize: "13px",
              opacity: 0.92,
              maxWidth: "420px"
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <ProgressChip
            label="Current Focus"
            value={currentFocusLabel}
            percent={currentFocusPercent}
          />
          <ProgressChip
            label="Long Term Goal"
            value={goalLabel}
            percent={goalPercent}
          />
        </div>
      </div>
    </div>
  )
}
