import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { TeapotGeometry } from 'three/examples/jsm/Addons.js'
/**
 * Essentials
 */
const canvas = document.querySelector('canvas.webgl')
const centerOfTheScene = new THREE.Vector3()
/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Object
 */
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
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target = centerOfTheScene
camera.position.z = 9
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * Body
 */
// Positioning
const circularPosition = Math.PI * 2

// Box
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 'purple' })
)

// Capsule
const capsule = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.5, 0.5, 20, 20),
  new THREE.MeshBasicMaterial({ color: 'brown' })
)

// Cone
const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 1),
  new THREE.MeshBasicMaterial({ color: 'white' })
)

// Teapot
const teapot = new THREE.Mesh(
  new TeapotGeometry(0.5),
  new THREE.MeshBasicMaterial({ color: 'gold' })
)

// Cylinder
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1),
  new THREE.MeshBasicMaterial({ color: 'green' })
)

//  Group
const objectGroup = new THREE.Group()
const objectArray = [box, capsule, cone, teapot, cylinder]
objectGroup.add(box, capsule, cone, teapot, cylinder)

for (let i = 0; i < objectArray.length; i++) {
  objectArray[i].position.set(
    Math.sin(circularPosition + i * objectArray.length) * objectArray.length,
    0,
    Math.cos(circularPosition + i * objectArray.length) * objectArray.length
  )
  //   objectArray[i].material.color.setHSL(Math.random(), 1.0, 0.5)
}
scene.add(objectGroup)

/**
 * Event Listeners
 */

// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update Aspect Ratio
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)
})

// Object Distance to Camera
let ObjectDistanceToCamera = null
let closestObject = null
let currentObject = null
/**
 * Animate
 */
let time = Date.now()
const clock = new THREE.Clock()
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime()
  const hValue = (elapsedTime * 0.1) % 1
  //   console.log(hValue)
  let actions = []

  // Delta Time
  const currentTime = Date.now()
  const deltaTime = currentTime - time
  time = currentTime

  // Actions
  const stop = () => {
    controls.autoRotate = false
    controls.target = centerOfTheScene
  }
  const rotationX = () => {
    closestObject.rotation.x = elapsedTime
  }
  const rotationZ = () => {
    closestObject.rotation.z = elapsedTime
  }
  const scalingX = () => {
    closestObject.scale.x = Math.sin(elapsedTime) + 2
  }
  const scalingY = () => {
    closestObject.scale.y = Math.cos(elapsedTime) + 2
  }
  const scalingZ = () => {
    closestObject.scale.z = Math.sin(elapsedTime)
  }

  actions = [rotationX, rotationZ, scalingX, scalingY, scalingZ]

  for (let i = 0; i < objectArray.length; i++) {
    objectArray[i].material.color.setHSL(hValue * (i + 1), 1.0, 0.5)
    ObjectDistanceToCamera = camera.position.distanceTo(objectArray[i].position)

    if (ObjectDistanceToCamera < 3) {
      closestObject = objectArray[i]
    }
  }

  if (closestObject && closestObject.position.distanceTo(camera.position) < 3) {
    // Loop not Necessary
    // for(let i = 0; i < objectArray.length; i ++)
    // {
    //     currentObject = objectArray.indexOf(closestObject)
    //     // console.log(currentObject)
    // }

    // Not needed since it will always be true
    //   if (closestObject == objectArray[currentObject]) {
    //     actions[currentObject]()
    //     controls.autoRotate = true
    //     controls.target = closestObject.position
    //   }

    currentObject = objectArray.indexOf(closestObject)
    actions[currentObject]()
    controls.autoRotate = true
    controls.target = closestObject.position
    // if(closestObject == objectArray[])
  } else {
    stop()
  }

  // Update Camera
  controls.update()

  // Update Renderer
  renderer.render(scene, camera)

  // Request Frame
  window.requestAnimationFrame(tick)
}
tick()
