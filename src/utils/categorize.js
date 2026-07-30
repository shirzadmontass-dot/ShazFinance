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
  "wine", "vape", "shisha", "jd sports", "nike", "adidas",
  "inn", "tavern", "arms", "brewery", "brewhouse", "ale house",
  "wetherspoon", "spoons", "social club", "working men's club",
  "vineyard", "wine bar", "cocktail", "nightclub", "club"
]

export function normalizeMerchant(description = "") {
  return description.toLowerCase().trim().replace(/\s+/g, " ")
}

// Money moving between someone's own accounts/pots (e.g. Monzo main <->
// a savings pot) isn't real income or real spending — it's the same
// money changing location. Matching these out keeps Income/Expenses
// figures honest instead of double-counting internal movement.
export function isInternalTransfer(description = "") {
  return /transfer (to|from) pot|round[\s-]?up|internal transfer|between (my |own )?accounts?|pot transfer/i.test(
    description
  )
}

// Best-guess auto category from merchant name alone. Named venues that
// don't contain any of these generic words (e.g. a pub called "The Rowell
// Charter") won't match — resolveCategory falls back to an AI-assisted
// guess for those, cached so each unique merchant is only checked once.
export function autoCategorize(description = "") {
  const desc = description.toLowerCase()
  if (ESSENTIAL_KEYWORDS.some((k) => desc.includes(k))) return "essential"
  if (DISCRETIONARY_KEYWORDS.some((k) => desc.includes(k))) return "discretionary"
  return "uncategorised"
}

// Final category for a transaction: manual override wins, otherwise
// keyword auto-guess, otherwise an AI-assisted guess if one has already
// been fetched and cached (aiGuesses), otherwise "uncategorised".
// overrides is keyed by normalized merchant name -> "essential" | "discretionary"
// aiGuesses is the same shape, populated by fetchAiCategoryGuesses below.
export function resolveCategory(transaction, overrides = {}, aiGuesses = {}) {
  const key = normalizeMerchant(transaction.description)
  if (overrides[key]) return overrides[key]
  const keywordGuess = autoCategorize(transaction.description)
  if (keywordGuess !== "uncategorised") return keywordGuess
  return aiGuesses[key] || "uncategorised"
}