import { createContext, useContext, useState, useEffect } from "react"

const STORAGE_KEY = "shazplan-hide-figures"

const PrivacyContext = createContext({
  hideAll: false,
  toggleHideAll: () => {}
})

export function PrivacyProvider({ children }) {
  const [hideAll, setHideAll] = useState(() => {
    if (typeof window === "undefined") return false
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, hideAll ? "true" : "false")
  }, [hideAll])

  const toggleHideAll = () => setHideAll((v) => !v)

  return (
    <PrivacyContext.Provider value={{ hideAll, toggleHideAll }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  return useContext(PrivacyContext)
}
