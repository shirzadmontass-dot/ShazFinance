import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Notifications({ store, update }) {
  const settings = store.settings || {
    notifications: true,
    alerts: true,
    reminders: true
  }

  return (
    <Page title="Notifications">
      <Card title="Notification Settings" icon="🔔">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          {/* App Notifications */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>App Notifications</span>
            <button
              onClick={() =>
                update("settings", { ...settings, notifications: !settings.notifications })
              }
              style={{
                background: settings.notifications ? "var(--accent)" : "var(--border)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              {settings.notifications ? "On" : "Off"}
            </button>
          </div>

          {/* Alerts */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>Financial Alerts</span>
            <button
              onClick={() =>
                update("settings", { ...settings, alerts: !settings.alerts })
              }
              style={{
                background: settings.alerts ? "var(--accent)" : "var(--border)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              {settings.alerts ? "On" : "Off"}
            </button>
          </div>

          {/* Reminders */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>Monthly Reminders</span>
            <button
              onClick={() =>
                update("settings", { ...settings, reminders: !settings.reminders })
              }
              style={{
                background: settings.reminders ? "var(--accent)" : "var(--border)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              {settings.reminders ? "On" : "Off"}
            </button>
          </div>

        </div>
      </Card>

      <Card title="Notification Preview" icon="📨">
        <div style={{ color: "var(--subtext)" }}>
          You will receive alerts for:
        </div>

        <ul style={{ marginTop: "var(--space-2)", paddingLeft: "20px", color: "var(--text)" }}>
          {settings.notifications && <li>General app notifications</li>}
          {settings.alerts && <li>High spending alerts</li>}
          {settings.reminders && <li>Monthly financial reminders</li>}
          {!settings.notifications && !settings.alerts && !settings.reminders && (
            <li style={{ color: "var(--subtext)" }}>All notifications are turned off</li>
          )}
        </ul>
      </Card>
    </Page>
  )
}