<template>
  <div class="categories-view">
    <div class="container">
      <div class="page-header">
        <h1>All Categories</h1>
        <p>Browse our collection by category</p>
      </div>

      <div v-if="!loading && categories.length > 0" class="categories-grid">
        <router-link
          v-for="category in categories"
          :key="category.id || category.slug"
          :to="`/category/${category.slug}`"
          class="category-card"
        >
          <div class="category-icon">{{ category.icon || '📦' }}</div>
          <h3>{{ category.name }}</h3>
          <p v-if="category.description">{{ category.description }}</p>
          <span v-if="category.productCount" class="product-count">
            {{ category.productCount }} products
          </span>
        </router-link>
      </div>

      <div v-else-if="!loading && categories.length === 0" class="empty-state">
        <h2>No Categories Yet</h2>
        <p>Categories will be available soon!</p>
        <router-link to="/" class="btn btn-primary">
          Back to Home
        </router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <p>Loading categories...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'

const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)
const loading = computed(() => productsStore.loading)

onMounted(async () => {
  await productsStore.loadCategories()
})
</script>

<style scoped>
.categories-view {
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
  font-size: 1.125rem;
  color: var(--color-text-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.category-card {
  background-color: var(--color-surface);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.category-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.category-card p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.product-count {
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background-color: rgba(139, 92, 246, 0.1);
  border-radius: var(--radius-md);
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
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .page-header h1 {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
