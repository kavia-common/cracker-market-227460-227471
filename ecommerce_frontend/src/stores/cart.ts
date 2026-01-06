import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  const isOpen = ref(false)

  // Computed
  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const total = computed(() => {
    return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  })

  // PUBLIC_INTERFACE
  /**
   * Add item to cart or increase quantity if already exists
   */
  function addItem(product: Product) {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      })
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Remove item from cart
   */
  function removeItem(productId: string) {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update item quantity
   */
  function updateQuantity(productId: string, quantity: number) {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Clear all items from cart
   */
  function clearCart() {
    items.value = []
  }

  // PUBLIC_INTERFACE
  /**
   * Toggle cart drawer
   */
  function toggleCart() {
    isOpen.value = !isOpen.value
  }

  return {
    items,
    isOpen,
    itemCount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
  }
})
