import { createClient } from "@supabase/supabase-js"
import { fetchAccountsAndTransactions } from "./_lib.js"

const TRUELAYER_AUTH_BASE = "https://auth.truelayer.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const authHeader = req.headers.authorization || ""
  const accessToken = authHeader.replace("Bearer ", "")

  if (!accessToken) {
    return res.status(401).json({ error: "Missing user session" })
  }

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

  try {
    const { data: storeRow, error: fetchError } = await supabase
      .from("store")
      .select("id, data")
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    const existingData = storeRow?.data || {}
    const refreshToken = existingData.bankRefreshToken

    if (!refreshToken) {
      return res.status(400).json({ error: "No bank connected yet" })
    }

    const tokenRes = await fetch(`${TRUELAYER_AUTH_BASE}/connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.TRUELAYER_CLIENT_ID,
        client_secret: process.env.TRUELAYER_CLIENT_SECRET,
        refresh_token: refreshToken
      })
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok) {
      throw {
        status: tokenRes.status,
        data: tokenData,
        message: "Token refresh failed"
      }
    }

    const { bankAccounts, bankTransactions } =
      await fetchAccountsAndTransactions(tokenData.access_token)

    const updatedData = {
      ...existingData,
      bankAccounts,
      bankTransactions,
      bankLastSynced: new Date().toISOString(),
      // TrueLayer may rotate the refresh_token — save the new one if given.
      bankRefreshToken: tokenData.refresh_token || refreshToken
    }

    const { error: updateError } = await supabase
      .from("store")
      .update({ data: updatedData })
      .eq("id", storeRow.id)
    if (updateError) throw updateError

    return res.status(200).json({
      success: true,
      accountsLinked: bankAccounts.length,
      transactionsImported: bankTransactions.length
    })
  } catch (err) {
    console.error("sync error:", err)
    return res.status(err.status || 500).json({
      error: err.message || "Failed to sync bank data",
      details: err.data || null
    })
  }
}