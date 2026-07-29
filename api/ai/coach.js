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

  const { summary, messages } = req.body || {}
  if (!summary) {
    return res.status(400).json({ error: "Missing financial summary" })
  }

  const systemPrompt = `You are a friendly, practical savings coach inside a personal finance app called ShazPlan. You help the user understand their spending and find realistic ways to save more, especially by cutting non-essential spending. Be specific and reference the actual numbers given below — never invent figures. Keep responses concise: a short paragraph or a few bullet points, not an essay. Be encouraging but honest, and prioritise the single most impactful suggestion first.

Here is the user's current financial summary (all figures in GBP):
${JSON.stringify(summary, null, 2)}`

  const chatMessages =
    messages && messages.length > 0
      ? messages
      : [
          {
            role: "user",
            content:
              "Give me a short summary of my finances and 2-3 specific ways I could save more this month, based on the numbers above."
          }
        ]

  // Gemini uses "model" instead of "assistant" for the AI's turns, and
  // wraps text in a parts array rather than a plain content string.
  const contents = chatMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }))

  try {
    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens: 700 }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "AI request failed")
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("\n") || ""

    return res.status(200).json({ reply: text })
  } catch (err) {
    console.error("AI coach error:", err)
    return res.status(500).json({ error: err.message || "AI request failed" })
  }
}