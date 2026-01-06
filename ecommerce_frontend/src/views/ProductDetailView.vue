<template>
  <div class="product-detail-view">
    <div class="container">
      <div v-if="!loading && product" class="product-detail">
        <!-- Product Images -->
        <div class="product-images">
          <div class="main-image">
            <img 
              :src="currentImage || '/placeholder-product.jpg'" 
              :alt="product.name"
              @error="handleImageError"
            />
          </div>
          <div v-if="product.images && product.images.length > 1" class="image-thumbnails">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="currentImage = image"
              :class="{ active: currentImage === image }"
              class="thumbnail"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <div class="product-header">
            <h1>{{ product.name }}</h1>
            <div v-if="product.rating" class="product-rating">
              <span class="stars">⭐</span>
              <span>{{ product.rating.toFixed(1) }}</span>
              <span v-if="product.reviewCount" class="review-count">
                ({{ product.reviewCount }} reviews)
              </span>
            </div>
          </div>

          <div class="product-price-section">
            <div class="price-info">
              <span class="current-price">${{ product.price?.toFixed(2) || '0.00' }}</span>
              <span v-if="product.originalPrice" class="original-price">
                ${{ product.originalPrice.toFixed(2) }}
              </span>
              <span v-if="product.originalPrice" class="discount-badge">
                Save {{ calculateDiscount(product.price, product.originalPrice) }}%
              </span>
            </div>

            <div class="stock-info" :class="stockClass">
              {{ stockText }}
            </div>
          </div>

          <div v-if="product.description" class="product-description">
            <h3>Description</h3>
            <p>{{ product.description }}</p>
          </div>

          <div v-if="product.features && product.features.length > 0" class="product-features">
            <h3>Features</h3>
            <ul>
              <li v-for="(feature, index) in product.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" :max="product.stock ?? 99" />
              <button @click="increaseQuantity" :disabled="quantity >= (product.stock ?? 99)">+</button>
            </div>

            <button 
              @click="handleAddToCart" 
              :disabled="product.stock === 0"
              class="btn btn-primary add-to-cart"
            >
              <span>🛒</span>
              <span>{{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}</span>
            </button>
          </div>

          <div v-if="product.specifications" class="product-specs">
            <h3>Specifications</h3>
            <dl>
              <template v-for="(value, key) in product.specifications" :key="key">
                <dt>{{ formatKey(key) }}</dt>
                <dd>{{ value }}</dd>
              </template>
            </dl>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading product details...</p>
      </div>

      <!-- Error State -->
      <div v-if="!loading && !product" class="empty-state">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or is no longer available.</p>
        <router-link to="/products" class="btn btn-primary">
          Browse All Products
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const quantity = ref(1)
const currentImage = ref('')

const productId = computed(() => route.params.id as string)
const product = computed(() => productsStore.currentProduct)
const loading = computed(() => productsStore.loading)

const stockClass = computed(() => {
  if (!product.value) return ''
  const stock = product.value.stock ?? 0
  if (stock === 0) return 'out-of-stock'
  if (stock < 10) return 'low-stock'
  return 'in-stock'
})

const stockText = computed(() => {
  if (!product.value) return ''
  const stock = product.value.stock ?? 0
  if (stock === 0) return 'Out of Stock'
  if (stock < 10) return `Only ${stock} left in stock`
  return 'In Stock'
})

// PUBLIC_INTERFACE
/**
 * Calculate discount percentage
 */
function calculateDiscount(current: number | undefined, original: number | undefined): number {
  if (!current || !original) return 0
  return Math.round(((original - current) / original) * 100)
}

// PUBLIC_INTERFACE
/**
 * Handle image load error
 */
function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = '/placeholder-product.jpg'
}

// PUBLIC_INTERFACE
/**
 * Format specification key for display
 */
function formatKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

// PUBLIC_INTERFACE
/**
 * Increase quantity
 */
function increaseQuantity() {
  const maxStock = product.value?.stock ?? 99
  if (product.value && quantity.value < maxStock) {
    quantity.value++
  }
}

// PUBLIC_INTERFACE
/**
 * Decrease quantity
 */
function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// PUBLIC_INTERFACE
/**
 * Add product to cart
 */
function handleAddToCart() {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addItem(product.value)
    }
    cartStore.toggleCart()
  }
}

// PUBLIC_INTERFACE
/**
 * Load product details
 */
async function loadProduct() {
  await productsStore.loadProduct(productId.value)
  if (product.value) {
    currentImage.value = product.value.image || (product.value.images && product.value.images[0]) || ''
  }
}

onMounted(() => {
  loadProduct()
})

watch(() => route.params.id, () => {
  loadProduct()
  quantity.value = 1
})
</script>

<style scoped>
.product-detail-view {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
}

.product-images {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-thumbnails {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: border-color var(--transition-base);
  background: none;
  padding: 0;
}

.thumbnail.active {
  border-color: var(--color-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.product-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.review-count {
  font-size: 0.875rem;
}

.product-price-section {
  padding: var(--spacing-lg);
  background-color: var(--color-background);
  border-radius: var(--radius-lg);
}

.price-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.original-price {
  font-size: 1.25rem;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.discount-badge {
  padding: 0.25rem 0.75rem;
  background-color: var(--color-error);
  color: white;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
}

.stock-info {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  display: inline-block;
}

.stock-info.in-stock {
  background-color: #D1FAE5;
  color: var(--color-success);
}

.stock-info.low-stock {
  background-color: #FEF3C7;
  color: var(--color-warning);
}

.stock-info.out-of-stock {
  background-color: #FEE2E2;
  color: var(--color-error);
}

.product-description h3,
.product-features h3,
.product-specs h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.product-description p {
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  padding: var(--spacing-sm) 0;
  padding-left: 1.5rem;
  position: relative;
}

.product-features li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
  font-weight: 700;
}

.product-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.quantity-selector button {
  padding: 0.75rem 1rem;
  background-color: var(--color-surface);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-base);
  font-size: 1.25rem;
}

.quantity-selector button:hover:not(:disabled) {
  background-color: var(--color-surface-hover);
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 60px;
  padding: 0.75rem;
  border: none;
  text-align: center;
  font-size: 1rem;
}

.add-to-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 1.125rem;
}

.add-to-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-specs dl {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-sm) var(--spacing-md);
}

.product-specs dt {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.product-specs dd {
  color: var(--color-text);
}

.loading-state,
.empty-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.empty-state h2 {
  font-size: 1.75rem;
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 1024px) {
  .product-detail {
    grid-template-columns: 1fr 1fr;
  }

  .product-header h1 {
    font-size: 2.25rem;
  }
}
</style>
