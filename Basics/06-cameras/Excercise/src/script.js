import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

const leftMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 16),
  new THREE.MeshBasicMaterial({ color: 'purple' })
)
scene.add(mesh, leftMesh)
leftMesh.position.set(1, 1, 1)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)
// const aspectRatio = sizes.width / sizes.height
// const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1, 100)
// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 3
// camera.lookAt(mesh.position)
scene.add(camera)
// const controls = new OrbitControls(camera, canvas)
const controls = new OrbitControls(camera, canvas)
controls.zoomToCursor = true
controls.autoRotate = true
// controls.autoRotateSpeed = 30
// controls.target.set(1, 1, 1)
controls.enableDamping = true
controls.dampingFactor = 0.07


/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
}
// let wheel = 3
// let pointerDown = 0
// let lastCameraPosition = {x: 0, y: 0, z: 3}

// window.addEventListener('wheel', (event) => {
//   if(event.deltaY > 0){
//     wheel += 0.2
//   }else{
//     wheel -= 0.2
//   }
// })


// window.addEventListener('mousemove', (event) => {
//   cursor.x = event.clientX / sizes.width - 0.5
//   cursor.y = - (event.clientY / sizes.height - 0.5) 
// }) 
// window.addEventListener('pointerup', () => {
//   pointerDown = 0
// })
// window.addEventListener('pointerdown', () => {
//   pointerDown = 1
// })




// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  // mesh.rotation.y = elapsedTime

  // Update Camera
  // camera.position.copy(new THREE.Vector3(cursor.x, cursor.y, 4))
// console.log(pointerDown)
// if(pointerDown == 1){
//   camera.position.x = Math.sin(cursor.x * Math.PI * 2.0) * wheel
//   camera.position.z = Math.cos(cursor.x * Math.PI * 2.0) * wheel 
//   camera.position.y = cursor.y * 3.0

//   lastCameraPosition.x = camera.position.x
//   lastCameraPosition.z = camera.position.z
//   lastCameraPosition.y = camera.position.y
// }else{
//   // camera.position.z = wheel
//   camera.position.x = lastCameraPosition.x
//   camera.position.y = lastCameraPosition.y 
//   camera.position.z = lastCameraPosition.z 
// }
//   camera.lookAt(mesh.position)
  

controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
