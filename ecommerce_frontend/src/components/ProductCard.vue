<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="product-link">
      <div class="product-image">
        <img 
          :src="product.image || '/placeholder-product.jpg'" 
          :alt="product.name"
          @error="handleImageError"
        />
        <div v-if="product.badge" class="badge" :class="badgeClass">
          {{ product.badge }}
        </div>
      </div>

      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p v-if="product.description" class="product-description">
          {{ truncateDescription(product.description) }}
        </p>

        <div class="product-meta">
          <div class="product-price">
            <span class="price">${{ product.price?.toFixed(2) || '0.00' }}</span>
            <span v-if="product.originalPrice" class="original-price">
              ${{ product.originalPrice.toFixed(2) }}
            </span>
          </div>

          <div v-if="product.rating" class="product-rating">
            <span class="stars">⭐</span>
            <span>{{ product.rating.toFixed(1) }}</span>
          </div>
        </div>

        <div v-if="product.stock !== undefined" class="stock-status" :class="stockClass">
          {{ stockText }}
        </div>
      </div>
    </router-link>

    <button @click="handleAddToCart" class="add-to-cart-btn">
      Add to Cart
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

// PUBLIC_INTERFACE
/**
 * Truncate product description for card display
 */
function truncateDescription(desc: string, maxLength = 80): string {
  if (desc.length <= maxLength) return desc
  return desc.substring(0, maxLength) + '...'
}

// PUBLIC_INTERFACE
/**
 * Handle image load error with placeholder
 */
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-product.jpg'
}

// PUBLIC_INTERFACE
/**
 * Add product to cart
 */
function handleAddToCart() {
  cartStore.addItem(props.product)
}

const badgeClass = computed(() => {
  if (props.product.badge === 'New') return 'badge-new'
  if (props.product.badge === 'Sale') return 'badge-sale'
  return ''
})

const stockClass = computed(() => {
  if (props.product.stock === 0) return 'out-of-stock'
  if (props.product.stock !== undefined && props.product.stock < 10) return 'low-stock'
  return 'in-stock'
})

const stockText = computed(() => {
  if (props.product.stock === 0) return 'Out of Stock'
  if (props.product.stock !== undefined && props.product.stock < 10) return `Only ${props.product.stock} left`
  return 'In Stock'
})
</script>

<style scoped>
.product-card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-link {
  text-decoration: none;
  color: inherit;
  flex: 1;
}

.product-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  background-color: var(--color-background);
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-base);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
}

.badge-new {
  background-color: var(--color-success);
}

.badge-sale {
  background-color: var(--color-error);
}

.product-info {
  padding: var(--spacing-md);
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.product-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
}

.original-price {
  font-size: 0.875rem;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.stock-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  display: inline-block;
}

.in-stock {
  background-color: #D1FAE5;
  color: var(--color-success);
}

.low-stock {
  background-color: #FEF3C7;
  color: var(--color-warning);
}

.out-of-stock {
  background-color: #FEE2E2;
  color: var(--color-error);
}

.add-to-cart-btn {
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.add-to-cart-btn:hover {
  background-color: var(--color-primary-dark);
}
</style>
