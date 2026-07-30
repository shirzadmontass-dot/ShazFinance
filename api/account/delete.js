import { createClient } from "@supabase/supabase-js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const authHeader = req.headers.authorization || ""
  const accessToken = authHeader.replace("Bearer ", "")
  if (!accessToken) {
    return res.status(401).json({ error: "Missing user session" })
  }

  // Verify who's calling, using their own token (regular anon-key client).
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  )

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser(accessToken)

  if (userError || !user) {
    return res.status(401).json({ error: "Invalid user session" })
  }

  // Actually deleting the auth account (and wiping their data) needs the
  // service role key — a regular user's token can't do this by design.
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({
      error:
        "Account deletion isn't configured yet — missing SUPABASE_SERVICE_ROLE_KEY"
    })
  }

  const adminClient = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  try {
    // Wipe their app data first...
    const { error: storeError } = await adminClient
      .from("store")
      .delete()
      .eq("user_id", user.id)
    if (storeError) throw storeError

    // ...then delete the login/auth account itself.
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id
    )
    if (deleteError) throw deleteError

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error("account deletion error:", err)
    return res.status(500).json({
      error: err.message || "Failed to delete account"
    })
  }
}