import { useState, useEffect } from "react"
import { supabase } from "./supabase"

// Your Supabase row ID
const STORE_ID = "eb910809-1a92-434d-8059-c8d7563a5ea2"

export function useStore() {
  const [store, setStore] = useState(null)

  useEffect(() => {
    async function load() {
      console.log("🔌 Connecting to Supabase...")

      const { data, error } = await supabase
        .from("store")
        .select("data")
        .eq("id", STORE_ID)
        .single()

      if (error) {
        console.error("❌ Error loading store:", error)
        return
      }

      console.log("📦 Store loaded:", data)

      const defaultStore = {
        income: [],
        commitments: [],
        debts: [],
        savings: [],
        children: [],
        investments: [],
        goals: {
          houseDepositTarget: 0,
          debtFreeTargetDate: ""
        },
        planner: [],
        history: []
      }

      setStore({
        ...defaultStore,
        ...(data?.data || {})
      })
    }

    load()
  }, [])

  async function save(newStore) {
    setStore(newStore)

    const { error } = await supabase
      .from("store")
      .update({ data: newStore })
      .eq("id", STORE_ID)

    if (error) {
      console.error("❌ Error saving store:", error)
    }
  }

  function update(path, value) {
    if (!store) return

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
    if (!store) return

    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (const key of keys) {
      if (!ref[key]) ref[key] = []
      ref = ref[key]
    }

    ref.push(item)

    save(newStore)
  }

  function remove(path, index) {
    if (!store) return

    const newStore = structuredClone(store)
    const keys = path.split(".")
    let ref = newStore

    for (const key of keys) {
      ref = ref[key]
    }

    ref.splice(index, 1)

    save(newStore)
  }

  return { store, update, add, remove }
}