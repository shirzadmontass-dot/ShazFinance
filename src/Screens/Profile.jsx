import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Profile({ store, update }) {

  // ⭐ Prevent crash if store is null
  if (!store) return null

  // ⭐ Safe fallback for profile
  const profile = {
    name: store.profile?.name || "",
    incomeType: store.profile?.incomeType || "",
    notes: store.profile?.notes || ""
  }

  return (
    <Page title="Profile">

      <Card title="Your Details" icon="👤">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const name = e.target.name.value
            const incomeType = e.target.incomeType.value
            const notes = e.target.notes.value

            update("profile", { name, incomeType, notes })
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)"
          }}
        >

          {/* Name */}
          <div>
            <label style={{ fontWeight: "600" }}>Name</label>
            <input
              name="name"
              defaultValue={profile.name}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: "var(--space-2)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                marginTop: "6px"
              }}
            />
          </div>

          {/* Income Type */}
          <div>
            <label style={{ fontWeight: "600" }}>Income Type</label>
            <select
              name="incomeType"
              defaultValue={profile.incomeType}
              style={{
                width: "100%",
                padding: "var(--space-2)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                marginTop: "6px"
              }}
            >
              <option value="">Select income type</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Fortnightly">Fortnightly</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontWeight: "600" }}>Notes</label>
            <textarea
              name="notes"
              defaultValue={profile.notes}
              placeholder="Any personal notes..."
              rows="4"
              style={{
                width: "100%",
                padding: "var(--space-2)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--text)",
                marginTop: "6px"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "var(--accent)",
              border: "none",
              padding: "10px",
              borderRadius: "var(--radius)",
              color: "black",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            Save Profile
          </button>

        </form>
      </Card>

      <Card title="Profile Summary" icon="📘">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Name</span>
            <span>{profile.name || "—"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Income Type</span>
            <span>{profile.incomeType || "—"}</span>
          </div>

          <div>
            <span style={{ fontWeight: "600" }}>Notes:</span>
            <div style={{ color: "var(--subtext)", marginTop: "6px" }}>
              {profile.notes || "No notes added."}
            </div>
          </div>
        </div>
      </Card>

    </Page>
  )
}