import type { Product, Category } from '@/types'

// PUBLIC_INTERFACE
/**
 * API client for communicating with the backend service
 * Base URL points to localhost:3001 for development
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch all categories from the backend
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    return await fetchAPI<Category[]>('/api/categories');
  } catch {
    console.warn('Categories endpoint not ready, returning empty array');
    return [];
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch all products with optional category filter
 */
export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const endpoint = categorySlug 
      ? `/api/products?category=${categorySlug}` 
      : '/api/products';
    return await fetchAPI<Product[]>(endpoint);
  } catch {
    console.warn('Products endpoint not ready, returning empty array');
    return [];
  }
}

// PUBLIC_INTERFACE
/**
 * Fetch a single product by ID
 */
export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    return await fetchAPI<Product>(`/api/products/${id}`);
  } catch {
    console.warn('Product endpoint not ready, returning null');
    return null;
  }
}

// PUBLIC_INTERFACE
/**
 * Search products by query string
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    return await fetchAPI<Product[]>(`/api/products/search?q=${encodeURIComponent(query)}`);
  } catch {
    console.warn('Search endpoint not ready, returning empty array');
    return [];
  }
}
