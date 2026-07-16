import { useState, useEffect } from "react"

export function useStore() {
  // Load from localStorage OR use defaults
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem("shazplan-store")
    if (saved) return JSON.parse(saved)

    return {
      income: [],
      commitments: [],
      debts: [
        { name: "Credit Card", balance: 1200, minPayment: 50 },
        { name: "Loan", balance: 5000, minPayment: 120 }
      ],
      savings: [
        { name: "LISA", balance: 0 }
      ],
      goals: [],
      investments: [],
      planner: [],
      history: [],
      children: [],
      deposit: 0,
      bankAccounts: [
        { name: "Main Account", balance: 0, lastSync: null },
        { name: "Savings Account", balance: 0, lastSync: null }
      ]
    }
  })

  // Save to localStorage whenever store changes
  useEffect(() => {
    localStorage.setItem("shazplan-store", JSON.stringify(store))
  }, [store])

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

  return { store, update, add, remove }
}