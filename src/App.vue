<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Centered Header Container -->
    <header class="header-container">
      <Navbar />
    </header>

    <!-- Dynamic Main Content Area -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f4f6f9;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Restricts header width and centers it at the top */
.header-container {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

/* Central Page View Container */
.main-content {
  width: 100%;
  max-width: 1000px;
  margin: 1.5rem auto;
  padding: 0 1rem;
}
</style>
