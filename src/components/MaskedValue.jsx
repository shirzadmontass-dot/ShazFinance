import { useState, useEffect, useRef } from "react"
import { usePrivacy } from "../PrivacyContext.jsx"

const REVEAL_MS = 10000

// Wraps any figure (money, percentages, whatever) so it can be masked
// app-wide via the header toggle. Click a masked figure to reveal it —
// it shows a small ring that fills up over 10 seconds, then re-masks
// itself automatically. Click again while revealed to hide it early.
export default function MaskedValue({
  value,
  style,
  maskChar = "•",
  maskLength = 7
}) {
  const { hideAll } = usePrivacy()
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (!hideAll) {
      setRevealed(false)
      clearTimeout(timeoutRef.current)
      clearInterval(intervalRef.current)
    }
  }, [hideAll])

  function reveal() {
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
    setRevealed(true)
    setProgress(0)

    const start = Date.now()
    intervalRef.current = setInterval(() => {
      setProgress(Math.min(1, (Date.now() - start) / REVEAL_MS))
    }, 100)

    timeoutRef.current = setTimeout(() => {
      setRevealed(false)
      clearInterval(intervalRef.current)
    }, REVEAL_MS)
  }

  function hideNow() {
    setRevealed(false)
    clearTimeout(timeoutRef.current)
    clearInterval(intervalRef.current)
  }

  if (!hideAll) {
    return <span style={style}>{value}</span>
  }

  if (!revealed) {
    return (
      <span
        onClick={reveal}
        title="Click to reveal"
        style={{
          ...style,
          cursor: "pointer",
          letterSpacing: 1,
          userSelect: "none"
        }}
      >
        {maskChar.repeat(maskLength)}
      </span>
    )
  }

  const size = 14
  const radius = size * 0.38
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <span
      onClick={hideNow}
      title="Click to hide again"
      style={{
        ...style,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6
      }}
    >
      {value}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ flexShrink: 0 }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={2}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
    </span>
  )
}
