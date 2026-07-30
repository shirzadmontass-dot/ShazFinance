// TrueLayer normalizes account_type to a fixed set of values, but this
// stays lenient (substring match) as a safety net in case any provider
// returns something slightly different than expected.
export function isSavingsType(type = "") {
  return /saving/i.test(type)
}

export function isCreditType(type = "") {
  return /credit|klarna/i.test(type)
}

export function isInvestmentType(type = "") {
  return /invest/i.test(type)
}

export function isTransactionType(type = "") {
  return !isSavingsType(type) && !isCreditType(type) && !isInvestmentType(type)
}