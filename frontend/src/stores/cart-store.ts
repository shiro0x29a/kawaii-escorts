import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  profileId: number;
  plan: 'ONE_MONTH' | 'THREE_MONTHS' | 'SIX_MONTHS';
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCart: (items: CartItem[], total: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (item) =>
        set((state) => {
          const newItems = [...state.items, { ...item, id: crypto.randomUUID() }];
          const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
          return { items: newItems, total: newTotal };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          const newTotal = newItems.reduce((sum, i) => sum + i.price, 0);
          return { items: newItems, total: newTotal };
        }),
      clearCart: () => set({ items: [], total: 0 }),
      setCart: (items, total) => set({ items, total }),
    }),
    { name: 'cart-storage' }
  )
);
