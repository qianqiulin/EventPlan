// context/useCart.ts
import { useState,useEffect } from 'react';
// import { CartContext } from './CartContext';

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  qty: number;
}

interface CartFunction {
  cart: CartItem[];
  add: (item: Partial<CartItem>, qty?: number) => void;
  remove: (id: string | number, qty?: number) => void;
  clear: () => void;
}

export function useCart():CartFunction {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
    setCart(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function add(rawItem: Partial<CartItem>, qty: number = 1) {
    const item = { ...rawItem, price: Number(rawItem.price) } as CartItem;

    setCart(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          qty: updated[idx].qty + qty
        };
        return updated;
      }
      return [...prev, { ...item, qty }];
    });
  }

    function remove(id: string | number, qty: number = 1) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      const newQty = item.qty - qty;
      if (newQty > 0) {
        const updated = [...prev];
        updated[idx] = { ...item, qty: newQty };
        return updated;
      }
      return prev.filter(i => i.id !== id);
    });
  }

  function clear() {
    setCart([]);
  }

  return {cart,add,remove,clear}
}
