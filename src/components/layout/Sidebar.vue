<script setup>
import { RouterLink } from 'vue-router'

const sidebarItems = [
  { name: 'Checking Account', path: '/checking' },
  { name: 'Savings Account', path: '/savings' },
  { name: 'TFSA Calculator', path: '/tfsa-calculator' },
  { name: 'GIC Calculator', path: '/gic-calculator' },
  { name: 'Mortgage Calculator', path: '/mortgage-calculator' },
  { name: 'Budget Calculator', path: '/budget-calculator' },
]
</script>

<template>
  <aside class="sidebar-wrapper">
    <div class="sidebar-pill">
      <!-- Infinity Icon Handle (Rotates and scales smoothly between collapsed/expanded states) -->
      <div class="collapse-handle">
        <img src="/images/sidebar_logo.png" alt="Sidebar Toggle" class="sidebar-icon" />
      </div>

      <!-- Navigation Items Container -->
      <nav class="sidebar-links">
        <RouterLink
          v-for="item in sidebarItems"
          :key="item.path"
          :to="item.path"
          class="sidebar-item"
        >
          <span class="sidebar-label">{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
/* Anchored to the left, spanning full vertical screen height */
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
}

/* Full-height rectangular panel docked to the left edge */
.sidebar-pill {
  background-color: #9f1d35;
  border-radius: 0 16px 16px 0;
  height: 95%;
  padding: 1.5rem 0.5rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.25),
    0 8px 10px -6px rgba(0, 0, 0, 0.15);

  width: 48px; /* Narrow collapsed width */
  overflow: hidden;
  white-space: nowrap;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;

  transition:
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    align-items 0.35s ease;
}

/* Slimmer expanded width on hover */
.sidebar-wrapper:hover .sidebar-pill {
  width: 150px;
  padding: 1.5rem 0.65rem;
  align-items: flex-start;
}

/* Header container for the infinity icon */
.collapse-handle {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 100%;
}

/* Infinity Icon styling & default Collapsed State (Vertical orientation + smaller scale) */
.sidebar-icon {
  width: 38px;
  height: auto;
  /* Rotated 90deg and slightly scaled down when collapsed */
  transform: rotate(90deg) scale(0.9);
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Seamless rotation to Horizontal (0deg), larger width, and full scale when expanded */
.sidebar-wrapper:hover .sidebar-icon {
  width: 48px; /* Grows wider */
  transform: rotate(0deg) scale(1.1); /* Scales up nicely */
}

/* Links Container */
.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

/* Sidebar Link Item */
.sidebar-item {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  overflow: hidden;
  display: flex;
  align-items: center;
  height: 36px;
  width: 100%;
  padding: 0 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

/* Inner Label Wrapper */
.sidebar-label {
  display: inline-block;
  transition: color 0.2s ease;
}

/* Hover & Active Route State Animations (Right-to-Left Spin) */
.sidebar-item:hover .sidebar-label,
.sidebar-item.router-link-active .sidebar-label {
  color: #ffffff;
  animation: horizontalSpin 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes horizontalSpin {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  45% {
    transform: translateX(100%);
    opacity: 0;
  }
  50% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
