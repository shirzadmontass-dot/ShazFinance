import { createClient } from "@supabase/supabase-js"

const GEMINI_MODEL = "gemini-flash-latest"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

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

  const { merchants } = req.body || {}
  if (!Array.isArray(merchants) || merchants.length === 0) {
    return res.status(200).json({ categories: {} })
  }

  // Cap batch size to keep the prompt and response manageable
  const batch = merchants.slice(0, 60)

  const prompt = `You are categorising UK bank transaction merchant names as either "essential" (bills, groceries, transport, health, necessities) or "discretionary" (takeaways, pubs/bars, entertainment, shopping for wants, subscriptions for entertainment). Many of these are real UK business names you may recognise (pubs, restaurants, shops) even if the name itself doesn't obviously say what type of business it is — use your knowledge of UK brands and typical UK pub/restaurant naming patterns (e.g. names ending in "Arms", "Inn", "Tavern", or unusual two/three-word pub names) to make a sensible judgement.

Merchant names:
${batch.map((m) => `- ${m}`).join("\n")}

Return ONLY valid JSON, no markdown, no commentary, mapping each merchant name EXACTLY as given to "essential" or "discretionary":
{
  "categories": {
    "merchant name here": "essential",
    "another merchant": "discretionary"
  }
}`

  try {
    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 2000,
            responseMimeType: "application/json"
          }
        })
      }
    )

    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error?.message || "AI request failed")
    }

    const raw =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "{}"

    let parsed
    try {
      parsed = JSON.parse(raw)
    } catch {
      parsed = { categories: {} }
    }

    return res.status(200).json({
      categories: parsed.categories || {}
    })
  } catch (err) {
    console.error("categorize-merchants error:", err)
    return res.status(500).json({
      error: err.message || "Failed to categorise merchants"
    })
  }
}