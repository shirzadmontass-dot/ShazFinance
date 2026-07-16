import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Settings({ store, update }) {
  const settings = store.settings || {
    darkMode: true,
    notifications: true,
    autoMonth: true
  }

  return (
    <Page title="Settings">
      <Card title="Preferences" icon="⚙️">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Dark Mode</span>
            <button
              onClick={() => update("settings", { ...settings, darkMode: !settings.darkMode })}
              style={{
                background: settings.darkMode ? "var(--accent)" : "var(--border)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              {settings.darkMode ? "On" : "Off"}
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Notifications</span>
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Auto Month Update</span>
            <button
              onClick={() =>
                update("settings", { ...settings, autoMonth: !settings.autoMonth })
              }
              style={{
                background: settings.autoMonth ? "var(--accent)" : "var(--border)",
                border: "none",
                padding: "8px 16px",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              {settings.autoMonth ? "On" : "Off"}
            </button>
          </div>

        </div>
      </Card>

      <Card title="Reset App" icon="🗑️">
        <button
          onClick={() => update("reset")}
          style={{
            background: "var(--primary)",
            border: "none",
            padding: "12px",
            borderRadius: "var(--radius)",
            color: "white",
            fontWeight: "700",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Reset All Data
        </button>
      </Card>
    </Page>
  )
}