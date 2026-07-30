import { createContext, useContext, useEffect } from "react"

const ThemeContext = createContext({ darkMode: true })

// Two full palettes. Dark matches what the app already looked like before
// theming existed. Light is new. Applied by setting CSS custom properties
// directly on the root element — works without touching the global
// stylesheet, and updates instantly when the setting changes.
const DARK_THEME = {
  "--bg": "#0B0F1A",
  "--surface": "#131A2B",
  "--surface-alt": "#162032",
  "--header-bg": "#111827",
  "--text": "#F1F5F9",
  "--subtext": "#94A3B8",
  "--border": "rgba(255,255,255,0.08)",
  "--shadow": "0 8px 25px rgba(0,0,0,.25)"
}

const LIGHT_THEME = {
  "--bg": "#F5F6F8",
  "--surface": "#FFFFFF",
  "--surface-alt": "#F0F1F4",
  "--header-bg": "#FFFFFF",
  "--text": "#0F172A",
  "--subtext": "#64748B",
  "--border": "rgba(15,23,42,0.1)",
  "--shadow": "0 8px 25px rgba(0,0,0,.08)"
}

export function ThemeProvider({ darkMode, children }) {
  useEffect(() => {
    const theme = darkMode ? DARK_THEME : LIGHT_THEME
    const root = document.documentElement
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
