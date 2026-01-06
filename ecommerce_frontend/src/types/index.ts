// Type definitions for the e-commerce application

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image?: string
  images?: string[]
  category?: string
  categorySlug?: string
  stock?: number
  rating?: number
  reviewCount?: number
  badge?: string
  featured?: boolean
  features?: string[]
  specifications?: Record<string, string>
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  productCount?: number
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface APIResponse<T> {
  data: T
  message?: string
  error?: string
}
