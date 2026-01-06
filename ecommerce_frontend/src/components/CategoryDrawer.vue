<template>
  <teleport to="body">
    <transition name="drawer">
      <div v-if="isOpen" class="drawer-overlay" @click="close">
        <div class="drawer-content" @click.stop>
          <div class="drawer-header">
            <h2>Categories</h2>
            <button @click="close" class="close-btn">✕</button>
          </div>

          <div class="drawer-body">
            <router-link
              to="/"
              class="category-item"
              @click="close"
            >
              <span>🏠</span>
              <span>Home</span>
            </router-link>

            <router-link
              to="/products"
              class="category-item"
              @click="close"
            >
              <span>🎆</span>
              <span>All Products</span>
            </router-link>

            <div v-if="categories.length > 0" class="divider"></div>

            <router-link
              v-for="category in categories"
              :key="category.id || category.slug"
              :to="`/category/${category.slug}`"
              class="category-item"
              @click="close"
            >
              <span>{{ category.icon || '📦' }}</span>
              <span>{{ category.name }}</span>
            </router-link>

            <div v-if="categories.length === 0" class="empty-state">
              <p>No categories available yet</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{
  isOpen: boolean
  categories: Category[]
}>()

const emit = defineEmits(['close'])

// PUBLIC_INTERFACE
/**
 * Close the drawer
 */
function close() {
  emit('close')
}
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
}

.drawer-content {
  width: 280px;
  max-width: 80vw;
  background-color: var(--color-surface);
  height: 100%;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.drawer-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: var(--spacing-sm);
  color: var(--color-text-secondary);
}

.drawer-body {
  padding: var(--spacing-md);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text);
  transition: background-color var(--transition-base);
  margin-bottom: var(--spacing-xs);
}

.category-item:hover {
  background-color: var(--color-surface-hover);
}

.category-item.router-link-active {
  background-color: var(--color-primary);
  color: white;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-md) 0;
}

.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-secondary);
}

/* Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--transition-base);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-content,
.drawer-leave-active .drawer-content {
  transition: transform var(--transition-base);
}

.drawer-enter-from .drawer-content,
.drawer-leave-to .drawer-content {
  transform: translateX(-100%);
}
</style>
