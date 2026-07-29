import { useState } from "react"
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

export default function App() {
  const [screen, setScreen] = useState("Dashboard")
  const { user, loading, signOut } = useAuth()
  const isMobile = useIsMobile()

  const {
    store,
    update,
    add,
    remove
  } = useStore(user?.id)

  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () =>
    setSidebarOpen((prev) => !prev)

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

  const ActiveScreen = screens[screen]

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

  return (
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
  )
}
