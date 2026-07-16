import { useState } from "react"

export function useStore() {
  const [store, setStore] = useState({
    income: [],
    commitments: [],
    debts: [
      { name: "Credit Card", balance: 1200, minPayment: 50 },
      { name: "Loan", balance: 5000, minPayment: 120 }
    ],
    savings: [
      { name: "LISA", balance: 0 }
    ],
    goals: [],   // ← FIXED
    investments: [],
    planner: [],
    history: [],
    children: [],
    deposit: 0,
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

  return { store, update, add, remove }
}