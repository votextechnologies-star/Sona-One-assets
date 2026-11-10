import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import { accessoryById, type AccessoryId } from '../lib/products'

export interface CartLine {
  key: string // `${id}:${variant}`
  id: AccessoryId
  variant: string
  qty: number
}

interface CartState {
  lines: CartLine[]
  add: (id: AccessoryId, variant: string) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

/** localStorage can throw (private mode, blocked storage); the bag should still work in memory. */
const safeStorage: StateStorage = {
  getItem: (k) => {
    try {
      return window.localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: (k, v) => {
    try {
      window.localStorage.setItem(k, v)
    } catch {
      /* ignore */
    }
  },
  removeItem: (k) => {
    try {
      window.localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  },
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (id, variant) =>
        set((s) => {
          const key = `${id}:${variant}`
          const existing = s.lines.find((l) => l.key === key)
          if (existing) return { lines: s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(9, l.qty + 1) } : l)) }
          return { lines: [...s.lines, { key, id, variant, qty: 1 }] }
        }),
      setQty: (key, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.key !== key) : s.lines.map((l) => (l.key === key ? { ...l, qty: Math.min(9, qty) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'sona-bag', storage: createJSONStorage(() => safeStorage) },
  ),
)

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty, 0)
export const cartTotal = (lines: CartLine[]) => lines.reduce((n, l) => n + l.qty * accessoryById(l.id).price, 0)