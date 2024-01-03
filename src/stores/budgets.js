import { create } from 'zustand'

export const useBudgetStore = create((set) => ({
  selectedVisibleBudget: null,
  setSelectedVisibleBudget: (value) => set({ selectedVisibleBudget: value }),
}))