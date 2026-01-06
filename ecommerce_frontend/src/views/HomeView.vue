<template>
  <div class="home-view">
    <!-- Hero Carousel Section -->
    <section class="carousel-section">
      <div class="carousel">
        <div 
          v-for="(slide, index) in carouselSlides" 
          :key="index"
          class="carousel-slide"
          :class="{ active: currentSlide === index }"
        >
          <div class="container">
            <div class="slide-content">
              <h1>{{ slide.title }}</h1>
              <p>{{ slide.description }}</p>
              <router-link :to="slide.link" class="btn btn-primary">
                {{ slide.buttonText }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Carousel Navigation Dots -->
        <div class="carousel-dots">
          <button
            v-for="(slide, index) in carouselSlides"
            :key="`dot-${index}`"
            @click="goToSlide(index)"
            :class="{ active: currentSlide === index }"
            class="dot"
            :aria-label="`Go to slide ${index + 1}`"
          ></button>
        </div>

        <!-- Carousel Arrows -->
        <button @click="prevSlide" class="carousel-arrow prev" aria-label="Previous slide">
          ‹
        </button>
        <button @click="nextSlide" class="carousel-arrow next" aria-label="Next slide">
          ›
        </button>
      </div>
    </section>

    <!-- Static Products Grid Section -->
    <section class="products-section">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Explore our premium collection of crackers and fireworks</p>
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="product in displayProducts"
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

    <!-- Categories Quick Links (if available) -->
    <section v-if="categories.length > 0" class="categories-section">
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
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import ProductCard from '@/components/ProductCard.vue'
import { staticProducts } from '@/data/products'

const productsStore = useProductsStore()

// Carousel state
const currentSlide = ref(0)
let carouselInterval: number | null = null

// Carousel slides data
const carouselSlides = [
  {
    title: '🎆 Welcome to Cracker Market',
    description: 'Premium crackers and fireworks for your celebrations',
    buttonText: 'Shop Now',
    link: '/products',
  },
  {
    title: '🎉 New Year Special Sale',
    description: 'Get up to 30% off on selected items',
    buttonText: 'View Deals',
    link: '/products',
  },
  {
    title: '✨ Safety First',
    description: 'All products tested and certified for your safety',
    buttonText: 'Learn More',
    link: '/products',
  },
]

const categories = computed(() => productsStore.categories)
const displayProducts = computed(() => staticProducts.slice(0, 12))

// PUBLIC_INTERFACE
/**
 * Go to next slide in carousel
 */
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % carouselSlides.length
}

// PUBLIC_INTERFACE
/**
 * Go to previous slide in carousel
 */
function prevSlide() {
  currentSlide.value = 
    currentSlide.value === 0 
      ? carouselSlides.length - 1 
      : currentSlide.value - 1
}

// PUBLIC_INTERFACE
/**
 * Go to specific slide
 */
function goToSlide(index: number) {
  currentSlide.value = index
}

// PUBLIC_INTERFACE
/**
 * Start auto-play carousel
 */
function startCarousel() {
  carouselInterval = window.setInterval(() => {
    nextSlide()
  }, 5000) // Change slide every 5 seconds
}

// PUBLIC_INTERFACE
/**
 * Stop auto-play carousel
 */
function stopCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval)
    carouselInterval = null
  }
}

onMounted(async () => {
  await productsStore.loadCategories()
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Carousel Styles */
.carousel-section {
  position: relative;
  overflow: hidden;
  margin-bottom: var(--spacing-xl);
}

.carousel {
  position: relative;
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(249, 250, 251, 1) 100%);
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide.active {
  opacity: 1;
}

.slide-content {
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 700px;
}

.slide-content h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--color-text);
}

.slide-content p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.carousel-dots {
  position: absolute;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-sm);
  z-index: 10;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  padding: 0;
}

.dot:hover {
  background-color: rgba(139, 92, 246, 0.5);
}

.dot.active {
  background-color: var(--color-primary);
  transform: scale(1.2);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-primary);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: var(--shadow-md);
}

.carousel-arrow:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow.prev {
  left: var(--spacing-md);
}

.carousel-arrow.next {
  right: var(--spacing-md);
}

/* Products Section */
.products-section {
  padding: var(--spacing-xl) 0;
  background-color: var(--color-background);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text);
}

.section-header p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.section-footer {
  text-align: center;
}

/* Categories Section */
.categories-section {
  padding: var(--spacing-xl) 0;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
  text-align: center;
  color: var(--color-text);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.category-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  background-color: var(--color-surface-hover);
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

/* Tablet Styles */
@media (min-width: 768px) {
  .carousel {
    height: 500px;
  }

  .slide-content h1 {
    font-size: 3rem;
  }

  .slide-content p {
    font-size: 1.25rem;
  }

  .carousel-arrow {
    width: 60px;
    height: 60px;
    font-size: 2.5rem;
  }

  .carousel-arrow.prev {
    left: var(--spacing-lg);
  }

  .carousel-arrow.next {
    right: var(--spacing-lg);
  }

  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .category-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop Styles */
@media (min-width: 1024px) {
  .carousel {
    height: 600px;
  }

  .slide-content h1 {
    font-size: 3.5rem;
  }

  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .category-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .carousel-slide {
    transition: none;
  }
  
  .carousel-arrow,
  .dot,
  .category-card {
    transition: none;
  }
}
</style>
