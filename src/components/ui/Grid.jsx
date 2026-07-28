import { useIsMobile } from "../../hooks/useIsMobile.js"

export default function Grid({ children }) {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "repeat(2, minmax(0, 1fr))"
          : "repeat(auto-fit, minmax(260px, 1fr))",
        gap: isMobile ? "10px" : "20px"
      }}
    >
      {children}
    </div>
  )
}
