const ESSENTIAL_KEYWORDS = [
  "rent", "mortgage", "council tax", "tesco", "sainsbury", "asda",
  "aldi", "lidl", "morrisons", "co-op", "coop", "electric", "energy",
  "gas bill", "water", "insurance", "nhs", "pharmacy", "boots",
  "tfl", "train", "railway", "petrol", "fuel", "school", "childcare",
  "nursery", "loan repayment", "credit card payment", "direct debit"
]

const DISCRETIONARY_KEYWORDS = [
  "deliveroo", "uber eats", "just eat", "mcdonald", "kfc", "burger king",
  "starbucks", "costa", "pret", "greggs", "netflix", "spotify", "disney+",
  "amazon prime", "asos", "boohoo", "shein", "zara", "h&m", "primark",
  "steam", "playstation", "xbox", "bet365", "paddy power", "gambling",
  "cinema", "vue", "odeon", "amazon", "ebay", "takeaway", "bar", "pub",
  "wine", "vape", "shisha", "jd sports", "nike", "adidas"
]

export function normalizeMerchant(description = "") {
  return description.toLowerCase().trim().replace(/\s+/g, " ")
}

// Best-guess auto category from merchant name alone.
export function autoCategorize(description = "") {
  const desc = description.toLowerCase()
  if (ESSENTIAL_KEYWORDS.some((k) => desc.includes(k))) return "essential"
  if (DISCRETIONARY_KEYWORDS.some((k) => desc.includes(k))) return "discretionary"
  return "uncategorised"
}

// Final category for a transaction: manual override wins, otherwise auto-guess.
// overrides is an object keyed by normalized merchant name -> "essential" | "discretionary"
export function resolveCategory(transaction, overrides = {}) {
  const key = normalizeMerchant(transaction.description)
  if (overrides[key]) return overrides[key]
  return autoCategorize(transaction.description)
}