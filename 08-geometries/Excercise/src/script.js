import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TeapotGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// const geometry = new THREE.BufferGeometry()
// const positionArray = new Float32Array([
//     -1, 1, 0,
//     -1, -1, 0,
//     0, -1, 0,
//     0, 1, 0,
//     0, 1, -1,
//     -1, 1, -1,
//     0, -1, -1
// ])
// const indices = new Uint16Array([
//     0, 1, 2,
//     2, 3, 0,
//     3, 4, 5,
//     5, 3, 0,
//     4, 2, 6
// ])
// const bufferAttribute = new THREE.BufferAttribute(positionArray, 3)
// const indexAttribute = new THREE.BufferAttribute(indices, 1)
// geometry.setAttribute('position', bufferAttribute)
// geometry.setIndex(indexAttribute)
// geometry.computeVertexNormals()

// const instanceGeometry = new THREE.InstancedBufferGeometry()
// instanceGeometry.copy(geometry)

// const count = 1000
// const instancePositions = new Float32Array(count * 3)
// for(let i = 0; i < count; i++)
// {
//     const i3 = i * 3
//     instancePositions[i3    ] = (Math.random()) - 0.5
//     instancePositions[i3 + 1] = (Math.random()) - 0.5
//     instancePositions[i3 + 2] = (Math.random()) - 0.5
// }
// const instancedBufferAttribute = new THREE.InstancedBufferAttribute(instancePositions, 3)
// geometry.setAttribute('instancePosition', instancedBufferAttribute)
// geometry.instanceCount = 1000

// const geometry = new THREE.BoxGeometry(1, 1, 1)
const count = 20
const positionsArray = new Float32Array(count * 3 * 3)

for (let i = 0; i < count * 3 * 3; i++) {
  const i3 = i * 3
  positionsArray[i3] = (Math.random() - 0.5) * 4
  positionsArray[i3 + 1] = (Math.random() - 0.5) * 4
  positionsArray[i3 + 2] = (Math.random() - 0.5) * 4
  // positionsArray[i] = (Math.random() - 0.5) * 3
}
console.log(positionsArray)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positionsArray, 3))

const material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  wireframe: true,
  color: 'red',
})
const mesh = new THREE.Mesh(geometry, material)
// const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 2, 1), material, 10000)
scene.add(mesh)

// const dummy = new THREE.Object3D()
// for(let i = 0; i < mesh.count; i++)
// {
//     const rowX = (i % 100) - 50
//     // const rowZ = i *
//     dummy.position.x = rowX
//     dummy.position.z = ((rowX + i)/ 100)
//     dummy.position.y = Math.random()

//     dummy.updateMatrix()
//     mesh.setMatrixAt(i, dummy.matrix)
//     mesh.setColorAt(i, new THREE.Color().setHSL(Math.random(), 0.05, 0.5))
// }

// Instanced Mesh
// const geometry = new THREE.TorusGeometry(0.5)
// const material = new THREE.MeshBasicMaterial()

// const numberOfTeapots = 3000
// const distanceBetweenTeaPots = 2
// const numberOfRows = 10
// const layers = 15
// const numberOfTeapotsPerRow = numberOfTeapots / numberOfRows / layers

// const centerX = ((numberOfTeapotsPerRow - 1) * distanceBetweenTeaPots) / 2
// const centerZ = ((numberOfRows - 1) * distanceBetweenTeaPots) / 2
// const centerY = ((layers - 1) * distanceBetweenTeaPots) / 2

// const mesh = new THREE.InstancedMesh(geometry, material, numberOfTeapots)

// let teapotIndex = 0
// const matrix = new THREE.Matrix4()
// const dummy = new THREE.Object3D()
// const originalPosition = []

// for (let lay = 0; lay < layers; lay++) {
//   for (let row = 0; row < numberOfRows; row++) {
//     for (let i = 0; i < numberOfTeapotsPerRow; i++) {
//       const xPosition = i * distanceBetweenTeaPots - centerX
//       const yPosition = lay * distanceBetweenTeaPots - centerY
//       const zPosition = row * distanceBetweenTeaPots - centerZ
//       // matrix.setPosition(xPosition, yPosition, zPosition)
//       dummy.position.set(xPosition, yPosition, zPosition)
//       dummy.updateMatrix()
//       originalPosition[teapotIndex] = {
//         x: xPosition,
//         y: yPosition,
//         z: zPosition,
//       }

//       mesh.setMatrixAt(teapotIndex, dummy.matrix)
//       mesh.setColorAt(
//         teapotIndex,
//         new THREE.Color().setHSL(Math.random(), 1, Math.random())
//       )
//       teapotIndex++
//     }
//   }
// }
// mesh.instanceMatrix.needsUpdate = true
// scene.add(mesh)

const axesHelper = new THREE.AxesHelper(50)
scene.add(axesHelper)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
)
// camera.position.set(15, 10, 15)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  //   for (let i = 0; i < numberOfTeapots; i++) {
  //     dummy.position.set(
  //       originalPosition[i].x,
  //       originalPosition[i].y,
  //       originalPosition[i].z
  //     )
  //     //   dummy.rotation.y = elapsedTime * distanceBetweenTeaPots
  //     originalPosition[i].y += Math.sin(originalPosition[i].z + elapsedTime) * 0.02
  //     dummy.updateMatrix()
  //     mesh.setMatrixAt(i, dummy.matrix)
  //   }
  //   mesh.instanceMatrix.needsUpdate = true
  // for(let i = 0; i < mesh.count; i++){

  // dummy.rotation.x = elapsedTime
  // dummy.updateMatrix()
  // mesh.setMatrixAt(i, dummy.matrix)
  // }
  // // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()

// const vertexCount = 1000
// const positions  = new Float32Array(vertexCount * 3)
// const indices = [
//     0, 1, 2,
//     2, 3, 0
// ]

// for(let i = 0; i < vertexCount; i++){
//     const i3 = i * 3
//     positions[i3    ] = Math.random() - 0.5
//     positions[i3 + 1] = Math.random() - 0.5
//     positions[i3 + 2] = Math.random() - 0.5
// }

// const geometry = new THREE.BufferGeometry()
// geometry.setIndex(indices)
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// const boxMaterial = new THREE.MeshBasicMaterial()
// const numberOfInstances = 10
// const distanceBetweenBoxes = 2
// const numberOfRows= 2

// const boxPerRow = numberOfInstances / numberOfRows
// const centerOffset = (boxPerRow - 1) * distanceBetweenBoxes/2

// let instanceCounter = 0

// const instancedMesh = new THREE.InstancedMesh(
//   boxGeometry,
//   boxMaterial,
//   numberOfInstances
// )

// const matrix = new THREE.Matrix4()

// for (let row = 0; row < numberOfRows; row++){
// for(let i = 0; i < boxPerRow; i++)
// {
//     const xPosition = (i * distanceBetweenBoxes) - centerOffset
//     const zPosition =  row * distanceBetweenBoxes
//     console.log(row)
//     matrix.setPosition(xPosition, 0, zPosition)

//     instancedMesh.setMatrixAt(instanceCounter, matrix)
//     instanceCounter++
// }
// }

// instancedMesh.instanceMatrix.needsUpdate = true
// scene.add(instancedMesh)

// const geometry = new THREE.IcosahedronGeometry(1, 10)
// const material = new THREE.MeshBasicMaterial({})

// const numberOfBoxes = 90
// const spacing = 3

// const numberOfRows = 10
// const numberOfBoxesPerRow = numberOfBoxes / numberOfRows

// const numberOfColumns = 10

// const xOffset = (numberOfBoxesPerRow - 1) * spacing / 2
// const zOffset = (numberOfRows - 1) * spacing / 2

// const instancedMesh = new THREE.InstancedMesh(geometry, material, numberOfBoxes)
// const matrix = new THREE.Matrix4()

// let instanceCounter = 0

// for(let col = 0; col < numberOfColumns; col++){
// for(let row = 0; row < numberOfRows; row++){
// for(let i = 0; i < numberOfBoxesPerRow; i++)
// {
//     const xPosition = (i * spacing) - xOffset;
//     const zPosition = (row * spacing) - zOffset
//     const yPosition = col * spacing

//     matrix.setPosition(xPosition, yPosition, zPosition)

//     instancedMesh.setMatrixAt(instanceCounter, matrix)
//     instanceCounter++
// }
// }
// }
// instancedMesh.instanceMatrix.needsUpdate = true
// scene.add(instancedMesh)

// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial()

// const numberOfInstances = 400
// const numberOfRows = 20
// const numberOfColumns = 4
// const numberOfInstancesPerRows = numberOfInstances / numberOfRows / numberOfColumns

// const instancedMesh = new THREE.InstancedMesh(geometry, material, numberOfInstances)

// const spacing = 2
// const xOffset = (numberOfInstancesPerRows - 1) * spacing / 2
// const zOffset = (numberOfRows - 1) * spacing / 2
// const yOffset = (numberOfColumns - 1) * spacing / 2

// const matrix = new THREE.Matrix4()

// let iCounter = 0

// for(let col = 0; col < numberOfColumns; col++){
// const randomColor =  Math.random()
// for(let row = 0; row < numberOfRows; row++){
// for(let i = 0; i < numberOfInstancesPerRows; i++)
// {
//     const xPosition = (i * spacing) - xOffset
//     const zPosition = (row * spacing) - zOffset
//     const yPosition = (col * spacing) - yOffset

//     matrix.setPosition(xPosition, yPosition, zPosition)

//     instancedMesh.setColorAt(iCounter, new THREE.Color().setHSL(randomColor, 1, 0.5))
//     instancedMesh.setMatrixAt(iCounter, matrix)
//     iCounter++
// }
// }}

// instancedMesh.instanceMatrix.needsUpdate = true
// scene.add(instancedMesh)
