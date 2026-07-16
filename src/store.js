import { useState, useEffect } from "react"
import { dbRef, onValue, set } from "./firebase"

export function useStore() {
  const [store, setStore] = useState(null)

  useEffect(() => {
    console.log("🔌 Connecting to Firebase...")

    onValue(dbRef, (snapshot) => {
      console.log("🔥 Firebase connected")
      console.log("📥 Snapshot received:", snapshot.val())

      const data = snapshot.val()

      if (data) {
        console.log("📦 Store loaded from Firebase:", data)
        setStore(data)
      } else {
        console.log("⚠️ Firebase store empty — creating default store")

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

        set(dbRef, defaultStore)
        setStore(defaultStore)

        console.log("📦 Default store saved to Firebase:", defaultStore)
      }
    })
  }, [])

  function save(newStore) {
    console.log("💾 Saving store to Firebase:", newStore)
    setStore(newStore)
    set(dbRef, newStore)
  }

  function update(path, value) {
    if (!store) {
      console.log("⚠️ Cannot update — store is null")
      return
    }

    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length - 1; i++) {
      ref = ref[keys[i]]
    }

    ref[keys[keys.length - 1]] = value
    save(newStore)
  }

  function add(path, item) {
    if (!store) {
      console.log("⚠️ Cannot add — store is null")
      return
    }

    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (let i = 0; i < keys.length; i++) {
      ref = ref[keys[i]]
    }

    ref.push(item)
    save(newStore)
  }

  function remove(path, index) {
    if (!store) {
      console.log("⚠️ Cannot remove — store is null")
      return
    }

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