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

  const { text } = req.body || {}
  if (!text || !text.trim()) {
    return res.status(200).json({ goals: [] })
  }

  const prompt = `A user answered "Did we miss anything?" while setting up a personal finance app, describing any extra savings goals, accounts, or financial priorities not already covered by a standard list (house deposit, holiday fund, car, wedding, emergency fund, general saving, investments, kids' savings, debt).

Their answer:
"${text}"

Extract any genuinely new, distinct financial goals they mentioned. Ignore small talk, vague statements, or anything already covered by the standard list above. Return ONLY valid JSON, no markdown, no commentary:
{
  "goals": [
    { "name": "short goal name (a few words)", "icon": "a single relevant emoji" }
  ]
}
If nothing goal-like is mentioned, return { "goals": [] }.`

  try {
    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 500,
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
      parsed = { goals: [] }
    }

    return res.status(200).json({
      goals: Array.isArray(parsed.goals) ? parsed.goals : []
    })
  } catch (err) {
    console.error("extract-goals error:", err)
    return res.status(500).json({
      error: err.message || "Failed to process your answer"
    })
  }
}