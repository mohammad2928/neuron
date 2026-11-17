import { createStore, del, get, set } from 'idb-keyval'
import type { PersistStorage, StorageValue } from 'zustand/middleware'

const db = createStore('neuron-learning-db', 'app-store')

/** Zustand persist storage backed by IndexedDB (browser database). */
export function createIdbStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name) => {
      const value = await get<StorageValue<T>>(name, db)
      return value ?? null
    },
    setItem: async (name, value) => {
      await set(name, value, db)
    },
    removeItem: async (name) => {
      await del(name, db)
    },
  }
}
