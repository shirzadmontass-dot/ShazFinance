import { useState } from "react"
import Page from "../components/Page.jsx"
import Card from "../components/Card.jsx"
import { supabase } from "../supabase"

const INVESTMENT_PLATFORMS = [
  "Trading 212",
  "Stocks & Shares ISA",
  "Pension",
  "Other"
]

export default function Profile({ store, update }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const [editingSetup, setEditingSetup] = useState(false)
  const [hasInvestments, setHasInvestments] = useState(
    store?.profile?.hasInvestments || false
  )
  const [investmentPlatforms, setInvestmentPlatforms] = useState(
    store?.profile?.investmentPlatforms || []
  )
  const [hasChildren, setHasChildren] = useState(
    store?.profile?.hasChildren || false
  )
  const [childCount, setChildCount] = useState(
    store?.profile?.childCount || 1
  )
  const [hasDebt, setHasDebt] = useState(store?.profile?.hasDebt || false)

  // Prevent crash if store is null
  if (!store) return null

  // Safe fallback for profile — migrates an old single "name" field into
  // firstName the first time someone opens this page, so existing data
  // isn't lost.
  const legacyNameParts = (store.profile?.name || "").trim().split(" ")
  const profile = {
    firstName:
      store.profile?.firstName || (store.profile?.name ? legacyNameParts[0] : ""),
    lastName:
      store.profile?.lastName ||
      (store.profile?.name ? legacyNameParts.slice(1).join(" ") : ""),
    nickname: store.profile?.nickname || "",
    incomeType: store.profile?.incomeType || "",
    notes: store.profile?.notes || ""
  }

  function togglePlatform(name) {
    setInvestmentPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    )
  }

  function saveSetup() {
    // Merge into the existing profile object rather than replacing it —
    // store.profile also holds onboarding status, which must be preserved.
    update("profile", {
      ...store.profile,
      hasInvestments,
      investmentPlatforms,
      hasChildren,
      childCount: hasChildren ? Number(childCount) || 0 : 0,
      hasDebt
    })
    setEditingSetup(false)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token
      if (!token) throw new Error("Not logged in")

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to delete account")

      // Account and data are gone server-side — force a full reload so
      // the app drops back to a logged-out state cleanly.
      window.location.href = "/"
    } catch (err) {
      console.error("account deletion failed:", err)
      setDeleteError(err.message || "Something went wrong")
      setDeleting(false)
    }
  }

  return (
    <Page title="Profile">

      <Card title="Your Details" icon="👤">
        <form
          onSubmit={(e) => {
            e.preventDefault()

            const firstName = e.target.firstName.value.trim()
            const lastName = e.target.lastName.value.trim()
            const nickname = e.target.nickname.value.trim()
            const incomeType = e.target.incomeType.value
            const notes = e.target.notes.value

            // Merge, don't replace — store.profile also holds onboarding
            // status (onboardingComplete, goalTypes, etc.), which a plain
            // update("profile", {...}) here would otherwise wipe out.
            update("profile", {
              ...store.profile,
              firstName,
              lastName,
              nickname,
              incomeType,
              notes
            })
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)"
          }}
        >

          {/* First / Last name */}
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>First Name</label>
              <input
                name="firstName"
                defaultValue={profile.firstName}
                placeholder="First name"
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
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: "600" }}>Last Name</label>
              <input
                name="lastName"
                defaultValue={profile.lastName}
                placeholder="Last name"
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
          </div>

          {/* Nickname */}
          <div>
            <label style={{ fontWeight: "600" }}>Nickname (optional)</label>
            <input
              name="nickname"
              defaultValue={profile.nickname}
              placeholder="What you'd like to be called"
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
            <div
              style={{
                fontSize: 12,
                color: "var(--subtext)",
                marginTop: 6
              }}
            >
              If you fill this in, we'll use your nickname instead of your
              first name — on your homepage greeting and when the AI
              Savings Coach talks to you.
            </div>
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

      {/* Your original onboarding answers, editable here instead of only
          being set once during signup. */}
      <Card title="Your Setup" icon="🧭">
        {!editingSetup ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Investments</span>
              <span>
                {store.profile?.hasInvestments
                  ? (store.profile?.investmentPlatforms || []).join(", ") ||
                    "Yes"
                  : "Not tracking"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Kids' savings</span>
              <span>
                {store.profile?.hasChildren
                  ? `${store.profile?.childCount || 0} child(ren)`
                  : "Not tracking"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Debt tracking</span>
              <span>{store.profile?.hasDebt ? "Yes" : "Not tracking"}</span>
            </div>

            <button
              onClick={() => setEditingSetup(true)}
              style={{
                marginTop: 8,
                background: "transparent",
                border: "1px solid var(--border)",
                padding: "10px",
                borderRadius: "var(--radius)",
                color: "var(--text)",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Edit setup
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)"
            }}
          >
            <div>
              <label style={{ fontWeight: "600" }}>Investments</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button
                  onClick={() => setHasInvestments(true)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasInvestments === true
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasInvestments === true
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setHasInvestments(false)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasInvestments === false
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasInvestments === false
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  No
                </button>
              </div>

              {hasInvestments && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginTop: 8
                  }}
                >
                  {INVESTMENT_PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        border: investmentPlatforms.includes(p)
                          ? "1px solid var(--accent)"
                          : "1px solid var(--border)",
                        background: investmentPlatforms.includes(p)
                          ? "rgba(255,138,0,0.15)"
                          : "var(--bg)",
                        color: investmentPlatforms.includes(p)
                          ? "var(--accent)"
                          : "var(--subtext)",
                        cursor: "pointer"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ fontWeight: "600" }}>Kids' savings</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button
                  onClick={() => setHasChildren(true)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasChildren === true
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasChildren === true
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setHasChildren(false)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasChildren === false
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasChildren === false
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  No
                </button>
              </div>
              {hasChildren && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 8
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--subtext)" }}>
                    How many?
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={childCount}
                    onChange={(e) => setChildCount(e.target.value)}
                    style={{
                      width: 70,
                      padding: "6px 8px",
                      borderRadius: "var(--radius)",
                      border: "1px solid var(--border)",
                      background: "var(--bg)",
                      color: "var(--text)"
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label style={{ fontWeight: "600" }}>Debt tracking</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button
                  onClick={() => setHasDebt(true)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasDebt === true
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasDebt === true
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setHasDebt(false)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "var(--radius)",
                    border:
                      hasDebt === false
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                    background:
                      hasDebt === false
                        ? "rgba(255,138,0,0.15)"
                        : "var(--bg)",
                    color: "var(--text)",
                    cursor: "pointer"
                  }}
                >
                  No
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setEditingSetup(false)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  padding: "10px",
                  borderRadius: "var(--radius)",
                  color: "var(--text)",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveSetup}
                style={{
                  flex: 1,
                  background: "var(--accent)",
                  border: "none",
                  padding: "10px",
                  borderRadius: "var(--radius)",
                  color: "black",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Card>

      <Card title="Danger Zone" icon="🗑️">
        {!confirmingDelete ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            <div style={{ color: "var(--subtext)", fontSize: 14 }}>
              Permanently delete your account and all your data — bank
              connections, transactions, goals, everything. This can't be
              undone.
            </div>
            <button
              onClick={() => setConfirmingDelete(true)}
              style={{
                background: "transparent",
                border: "1px solid #EF4444",
                padding: "10px",
                borderRadius: "var(--radius)",
                color: "#EF4444",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              Delete my account
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)"
            }}
          >
            <div style={{ color: "var(--text)", fontSize: 14 }}>
              Are you absolutely sure? This permanently deletes your account
              and all your data. This can't be undone.
            </div>

            {deleteError && (
              <div style={{ color: "#EF4444", fontSize: 13 }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  padding: "10px",
                  borderRadius: "var(--radius)",
                  color: "var(--text)",
                  cursor: deleting ? "default" : "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{
                  flex: 1,
                  background: "#EF4444",
                  border: "none",
                  padding: "10px",
                  borderRadius: "var(--radius)",
                  color: "white",
                  fontWeight: "700",
                  cursor: deleting ? "default" : "pointer",
                  opacity: deleting ? 0.6 : 1
                }}
              >
                {deleting ? "Deleting…" : "Yes, permanently delete"}
              </button>
            </div>
          </div>
        )}
      </Card>

    </Page>
  )
}
