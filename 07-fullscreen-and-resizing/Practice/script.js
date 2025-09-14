import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Essentials
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const head = document.querySelector('h2#head')
head.style.display = 'none'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Objects
 */
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)
camera.position.z = 3
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Body
 */
let scaleCount = Math.round(sizes.width / sizes.height) + 1

// Uniform for Cubes
const cubeGroup = new THREE.Group()
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeArray = []

const createCube = () => {
  const cube = new THREE.Mesh(
    cubeGeometry,
    new THREE.MeshBasicMaterial({
      color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
    })
  )
  cubeArray.push(cube)
  cubeGroup.add(cube)
  console.log(cubeArray)
}
createCube()
createCube()
createCube()
createCube()
createCube()
createCube()
createCube()
createCube()
createCube()

const adjustCubeGrid = () => {
  for (let i = 0; i < cubeArray.length; i++) {
    // for(let i = 0; i < scaleCount; i++){
    // cubeArray[i].position.x = scaleCount * i

    // // cubeArray[i].position.z = mod
    // // console.log(mod)
    // }

    // const counter = cubeArray.indexOf(cubeArray[i])
    const mod = i % scaleCount
    // console.log(counter, mod, counter - mod, counter + mod)
    cubeArray[i].position.z = i - mod - 3
    cubeArray[i].position.x = mod * 2 - 2
  }
}
adjustCubeGrid()

scene.add(cubeGroup)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearAlpha(0.1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

/**
 * Event Listeners
 */
// Handle Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Scale Count
  scaleCount = Math.round(sizes.width / sizes.height) + 1
  //   console.log(scaleCount)

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

  // Update Cube Positioning
  adjustCubeGrid()
})
// Handle Fullscreen
window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
    head.style.display = 'inline'
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
    head.style.display = 'none'
  }
})

/**
 * Animation
 */
let time = Date.now()
const clock = new THREE.Clock()

const tick = () => {
  // Delta Time
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime()
  // console.log()

  // Update Camera / Controls
  controls.update()

  // Update Renderer
  renderer.render(scene, camera)

  // Request Frame
  window.requestAnimationFrame(tick)
}
tick()

// // Cubes
// const cube1 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube2 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube3 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube4 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube5 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube6 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube7 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube8 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())

// const cube9 = new THREE.Mesh(cubeGeometry, new THREE.MeshBasicMaterial())
// cubeArray = [cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9]

// cubeGroup.add(cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9)
// scene.add(cubeGroup)
