<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const canvasContainer = ref(null)
let scene, camera, renderer, animationFrameId
let modelRoot = null

let isDragging = false
let previousMousePosition = { x: 0, y: 0 }
let angularVelocity = { x: 0, y: 0.008 } // Default auto-rotate speed on Y axis
const AUTO_ROTATE_SPEED = 0.008
const DAMPING_FACTOR = 0.95 // Smooth slowdown after dragging

onMounted(() => {
  if (!canvasContainer.value) return

  // 1. Scene setup
  scene = new THREE.Scene()

  // 2. Camera setup
  const width = canvasContainer.value.clientWidth || 42
  const height = canvasContainer.value.clientHeight || 42
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 2.4

  // 3. Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  canvasContainer.value.appendChild(renderer.domElement)

  // 4. Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  // 5. Load and Center the GLB Model In-Place
  const loader = new GLTFLoader()
  loader.load(
    '/models/earth_logo.glb',
    (gltf) => {
      modelRoot = gltf.scene

      // --- IN-PLACE CENTERING LOGIC ---
      // Calculate bounding box of the loaded model
      const box = new THREE.Box3().setFromObject(modelRoot)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      // Keep modelRoot position at (0,0,0) so it rotates in place,
      // but shift the internal meshes/children so their center aligns with (0,0,0)
      modelRoot.position.set(0, 0, 0)
      modelRoot.traverse((child) => {
        if (child.isMesh) {
          child.geometry.center() // Centers geometry vertices locally
        }
      })

      // Auto-scale to fit nicely inside the 42px circle container
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.3 / maxDim
      modelRoot.scale.set(scale, scale, scale)
      // --------------------------------

      scene.add(modelRoot)
    },
    undefined,
    (error) => {
      console.error('An error occurred loading the GLB model:', error)
    },
  )

  // 6. Interaction Event Listeners
  const domEl = renderer.domElement

  const onMouseDown = (e) => {
    isDragging = true
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y

    // Calculate rotation delta based on drag displacement
    angularVelocity.y = deltaX * 0.008
    angularVelocity.x = deltaY * 0.008

    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = () => {
    isDragging = false
  }

  domEl.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  // 7. Animation loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    if (modelRoot) {
      if (isDragging) {
        // Apply rotation directly from drag velocities
        modelRoot.rotation.y += angularVelocity.y
        modelRoot.rotation.x += angularVelocity.x
      } else {
        // Smoothly decay extra drag velocity back to default auto-rotate speed
        angularVelocity.y =
          angularVelocity.y * DAMPING_FACTOR + AUTO_ROTATE_SPEED * (1 - DAMPING_FACTOR)
        angularVelocity.x = angularVelocity.x * DAMPING_FACTOR

        modelRoot.rotation.y += angularVelocity.y
        modelRoot.rotation.x += angularVelocity.x
      }
    }
    renderer.render(scene, camera)
  }

  animate()

  // 8. Clean up listeners on unmount
  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    domEl.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    renderer.dispose()
  })
})
</script>

<template>
  <div ref="canvasContainer" class="logo-canvas"></div>
</template>

<style scoped>
.logo-canvas {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.logo-canvas:active {
  cursor: grabbing;
}
</style>
