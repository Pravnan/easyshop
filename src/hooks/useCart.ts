"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem } from "@/types";

const CART_KEY = "easyshop_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [loaded, setLoaded] = useState(false);

  // Sync loaded flag; setItems is called in the lazy initializer above.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) =>
            i.productId === item.productId &&
            i.selectedColor === item.selectedColor &&
            i.selectedSize === item.selectedSize &&
            JSON.stringify(i.selectedVariants) ===
              JSON.stringify(item.selectedVariants)
        );

        if (existing) {
          return prev.map((i) =>
            i === existing
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }

        return [...prev, item];
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (index: number, quantity: number) => {
      if (quantity < 1) return;
      setItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, quantity } : item))
      );
    },
    []
  );

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.offerPrice ?? item.regularPrice) * item.quantity,
    0
  );

  return {
    items,
    loaded,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    total: subtotal,
  };
}
