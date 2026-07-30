import { useState, useEffect } from "react"
import { useStore } from "./store.js"
import { useAuth } from "./AuthContext.jsx"
import { useIsMobile } from "./hooks/useIsMobile.js"

import Login from "./Screens/Login.jsx"
import BankCallback from "./Screens/BankCallback.jsx"
import Dashboard from "./Screens/Dashboard.jsx"
import Income from "./Screens/Income.jsx"
import Commitments from "./Screens/Commitments.jsx"
import Expenses from "./Screens/Expenses.jsx"
import Debt from "./Screens/Debt.jsx"
import Deposit from "./Screens/Deposit.jsx"
import Leftover from "./Screens/Leftover.jsx"
import Savings from "./Screens/Savings.jsx"
import Goals from "./Screens/Goals.jsx"
import Profile from "./Screens/Profile.jsx"
import Settings from "./Screens/Settings.jsx"
import Reports from "./Screens/Reports.jsx"
import Notifications from "./Screens/Notifications.jsx"
import Help from "./Screens/Help.jsx"
import Children from "./Screens/Children.jsx"
import Investments from "./Screens/Investments.jsx"
import Tools from "./Screens/Tools.jsx"
import Planner from "./Screens/Planner.jsx"
import History from "./Screens/History.jsx"
import Bank from "./Screens/Bank.jsx"
import NetWorth from "./Screens/NetWorth.jsx"

import Sidebar from "./Sidebar.jsx"
import Header from "./Header.jsx"
import { PrivacyProvider } from "./PrivacyContext.jsx"
import { ThemeProvider } from "./ThemeContext.jsx"
import Onboarding from "./Screens/Onboarding.jsx"

export default function App() {
  const [screen, setScreenState] = useState(() => {
    // On first load, restore whichever screen the URL points to (so a
    // refresh or a shared link lands on the right page).
    const path = window.location.pathname.replace(/^\//, "")
    return path || "Dashboard"
  })
  const { user, loading, signOut } = useAuth()
  const isMobile = useIsMobile()

  // Wraps plain state changes with real browser history entries, so the
  // back/forward buttons actually work instead of having nothing to
  // navigate through (previously every screen change was invisible to
  // the browser — the URL never changed).
  function setScreen(nextScreen) {
    if (nextScreen === screen) return
    const path = nextScreen === "Dashboard" ? "/" : `/${nextScreen}`
    window.history.pushState({ screen: nextScreen }, "", path)
    setScreenState(nextScreen)
  }

  // Handle the browser's actual back/forward buttons.
  useEffect(() => {
    function onPopState(e) {
      if (e.state?.screen) {
        setScreenState(e.state.screen)
      } else {
        const path = window.location.pathname.replace(/^\//, "")
        setScreenState(path || "Dashboard")
      }
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const {
    store,
    update,
    add,
    remove
  } = useStore(user?.id)

  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () =>
    setSidebarOpen((prev) => !prev)

  // Only show onboarding for genuinely fresh accounts — anyone with
  // existing data (an already-connected bank, income, a deposit goal,
  // children, etc.) is grandfathered in automatically so nothing they've
  // already set up gets disrupted. This hook must run unconditionally on
  // every render, before any early returns below, so it's declared here.
  const onboardingComplete = store?.profile?.onboardingComplete
  const onboardingStarted = store?.profile?.onboardingStarted
  const hasExistingData = Boolean(
    store &&
      ((store.bankAccounts && store.bankAccounts.length > 0) ||
        (store.income && store.income.length > 0) ||
        (store.goals && store.goals.length > 0) ||
        (store.children && store.children.length > 0) ||
        (store.debts && store.debts.length > 0) ||
        (store.investments && store.investments.length > 0) ||
        (store.savings && store.savings.length > 0) ||
        Number(store.deposit?.current || 0) > 0)
  )

  useEffect(() => {
    // Skip grandfathering if onboarding is already in progress — e.g. a
    // brand-new user connected their bank mid-wizard, which would
    // otherwise make hasExistingData true and wrongly mark them "done"
    // before they've actually finished the questions.
    if (
      store &&
      !onboardingComplete &&
      !onboardingStarted &&
      hasExistingData &&
      typeof update === "function"
    ) {
      update("profile", { onboardingComplete: true, grandfathered: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, onboardingComplete, onboardingStarted, hasExistingData])

  const screens = {
    Dashboard,
    Income,
    Commitments,
    Expenses,
    Debt,
    Deposit,
    Leftover,
    Savings,
    Goals,
    Profile,
    Settings,
    Reports,
    Notifications,
    Help,
    Children,
    Investments,
    Tools,
    Planner,
    History,
    Bank,
    NetWorth
  }

  const ActiveScreen = screens[screen] || screens.Dashboard

  // The bank redirects the browser back here after approval —
  // handle that path independently of the normal app shell.
  if (
    typeof window !== "undefined" &&
    window.location.pathname === "/bank-callback"
  ) {
    return <BankCallback />
  }

  // Still checking whether a session exists
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: 20
        }}
      >
        Loading...
      </div>
    )
  }

  // No logged-in user — show the login/signup screen
  if (!user) {
    return <Login />
  }

  if (!store) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          color: "var(--text)",
          fontSize: 20
        }}
      >
        Loading...
      </div>
    )
  }

  if (!onboardingComplete && (onboardingStarted || !hasExistingData)) {
    return (
      <Onboarding
        store={store}
        update={update}
        finish={() => setScreen("Dashboard")}
      />
    )
  }

  // Preview mode: visit yoursite.com/?preview=onboarding to see the
  // wizard regardless of account state — nothing gets saved, so it's
  // safe to click through even on an account with real data.
  if (
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") ===
      "onboarding"
  ) {
    return (
      <Onboarding
        store={store}
        update={() => {}}
        finish={() => {
          window.location.href = window.location.pathname
        }}
      />
    )
  }

  return (
    <ThemeProvider darkMode={store.settings?.darkMode ?? true}>
    <PrivacyProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "var(--bg)",
          color: "var(--text)"
        }}
      >
        <Header
          screen={screen}
          user={user}
          onSignOut={signOut}
          onMenuClick={toggleSidebar}
          store={store}
          setScreen={setScreen}
        />

        <div
          style={{
            display: "flex",
            flex: 1,
            minHeight: 0
          }}
        >
          <div
            className={`sidebar-wrapper ${
              isSidebarOpen ? "open" : ""
            }`}
            style={{
              width: isMobile ? 0 : 240,
              overflowY: "auto",
              borderRight: isMobile
                ? "none"
                : "1px solid var(--border)"
            }}
          >
            <Sidebar
              screen={screen}
              setScreen={setScreen}
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "var(--space-4)",
              background: "var(--bg)"
            }}
          >
            <ActiveScreen
              store={store}
              update={update}
              add={add}
              remove={remove}
              setScreen={setScreen}
            />
          </div>
        </div>
      </div>
    </PrivacyProvider>
    </ThemeProvider>
  )
}
