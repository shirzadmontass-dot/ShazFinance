import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./supabase"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // undefined = still checking, null = logged out, object = logged in
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    // Check if a session already exists (e.g. page refresh)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Keep session in sync whenever the user logs in / out
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading: session === undefined,
    signOut: () => supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}