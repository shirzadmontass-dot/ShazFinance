import { createClient } from "@supabase/supabase-js"
import { enableBankingFetch } from "../_lib/enablebanking.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { code } = req.body || {}
  const authHeader = req.headers.authorization || ""
  const accessToken = authHeader.replace("Bearer ", "")

  if (!code) {
    return res.status(400).json({ error: "Missing code" })
  }
  if (!accessToken) {
    return res.status(401).json({ error: "Missing user session" })
  }

  // Client scoped to the logged-in user, so RLS only lets them
  // read/write their own store row.
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
    // Exchange the bank's approval code for a live session + account list
    const session = await enableBankingFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({ code })
    })

    const accounts = session.accounts || []
    const bankAccounts = []
    const bankTransactions = []

    for (const account of accounts) {
      const accountId = account.uid

      let balance = 0
      try {
        const balData = await enableBankingFetch(
          `/accounts/${accountId}/balances`
        )
        const first = (balData.balances || [])[0]
        balance = first
          ? parseFloat(first.balance_amount?.amount || 0)
          : 0
      } catch (e) {
        console.error("balance fetch failed for", accountId, e.message)
      }

      let transactions = []
      try {
        const txData = await enableBankingFetch(
          `/accounts/${accountId}/transactions`
        )
        transactions = (txData.transactions || []).map((t) => ({
          id: t.entry_reference || `${accountId}-${t.booking_date}-${t.transaction_amount?.amount}`,
          date: t.booking_date,
          description:
            t.remittance_information?.[0] ||
            t.creditor?.name ||
            t.debtor?.name ||
            "Transaction",
          amount: parseFloat(t.transaction_amount?.amount || 0),
          currency: t.transaction_amount?.currency || "GBP",
          accountId
        }))
      } catch (e) {
        console.error("transactions fetch failed for", accountId, e.message)
      }

      bankAccounts.push({
        id: accountId,
        name:
          account.name ||
          account.account_id?.iban ||
          "Bank account",
        balance,
        currency: account.currency || "GBP"
      })

      bankTransactions.push(...transactions)
    }

    // Merge into the user's existing store data
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
      error: "Failed to complete bank connection",
      details: err.data || err.message
    })
  }
}