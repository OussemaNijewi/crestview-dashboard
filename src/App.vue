<script setup>
import { RouterView } from 'vue-router'
import Navbar from '@/components/layout/Navbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Collapsible Left Sidebar -->
    <Sidebar />

    <!-- Main Content Wrapper (Fills remaining screen width dynamically) -->
    <div class="content-wrapper">
      <header class="header-container">
        <Navbar />
      </header>

      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #ffffff;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  display: flex;
}

/* Automatically takes up all remaining width beside the sidebar */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents wide child components (tables/grids) from overflowing the flex container */
  padding: 0 2rem 2rem 2rem;
  box-sizing: border-box;
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.main-content {
  width: 100%;
  flex: 1;
  margin-top: 1.5rem;
  margin-left: 1.5rem;
}
</style>
