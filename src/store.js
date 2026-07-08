import { useState } from "react"

export function useStore() {
  const [store, setStore] = useState({
    income: [],
    commitments: [],
    debts: [],
    savings: [],
    investments: [],
    planner: [],
    history: [],
    children: [],
    bankAccounts: [
      { name: "Main Account", balance: 0, lastSync: null },
      { name: "Savings Account", balance: 0, lastSync: null }
    ]
  })

  function update(path, value) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]]
    }

    ref[keys[keys.length - 1]] = value
    setStore(newStore)
  }

  function add(path, item) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length; i++) {
      ref = ref[keys[i]]
    }

    ref.push(item)
    setStore(newStore)
  }

  function remove(path, index) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length; i++) {
      ref = ref[keys[i]]
    }

    ref.splice(index, 1)
    setStore(newStore)
  }

  function autoMonth() {
    const newStore = structuredClone(store)

    const incomeTotal = newStore.income.reduce((sum, i) => sum + i.amount, 0)
    const commitmentsTotal = newStore.commitments.reduce((sum, c) => sum + c.amount, 0)
    const leftover = incomeTotal - commitmentsTotal

    const debtPaid = newStore.debts.reduce((sum, d) => sum + d.minPayment, 0)
    const totalDebt = newStore.debts.reduce((sum, d) => sum + d.balance, 0)

    const wasted = newStore.commitments
      .filter(c => ["Wants", "Shopping", "Misc"].includes(c.category))
      .reduce((sum, c) => sum + c.amount, 0)

    const monthName = new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })

    newStore.history.push({
      month: monthName,
      leftover,
      debtPaid,
      totalDebt,
      wasted
    })

    setStore(newStore)
  }

  function debtFreeDate() {
    const totalDebt = store.debts.reduce((sum, d) => sum + d.balance, 0)
    const monthlyPayment = store.debts.reduce((sum, d) => sum + d.minPayment, 0)

    if (monthlyPayment <= 0) return "No payments set"

    const months = Math.ceil(totalDebt / monthlyPayment)

    const now = new Date()
    now.setMonth(now.getMonth() + months)

    return now.toLocaleString("en-GB", { month: "long", year: "numeric" })
  }

  function savingsGoalForecast(goalAmount) {
    const currentSavings =
      store.savings.reduce((sum, s) => sum + s.balance, 0) +
      store.investments.reduce((sum, i) => sum + i.balance, 0)

    const incomeTotal = store.income.reduce((sum, i) => sum + i.amount, 0)
    const commitmentsTotal = store.commitments.reduce((sum, c) => sum + c.amount, 0)
    const leftover = incomeTotal - commitmentsTotal

    if (leftover <= 0) return "No leftover to save"

    const remaining = goalAmount - currentSavings
    if (remaining <= 0) return "Goal already reached"

    const months = Math.ceil(remaining / leftover)

    const now = new Date()
    now.setMonth(now.getMonth() + months)

    return now.toLocaleString("en-GB", { month: "long", year: "numeric" })
  }

  return {
    store,
    update,
    add,
    remove,
    autoMonth,
    debtFreeDate,
    savingsGoalForecast
  }
}
