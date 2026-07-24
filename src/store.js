import { useState, useEffect } from "react"
import { supabase } from "./supabase"

// Your Supabase row ID
const STORE_ID = "fcb11876-dd5a-4735-8b15-9e08b0d6a0b4"

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
        console.error("❌ Error loading store:", JSON.stringify(error, null, 2))
        return
      }

      console.log("📦 Store loaded:", data)

      const defaultStore = {
        income: [],
        commitments: [],
        expenses: [],
        debts: [],
        savings: [],
        investments: [],
        children: [],

        deposit: {
          current: 0,
          target: 25000,
          monthly: 500
        },

        goals: {
          houseDepositTarget: 0,
          debtFreeTargetDate: ""
        },

        planner: [],
        history: []
      }

      const loadedStore = {
        ...defaultStore,
        ...(data?.data || {})
      }

      // Upgrade older versions automatically
      if (typeof loadedStore.deposit === "number") {
        loadedStore.deposit = {
          current: loadedStore.deposit,
          target: 25000,
          monthly: 500
        }
      }

      if (!loadedStore.deposit) {
        loadedStore.deposit = {
          current: 0,
          target: 25000,
          monthly: 500
        }
      }

      if (!loadedStore.income) loadedStore.income = []
      if (!loadedStore.commitments) loadedStore.commitments = []
      if (!loadedStore.expenses) loadedStore.expenses = []
      if (!loadedStore.debts) loadedStore.debts = []
      if (!loadedStore.savings) loadedStore.savings = []
      if (!loadedStore.investments) loadedStore.investments = []
      if (!loadedStore.children) loadedStore.children = []
      if (!loadedStore.planner) loadedStore.planner = []
      if (!loadedStore.history) loadedStore.history = []

      if (!loadedStore.goals) {
        loadedStore.goals = {
          houseDepositTarget: 0,
          debtFreeTargetDate: ""
        }
      }

      setStore(loadedStore)
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
      if (!ref[keys[i]]) ref[keys[i]] = {}
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

  return {
    store,
    update,
    add,
    remove
  }
}