import { create } from "zustand";

type Order = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  customerName?: string;
};

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  removeOrder: (orderId: string) => void;
  clearOrders: () => void;
  removeCocktail: (cocktailName: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId)
    })),
  clearOrders: () => set({ orders: [] }),
  removeCocktail: (cocktailName) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.name !== cocktailName)
    }))
}));
