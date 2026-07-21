import { useState, useEffect } from "react"
import { dbRef, onValue, set } from "./firebase"

export function useStore() {
  const [store, setStore] = useState(null)

  useEffect(() => {
    console.log("🔌 Connecting to Firebase...")

    onValue(dbRef("store"), (snapshot) => {
      const data = snapshot.val()

      if (data) {
        console.log("📦 Store loaded from Firebase:", data)
        setStore(data)
      } else {
        console.log("⚠️ Firebase store empty — not overwriting")
        setStore(null)
      }
    })
  }, [])

  function save(newStore) {
    console.log("💾 Saving store to Firebase:", newStore)
    setStore(newStore)
    set(dbRef("store"), newStore)
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