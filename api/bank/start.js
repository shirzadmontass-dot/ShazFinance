import { enableBankingFetch } from "../_lib/enablebanking.js"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { aspspName, aspspCountry, redirectUrl, state } = req.body || {}

  if (!aspspName || !aspspCountry || !redirectUrl) {
    return res.status(400).json({
      error: "aspspName, aspspCountry, and redirectUrl are required"
    })
  }

  const validUntil = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 90 // 90 days access
  ).toISOString()

  try {
    const data = await enableBankingFetch("/auth", {
      method: "POST",
      body: JSON.stringify({
        access: {
          valid_until: validUntil,
          balances: true,
          transactions: true
        },
        aspsp: {
          name: aspspName,
          country: aspspCountry
        },
        state: state || "shazplan",
        redirect_url: redirectUrl,
        psu_type: "personal"
      })
    })

    return res.status(200).json({ url: data.url })
  } catch (err) {
    console.error("start error:", err)
    return res.status(err.status || 500).json({
      error: "Failed to start bank connection",
      details: err.data || err.message
    })
  }
}