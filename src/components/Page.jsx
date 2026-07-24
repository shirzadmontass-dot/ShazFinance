import React, {
  useState,
  useEffect,
  useRef
} from "react"

export default function Page({
  children,
  sidebar,
  title
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const sidebarRef = useRef(null)
  const overlayRef = useRef(null)

  // Close sidebar when clicking outside of it
  useEffect(() => {
    if (!sidebarOpen) return

    const handlePointerDown = (event) => {
      const sidebarEl = sidebarRef.current
      const overlayEl = overlayRef.current

      if (!sidebarEl || !overlayEl) return

      const target = event.target

      // If click is inside the sidebar, ignore
      if (sidebarEl.contains(target)) return

      // If click is on the overlay or anywhere else
      setSidebarOpen(false)
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown
    )
    document.addEventListener(
      "touchstart",
      handlePointerDown
    )

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown
      )
      document.removeEventListener(
        "touchstart",
        handlePointerDown
      )
    }
  }, [sidebarOpen])

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "radial-gradient(circle at top,#020617,#020617 50%,#020617 100%)",
        color: "#E5E7EB"
      }}
    >
      {/* Desktop sidebar (always visible on wide screens) */}
      <aside
        style={{
          display: "none",
          "@media (min-width: 960px)": undefined
        }}
        className="shaz-sidebar-desktop"
      >
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebar && (
        <>
          {/* Overlay only when sidebarOpen === true */}
          {sidebarOpen && (
            <div
              ref={overlayRef}
              style={{
                position: "fixed",
                inset: 0,
                background:
                  "rgba(15,23,42,0.65)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter:
                  "blur(4px)",
                zIndex: 40
              }}
            />
          )}

          <aside
            ref={sidebarRef}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 260,
              maxWidth: "80vw",
              background: "#020617",
              borderRight:
                "1px solid rgba(15,23,42,0.9)",
              transform: sidebarOpen
                ? "translateX(0)"
                : "translateX(-100%)",
              transition:
                "transform 0.23s ease-out",
              zIndex: 50,
              overflowY: "auto",
              padding: 16,
              boxShadow: sidebarOpen
                ? "8px 0 24px rgba(0,0,0,0.5)"
                : "none"
            }}
          >
            {sidebar}
          </aside>
        </>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding:
            "16px clamp(16px,4vw,28px)",
          paddingTop: 16,
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        {/* Top bar with 3-dots mobile toggle */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16
          }}
        >
          {title && (
            <h1
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 0.01
              }}
            >
              {title}
            </h1>
          )}

          {sidebar && (
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  (prev) => !prev
                )
              }
              style={{
                border: "none",
                borderRadius: 999,
                padding: "6px 10px",
                background:
                  "rgba(15,23,42,0.9)",
                color: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                fontSize: 14,
                boxShadow:
                  "0 0 0 1px rgba(31,41,55,0.9)"
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  lineHeight: 1
                }}
              >
                ⋮
              </span>
              <span
                style={{
                  display:
                    "inline-block"
                }}
              >
                Menu
              </span>
            </button>
          )}
        </header>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          {children}
        </section>
      </main>
    </div>
  )
}