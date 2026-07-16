import { useState } from "react"
import { useStore } from "./store.js"

import Dashboard from "./Screens/Dashboard.jsx"
import Income from "./Screens/Income.jsx"
import Commitments from "./Screens/Commitments.jsx"
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

  const {
    store,
    update,
    add,
    remove,
    autoMonth,
    debtFreeDate,
    savingsGoalForecast
  } = useStore()

  // ============================
  // MOBILE SIDEBAR STATE
  // ============================
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  const screens = {
    Dashboard,
    Income,
    Commitments,
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

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg)",
        color: "var(--text)"
      }}
    >

      {/* ============================
          MOBILE MENU BUTTON
          (hidden on laptop via CSS)
      ============================ */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        ⋮
      </button>

      {/* ============================
          SIDEBAR — desktop + mobile
      ============================ */}
      <div
        className={`sidebar-wrapper ${isSidebarOpen ? "open" : ""}`}
        style={{
          width: "240px",
          overflowY: "auto",
          borderRight: "1px solid var(--border)"
        }}
      >
        <Sidebar
          screen={screen}
          setScreen={setScreen}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* ============================
          MAIN CONTENT
      ============================ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header screen={screen} />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--space-4)",
            background: "var(--bg)"
          }}
        >
          {ActiveScreen && (
            <ActiveScreen
              store={store}
              update={update}
              add={add}
              remove={remove}
              autoMonth={autoMonth}
              debtFreeDate={debtFreeDate}
              savingsGoalForecast={savingsGoalForecast}
            />
          )}
        </div>
      </div>

    </div>
  )
}