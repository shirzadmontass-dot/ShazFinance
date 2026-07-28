import { createClient } from "@supabase/supabase-js"

const TRUELAYER_AUTH_BASE = "https://auth.truelayer.com"
const TRUELAYER_API_BASE = "https://api.truelayer.com"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { code, redirectUri } = req.body || {}
  const authHeader = req.headers.authorization || ""
  const accessToken = authHeader.replace("Bearer ", "")

  if (!code) {
    return res.status(400).json({ error: "Missing code" })
  }
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
    const tokenRes = await fetch(`${TRUELAYER_AUTH_BASE}/connect/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.TRUELAYER_CLIENT_ID,
        client_secret: process.env.TRUELAYER_CLIENT_SECRET,
        redirect_uri: redirectUri,
        code
      })
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok) {
      throw {
        status: tokenRes.status,
        data: tokenData,
        message: "Token exchange failed"
      }
    }

    const bankAccessToken = tokenData.access_token
    const authHeaders = { Authorization: `Bearer ${bankAccessToken}` }

    const accountsRes = await fetch(
      `${TRUELAYER_API_BASE}/data/v1/accounts`,
      { headers: authHeaders }
    )
    const accountsData = await accountsRes.json()

    if (!accountsRes.ok) {
      throw {
        status: accountsRes.status,
        data: accountsData,
        message: "Failed to fetch accounts"
      }
    }

    const accounts = accountsData.results || []
    const bankAccounts = []
    const bankTransactions = []

    for (const account of accounts) {
      const accountId = account.account_id

      let balance = 0
      try {
        const balRes = await fetch(
          `${TRUELAYER_API_BASE}/data/v1/accounts/${accountId}/balance`,
          { headers: authHeaders }
        )
        const balData = await balRes.json()
        const first = (balData.results || [])[0]
        balance = first ? Number(first.available || first.current || 0) : 0
      } catch (e) {
        console.error("balance fetch failed for", accountId, e.message)
      }

      let transactions = []
      try {
        const txRes = await fetch(
          `${TRUELAYER_API_BASE}/data/v1/accounts/${accountId}/transactions`,
          { headers: authHeaders }
        )
        const txData = await txRes.json()
        transactions = (txData.results || []).map((t) => ({
          id: t.transaction_id || `${accountId}-${t.timestamp}-${t.amount}`,
          date: (t.timestamp || "").split("T")[0],
          description: t.description || t.merchant_name || "Transaction",
          amount: Number(t.amount || 0),
          currency: t.currency || "GBP",
          accountId
        }))
      } catch (e) {
        console.error("transactions fetch failed for", accountId, e.message)
      }

      bankAccounts.push({
        id: accountId,
        name:
          account.display_name ||
          account.account_number?.number ||
          "Bank account",
        balance,
        currency: account.currency || "GBP"
      })

      bankTransactions.push(...transactions)
    }

    const { data: storeRow, error: fetchError } = await supabase
      .from("store")
      .select("id, data")
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) throw fetchError

    const existingData = storeRow?.data || {}
    const updatedData = {
      ...existingData,
      bankAccounts,
      bankTransactions,
      bankLastSynced: new Date().toISOString()
    }

    if (storeRow) {
      const { error: updateError } = await supabase
        .from("store")
        .update({ data: updatedData })
        .eq("id", storeRow.id)
      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from("store")
        .insert({ user_id: user.id, data: updatedData })
      if (insertError) throw insertError
    }

    return res.status(200).json({
      success: true,
      accountsLinked: bankAccounts.length,
      transactionsImported: bankTransactions.length
    })
  } catch (err) {
    console.error("callback error:", err)
    return res.status(err.status || 500).json({
      error: err.message || "Failed to complete bank connection",
      details: err.data || null
    })
  }
}