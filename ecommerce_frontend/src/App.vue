<template>
  <div id="app">
    <TopNav @toggle-categories="categoryDrawerOpen = !categoryDrawerOpen" />
    <CategoryDrawer 
      :is-open="categoryDrawerOpen" 
      :categories="categories"
      @close="categoryDrawerOpen = false"
    />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import TopNav from './components/TopNav.vue'
import CategoryDrawer from './components/CategoryDrawer.vue'
import AppFooter from './components/AppFooter.vue'
import { useProductsStore } from './stores/products'

const productsStore = useProductsStore()
const categoryDrawerOpen = ref(false)

const categories = computed(() => productsStore.categories)

onMounted(async () => {
  await productsStore.loadCategories()
})
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
