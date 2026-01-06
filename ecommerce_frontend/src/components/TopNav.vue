<template>
  <nav class="top-nav" :class="{ 'is-sticky': isSticky }">
    <div class="container">
      <div class="nav-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <span class="logo-icon">🎆</span>
          <span class="logo-text">Cracker Market</span>
        </router-link>

        <!-- Search Bar (Desktop) -->
        <div class="search-bar desktop-only">
          <input
            type="text"
            placeholder="Search products..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch" class="search-btn">
            <span>🔍</span>
          </button>
        </div>

        <!-- Actions -->
        <div class="nav-actions">
          <button @click="toggleCategories" class="nav-btn mobile-only">
            <span>☰</span>
          </button>
          <router-link to="/categories" class="nav-btn desktop-only">
            Categories
          </router-link>
          <button @click="cartStore.toggleCart()" class="nav-btn cart-btn">
            <span>🛒</span>
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Search Bar (Mobile) -->
      <div class="search-bar mobile-only">
        <input
          type="text"
          placeholder="Search products..."
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-btn">
          <span>🔍</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const searchQuery = ref('')
const isSticky = ref(false)

const emit = defineEmits(['toggle-categories'])

// PUBLIC_INTERFACE
/**
 * Handle search submission
 */
function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { q: searchQuery.value } })
  }
}

// PUBLIC_INTERFACE
/**
 * Toggle categories drawer on mobile
 */
function toggleCategories() {
  emit('toggle-categories')
}

// PUBLIC_INTERFACE
/**
 * Handle scroll for sticky navbar
 */
function handleScroll() {
  isSticky.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.top-nav {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: box-shadow var(--transition-base);
}

.top-nav.is-sticky {
  box-shadow: var(--shadow-md);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  gap: var(--spacing-md);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  display: none;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 500px;
  gap: var(--spacing-sm);
}

.search-bar.mobile-only {
  margin-top: var(--spacing-sm);
}

.search-bar input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.search-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.search-btn:hover {
  background-color: var(--color-primary-dark);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.nav-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background-color var(--transition-base);
  position: relative;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.nav-btn:hover {
  background-color: var(--color-surface-hover);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: var(--color-error);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 600;
}

.desktop-only {
  display: none;
}

.mobile-only {
  display: flex;
}

@media (min-width: 768px) {
  .logo-text {
    display: inline;
  }

  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  .search-bar {
    flex: 1;
  }
}
</style>
