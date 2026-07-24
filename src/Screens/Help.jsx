import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"

export default function Help() {
  return (
    <Page title="Help & Support">
      <Card title="Frequently Asked Questions" icon="❓">
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          <div>
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>
              How do I add income?
            </div>
            <div style={{ color: "var(--subtext)" }}>
              Go to the Income screen and use the Add Income form.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>
              Why is my leftover low?
            </div>
            <div style={{ color: "var(--subtext)" }}>
              Check your commitments and wasted categories (Wants, Shopping, Misc).
            </div>
          </div>

          <div>
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>
              How do I reset the app?
            </div>
            <div style={{ color: "var(--subtext)" }}>
              Go to Settings and press “Reset All Data”.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: "700", marginBottom: "6px" }}>
              How do I update my profile?
            </div>
            <div style={{ color: "var(--subtext)" }}>
              Go to the Profile screen and edit your details.
            </div>
          </div>

        </div>
      </Card>

      <Card title="Contact Support" icon="📨">
        <div style={{ color: "var(--subtext)", marginBottom: "var(--space-2)" }}>
          If you need help, you can reach out anytime.
        </div>

        <div style={{ fontSize: "16px", fontWeight: "600" }}>
          support@shazplan.com
        </div>
      </Card>

      <Card title="About ShazPlan" icon="📘">
        <div style={{ color: "var(--text)" }}>
          ShazPlan is your personal finance dashboard designed to help you track income,
          commitments, savings, debt, leftover money, and long‑term goals — all in one place.
        </div>
      </Card>
    </Page>
  )
}