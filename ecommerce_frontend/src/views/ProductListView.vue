<template>
  <div class="product-list-view">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>{{ pageTitle }}</h1>
        <p v-if="categorySlug">{{ categoryDescription }}</p>
      </div>

      <!-- Filters and Sort -->
      <div class="controls-bar">
        <div class="view-toggle">
          <button
            @click="viewMode = 'grid'"
            :class="{ active: viewMode === 'grid' }"
            class="view-btn"
          >
            ⊞ Grid
          </button>
          <button
            @click="viewMode = 'list'"
            :class="{ active: viewMode === 'list' }"
            class="view-btn"
          >
            ☰ List
          </button>
        </div>

        <select v-model="sortBy" class="sort-select">
          <option value="default">Sort by</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <!-- Product Grid/List -->
      <div v-if="!loading && sortedProducts.length > 0" :class="['products-container', viewMode]">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next →
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && sortedProducts.length === 0" class="empty-state">
        <h2>No Products Found</h2>
        <p>Try adjusting your filters or check back later!</p>
        <router-link to="/" class="btn btn-primary">
          Back to Home
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading products...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const productsStore = useProductsStore()

const viewMode = ref<'grid' | 'list'>('grid')
const sortBy = ref('default')
const currentPage = ref(1)
const itemsPerPage = 12

const categorySlug = computed(() => route.params.slug as string)
const loading = computed(() => productsStore.loading)
const products = computed(() => productsStore.products)

const pageTitle = computed(() => {
  if (categorySlug.value) {
    const category = productsStore.categories.find(c => c.slug === categorySlug.value)
    return category?.name || 'Products'
  }
  return 'All Products'
})

const categoryDescription = computed(() => {
  const category = productsStore.categories.find(c => c.slug === categorySlug.value)
  return category?.description || ''
})

const sortedProducts = computed(() => {
  const prods = [...products.value]
  
  switch (sortBy.value) {
    case 'name-asc':
      return prods.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return prods.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-asc':
      return prods.sort((a, b) => (a.price || 0) - (b.price || 0))
    case 'price-desc':
      return prods.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'rating':
      return prods.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    default:
      return prods
  }
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedProducts.value.slice(start, end)
})

// PUBLIC_INTERFACE
/**
 * Navigate to previous page
 */
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// PUBLIC_INTERFACE
/**
 * Navigate to next page
 */
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// PUBLIC_INTERFACE
/**
 * Load products for the current category
 */
async function loadProducts() {
  currentPage.value = 1
  await productsStore.loadProducts(categorySlug.value)
}

onMounted(async () => {
  await productsStore.loadCategories()
  await loadProducts()
})

watch(() => route.params.slug, () => {
  loadProducts()
})
</script>

<style scoped>
.product-list-view {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
}

.page-header p {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.view-toggle {
  display: none;
  gap: var(--spacing-xs);
}

.view-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-base);
}

.view-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
}

.products-container.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.products-container.list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.page-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.page-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 600;
}

.empty-state,
.loading-state {
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

@media (min-width: 768px) {
  .view-toggle {
    display: flex;
  }

  .products-container.grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .products-container.grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
