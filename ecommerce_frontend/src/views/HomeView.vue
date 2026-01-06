<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Welcome to Cracker Market</h1>
          <p>Discover premium crackers and fireworks for your celebrations</p>
          <router-link to="/products" class="btn btn-primary">
            Shop Now
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Quick Links -->
    <section v-if="categories.length > 0" class="section">
      <div class="container">
        <h2 class="section-title">Shop by Category</h2>
        <div class="category-grid">
          <router-link
            v-for="category in categories.slice(0, 6)"
            :key="category.id || category.slug"
            :to="`/category/${category.slug}`"
            class="category-card"
          >
            <span class="category-icon">{{ category.icon || '📦' }}</span>
            <h3>{{ category.name }}</h3>
          </router-link>
        </div>
        <div class="section-footer">
          <router-link to="/categories" class="btn btn-outline">
            View All Categories
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section v-if="featuredProducts.length > 0" class="section section-alt">
      <div class="container">
        <h2 class="section-title">Featured Products</h2>
        <div class="product-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- New Products -->
    <section v-if="newProducts.length > 0" class="section">
      <div class="container">
        <h2 class="section-title">New Arrivals</h2>
        <div class="product-grid">
          <ProductCard
            v-for="product in newProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <div class="section-footer">
          <router-link to="/products" class="btn btn-outline">
            View All Products
          </router-link>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <section v-if="!loading && categories.length === 0 && products.length === 0" class="section">
      <div class="container">
        <div class="empty-state">
          <h2>🎆 Store Coming Soon!</h2>
          <p>We're setting up our product catalog. Check back soon for amazing deals on crackers and fireworks!</p>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <section v-if="loading" class="section">
      <div class="container">
        <div class="loading-state">
          <p>Loading products...</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'

const productsStore = useProductsStore()

const categories = computed(() => productsStore.categories)
const featuredProducts = computed(() => productsStore.featuredProducts)
const newProducts = computed(() => productsStore.newProducts)
const products = computed(() => productsStore.products)
const loading = computed(() => productsStore.loading)

onMounted(async () => {
  await productsStore.loadCategories()
  await productsStore.loadProducts()
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(249, 250, 251, 1) 100%);
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--spacing-xl) 0;
}

.hero h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.hero p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.section {
  padding: var(--spacing-xl) 0;
}

.section-alt {
  background-color: var(--color-background);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text);
}

.section-footer {
  text-align: center;
  margin-top: var(--spacing-xl);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.category-card {
  background-color: var(--color-surface);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  text-decoration: none;
  color: var(--color-text);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.category-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.category-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.category-card h3 {
  font-size: 1rem;
  font-weight: 600;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.empty-state,
.loading-state {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: 3rem;
  }

  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .category-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
