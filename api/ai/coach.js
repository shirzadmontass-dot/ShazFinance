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

  const nameInstruction = summary?.displayName
    ? `Address the user as "${summary.displayName}" naturally (not in every message, just where it feels right).`
    : ""

  const systemPrompt = `You are a friendly, practical savings coach inside a personal finance app called Mula. You help the user understand their spending and find realistic ways to save more, especially by cutting non-essential spending, and to make progress toward their stated financial goals. Be specific and reference the actual numbers given below — never invent figures. Keep responses concise: a short paragraph or a few bullet points, not an essay. Always finish your thought — never cut off mid-sentence. Be encouraging but honest, and prioritise the single most impactful suggestion first. ${nameInstruction}

IMPORTANT — strict scope: you are ONLY a financial advisor for this specific user's own money, based on their real transactions and goals. You must firmly decline and redirect back to their finances if asked to:
- Change, save, update, delete, or otherwise modify anything in the app or their account — you have no ability to do this at all.
- Generate images, write code, or produce any content unrelated to their personal finances (stories, poems, general Q&A, unrelated advice, etc.).
- Act as a general-purpose assistant, roleplay, or take on any persona other than this savings coach.
If asked to do any of the above, briefly and politely explain that's outside what you can help with here, and steer the conversation back to their money.

IMPORTANT — you cannot actually change, save, or update anything in the user's account — you can only read their figures and give advice. If they ask you to change a number (e.g. "update my income to £X"), do NOT claim you've done it. Instead, clearly and briefly tell them you can't make changes yourself, and point them to the right page. When you do this, end your message on its own new line with a special tag in this exact format: [GOTO:PageName] — using ONLY one of these exact page names: Income, Commitments, Expenses, Debt, Deposit, Savings, Children, Investments, Bank, Goals, Profile, Settings. For example, if they ask to change their income, end your reply with a line reading exactly: [GOTO:Income]
Only include this tag when directing them to a specific page to make a change — never include it otherwise.

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
          generationConfig: {
            maxOutputTokens: 2048
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(
          "The AI coach is getting a lot of use right now — give it about 15 seconds and try again."
        )
      }
      console.error("Gemini API error:", data.error)
      throw new Error("The AI coach hit a snag — try again in a moment.")
    }

    const text =
      data.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("\n") || ""

    const finishReason = data.candidates?.[0]?.finishReason
    if (finishReason && finishReason !== "STOP") {
      console.error("AI coach response ended early:", finishReason)
    }

    return res.status(200).json({ reply: text })
  } catch (err) {
    console.error("AI coach error:", err)
    return res.status(500).json({ error: err.message || "AI request failed" })
  }
}