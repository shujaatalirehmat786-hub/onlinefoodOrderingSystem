"use client"

import { useState, useEffect } from "react"
import {
  getCart,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  clearCart as clearCartUtil,
  type Cart,
  type CartItem,
} from "@/lib/cart"

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => getCart())

  useEffect(() => {
    // Listen for cart updates across tabs
    const handleStorageChange = () => {
      setCart(getCart())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const addToCart = (item: CartItem) => {
    const updatedCart = addToCartUtil(item)
    setCart(updatedCart)
  }

  const removeFromCart = (index: number) => {
    const updatedCart = removeFromCartUtil(index)
    setCart(updatedCart)
  }

  const updateQuantity = (index: number, quantity: number) => {
    const updatedCart = updateCartItemQuantityUtil(index, quantity)
    setCart(updatedCart)
  }

  const clearCart = () => {
    clearCartUtil()
    setCart(getCart())
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
