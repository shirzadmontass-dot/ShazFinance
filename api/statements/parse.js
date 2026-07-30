import { createClient } from "@supabase/supabase-js"
import pdfParse from "pdf-parse"

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

  const { fileBase64, accountType, accountName } = req.body || {}
  if (!fileBase64) {
    return res.status(400).json({ error: "Missing file" })
  }

  try {
    const buffer = Buffer.from(fileBase64, "base64")
    const pdfData = await pdfParse(buffer)
    // Keep the prompt a sane size — most monthly statements are well
    // under this; very long ones get truncated rather than failing.
    const rawText = pdfData.text.slice(0, 60000)

    const prompt = `You are extracting transactions from a bank/financial statement PDF's raw text below. The account type is "${accountType}".

Return ONLY valid JSON (no markdown, no commentary, no code fences) matching this exact shape:
{
  "accountName": "string - a short display name for this account, e.g. the provider name if identifiable",
  "closingBalance": number or null,
  "transactions": [
    { "date": "YYYY-MM-DD", "description": "string", "amount": number }
  ]
}

Rules:
- amount is negative for money going out, positive for money coming in.
- For a credit card or Klarna/buy-now-pay-later statement: a purchase should be a NEGATIVE amount (increases what's owed), and a repayment/credit should be POSITIVE (reduces what's owed). closingBalance should be the amount currently owed, as a positive number.
- For a savings account like a LISA: normal deposits are positive, withdrawals are negative. closingBalance is the current balance.
- Skip any lines that are not actual transactions (headers, footers, page numbers, regulatory disclaimers, marketing text).
- If you cannot confidently parse a date for a line, skip that line rather than guessing.
- Do not invent transactions that are not present in the text.

Raw statement text:
${rawText}`

    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 4000,
            responseMimeType: "application/json"
          }
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "AI parsing failed")
    }

    const text =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ||
      "{}"

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error("Could not understand this statement's layout")
    }

    return res.status(200).json({
      accountName: parsed.accountName || accountName || "Uploaded account",
      closingBalance:
        typeof parsed.closingBalance === "number" ? parsed.closingBalance : 0,
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions
        : []
    })
  } catch (err) {
    console.error("statement parse error:", err)
    return res.status(500).json({
      error: err.message || "Failed to parse statement"
    })
  }
}