<script setup>
import { computed } from 'vue'
import clientData from '@/mock/client.json'
import { RouterLink } from 'vue-router'
import LogoCanvas from '@/components/layout/LogoCanvas.vue'

// Get initials from client data and store in a string
const initials = computed(() => {
  const firstLetter = clientData.personalInfo?.firstName?.charAt(0) || ''
  const lastLetter = clientData.personalInfo?.lastName?.charAt(0) || ''
  return `${firstLetter}${lastLetter}`.toUpperCase()
})

// Navbar items array
const navItems = [
  {
    name: 'CIBC',
    path: 'https://www.cibc.com/en/personal-banking.html',
    isExternal: true,
  },
  {
    name: 'Manage Alerts',
    path: '/alerts',
    isExternal: false,
  },
  {
    name: 'My Profile',
    path: '/profile',
    isExternal: false,
  },
]
</script>

<template>
  <nav class="navbar-wrapper">
    <div class="navbar-pill">
      <!-- 3D Asset Placeholder Container (To be implemented later) -->
      <div class="aot-3d-container">
        <LogoCanvas />
      </div>

      <!-- Nav Links -->
      <div class="nav-links">
        <template v-for="item in navItems" :key="item.path">
          <a
            v-if="item.isExternal"
            :href="item.path"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-item"
          >
            <span class="nav-label">{{ item.name }}</span>
          </a>
          <RouterLink v-else :to="item.path" class="nav-item">
            <span class="nav-label">{{ item.name }}</span>
          </RouterLink>
        </template>
      </div>

      <!-- Far Right Initials Icon -->
      <div class="profile-badge" title="Client Profile">
        <span class="initials-text">{{ initials }}</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.5rem 1rem;
}

/* Floating Dark Pill Container */
.navbar-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #9f1d35;
  border-radius: 9999px;
  padding: 0.4rem 0.5rem;
  width: 100%;
  max-width: 680px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.25),
    0 8px 10px -6px rgba(0, 0, 0, 0.15);
}

/* Left 3D Asset Placeholder Circle */
.aot-3d-container {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #ffffff;
  flex-shrink: 0;
  cursor: grab;
}

/* Navigation Links Container */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 1.5rem;
}

.nav-item {
  color: #ffffff;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  overflow: hidden; /* Clips the text as it moves outside the link area */
  display: inline-flex;
  align-items: center;
  height: 24px; /* Fixed height for clean clipping */
}

/* Inner label element */
.nav-label {
  display: inline-block;
  transition: color 0.2s ease;
}

/* Hover & Active State Animations */
.nav-item:hover .nav-label,
.nav-item.router-link-active .nav-label {
  color: #ffffff;
  animation: verticalSpin 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Keyframe animation for vertical spin */
@keyframes verticalSpin {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  45% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Right Initials Badge Pill */
.profile-badge {
  height: 42px;
  padding: 0 1.25rem;
  background-color: #ffffff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.initials-text {
  color: #9f1d35;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}
</style>
