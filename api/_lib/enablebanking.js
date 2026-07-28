import jwt from "jsonwebtoken"
 
const API_BASE = "https://api.enablebanking.com"
 
// Signs a short-lived JWT proving this server is our registered
// Enable Banking application. Every request to their API needs this.
function signAppJWT() {
  const appId = process.env.ENABLE_BANKING_APP_ID
  const privateKey = process.env.ENABLE_BANKING_PRIVATE_KEY
 
  if (!appId || !privateKey) {
    throw new Error(
      "Missing ENABLE_BANKING_APP_ID or ENABLE_BANKING_PRIVATE_KEY environment variables"
    )
  }
 
  const now = Math.floor(Date.now() / 1000)
 
  return jwt.sign(
    {
      iss: "enablebanking.com",
      aud: "api.enablebanking.com",
      iat: now,
      exp: now + 3600
    },
    privateKey,
    {
      algorithm: "RS256",
      header: { kid: appId, typ: "JWT", alg: "RS256" }
    }
  )
}
 
// Makes an authenticated request to the Enable Banking API.
export async function enableBankingFetch(path, options = {}) {
  const token = signAppJWT()
 
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  })
 
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
 
  if (!res.ok) {
    const err = new Error(
      `Enable Banking API error (${res.status}): ${JSON.stringify(data)}`
    )
    err.status = res.status
    err.data = data
    throw err
  }
 
  return data
}