import { useState, useEffect } from "react"
import { dbRef, onValue, set } from "./firebase"

export function useStore() {
  const [store, setStore] = useState(null)

  // Load from Firebase
  useEffect(() => {
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val()

      if (data) {
        setStore(data)
      } else {
        // Your exact default store
        const defaultStore = {
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

        // Save default store to Firebase
        set(dbRef, defaultStore)
        setStore(defaultStore)
      }
    })
  }, [])

  // Save entire store to Firebase
  function save(newStore) {
    setStore(newStore)
    set(dbRef, newStore)
  }

  // Update a single value
  function update(path, value) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]]
    }

    ref[keys[keys.length - 1]] = value
    save(newStore)
  }

  // Add item to array
  function add(path, item) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length; i++) {
      ref = ref[keys[i]]
    }

    ref.push(item)
    save(newStore)
  }

  // Remove item from array
  function remove(path, index) {
    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length; i++) {
      ref = ref[keys[i]]
    }

    ref.splice(index, 1)
    save(newStore)
  }

  return { store, update, add, remove }
}