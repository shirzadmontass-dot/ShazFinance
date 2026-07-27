import { useState, useEffect } from "react"
import { supabase } from "./supabase"

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

  attackPlan: {
    debtTidyUp: false,
    spendingReset: false,
    depositBoost: false
  },

  planner: [],
  history: []
}

// Pass the logged-in user's id in. No user id yet = nothing loads.
export function useStore(userId) {
  const [store, setStore] = useState(null)
  const [rowId, setRowId] = useState(null)

  useEffect(() => {
    if (!userId) {
      setStore(null)
      setRowId(null)
      return
    }

    async function load() {
      console.log("🔌 Connecting to Supabase...")

      const { data, error } = await supabase
        .from("store")
        .select("id, data")
        .eq("user_id", userId)
        .maybeSingle()

      if (error) {
        console.error("❌ Error loading store:", JSON.stringify(error, null, 2))
        return
      }

      // First time this user has ever logged in — create their own row
      if (!data) {
        console.log("🆕 No store yet for this user, creating one...")

        const { data: created, error: insertError } = await supabase
          .from("store")
          .insert({ user_id: userId, data: defaultStore })
          .select("id, data")
          .single()

        if (insertError) {
          console.error("❌ Error creating store:", insertError)
          return
        }

        setRowId(created.id)
        setStore(defaultStore)
        return
      }

      console.log("📦 Store loaded:", data)

      const loadedStore = {
        ...defaultStore,
        ...(data.data || {})
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

      if (!loadedStore.attackPlan) {
        loadedStore.attackPlan = {
          debtTidyUp: false,
          spendingReset: false,
          depositBoost: false
        }
      }

      setRowId(data.id)
      setStore(loadedStore)
    }

    load()
  }, [userId])

  async function save(newStore) {
    setStore(newStore)

    if (!rowId) {
      console.error("❌ Can't save yet — no store row for this user.")
      return
    }

    const { error } = await supabase
      .from("store")
      .update({ data: newStore })
      .eq("id", rowId)

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