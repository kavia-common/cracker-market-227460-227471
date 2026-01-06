<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>🎆 Cracker Market</h3>
          <p>Your trusted source for premium crackers and fireworks.</p>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/categories">Categories</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Safety Guidelines</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Cracker Market. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: var(--color-text);
  color: white;
  padding: var(--spacing-xl) 0 var(--spacing-md);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
}

.footer-section h4 {
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary-light);
}

.footer-section p {
  color: #D1D5DB;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: var(--spacing-xs);
}

.footer-section a {
  color: #D1D5DB;
  text-decoration: none;
  transition: color var(--transition-base);
}

.footer-section a:hover {
  color: var(--color-primary-light);
}

.footer-bottom {
  text-align: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #9CA3AF;
  font-size: 0.875rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
}
</style>
