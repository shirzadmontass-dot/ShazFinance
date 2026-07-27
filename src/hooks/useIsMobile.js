import { useState, useEffect } from "react"
 
// Reactive mobile check, driven by JS instead of CSS media queries —
// avoids any dependency on CSS build/cache behavior.
export function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < breakpoint
      : false
  )
 
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [breakpoint])
 
  return isMobile
}
 