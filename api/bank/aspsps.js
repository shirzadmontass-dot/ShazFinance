import { enableBankingFetch } from "../_lib/enablebanking.js"
 
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }
 
  const country = req.query.country || "GB"
 
  try {
    const data = await enableBankingFetch(`/aspsps?country=${country}`)
    return res.status(200).json(data)
  } catch (err) {
    console.error("aspsps error:", err)
    return res.status(err.status || 500).json({
      error: "Failed to fetch bank list",
      details: err.data || err.message
    })
  }
}