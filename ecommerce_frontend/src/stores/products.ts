import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchProducts, fetchProduct, fetchCategories } from '@/services/api'
import type { Product, Category } from '@/types'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const featuredProducts = computed(() => {
    return products.value.filter(p => p.featured).slice(0, 8)
  })

  const newProducts = computed(() => {
    return products.value.slice(0, 8)
  })

  // PUBLIC_INTERFACE
  /**
   * Load all categories from the backend
   */
  async function loadCategories() {
    loading.value = true
    error.value = null
    try {
      categories.value = await fetchCategories()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Load products, optionally filtered by category
   */
  async function loadProducts(categorySlug?: string) {
    loading.value = true
    error.value = null
    try {
      products.value = await fetchProducts(categorySlug)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      products.value = []
    } finally {
      loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Load a single product by ID
   */
  async function loadProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      currentProduct.value = await fetchProduct(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
      currentProduct.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    categories,
    currentProduct,
    loading,
    error,
    featuredProducts,
    newProducts,
    loadCategories,
    loadProducts,
    loadProduct,
  }
})
