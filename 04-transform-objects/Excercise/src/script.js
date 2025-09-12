import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Positioning
// mesh.position.x = 10
// mesh.position.y = - 100
// mesh.position.z = 1
// console.log(mesh.position.length())
// console.log(new THREE.Vector3(0, 0, 0).distanceTo(mesh.position))
// console.log(mesh.position)
// console.log(mesh.position.normalize())
// mesh.position.normalize()
// console.log(mesh.position.length())
mesh.position.set(0, 0.3, 1)

// Scale Objects
mesh.scale.x = 1
mesh.scale.y = 0.5
mesh.scale.z = 2

// Rotation
// mesh.rotation.y =  Math.PI * 0.25
// mesh.rotation.x = Math.PI * 0.25

// Enemey Mesh
const enemyMesh =  new THREE.Mesh(
    new THREE.CapsuleGeometry(1, 1, 4, 8),
    new THREE.MeshBasicMaterial()
)
scene.add(enemyMesh)

enemyMesh.scale.set(0.5, 0.5, 0.5)
enemyMesh.position.set(0.3, 1.8, 0.2)

// Quaternion Mesh
const quaternionMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'blue'})
)
scene.add(quaternionMesh)

quaternionMesh.position.set(-2, -0.1, 3)
quaternionMesh.scale.set(0.5, 3, 0.5)

// Use cylinder to master Quaternion lerp
const startQuaternion = new THREE.Quaternion()
startQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.1)

const endQuaternion = new THREE.Quaternion()
endQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), Math.PI * 2.5)

const quaternionX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0).normalize(), Math.PI)
const quaternionZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1).normalize(), Math.PI)

// const combinedRotation = startQuaternion.multiply(endQuaternion)

// Solo Quest to Understanding Quaternion
const quaternionY = new THREE.Quaternion()
quaternionY.setFromAxisAngle(new THREE.Vector3(1, 1, 0), Math.PI * 0.25)

mesh.quaternion.copy(quaternionY)


// Axes Helper
const axesHelper = new THREE.AxesHelper()
mesh.add(axesHelper)
quaternionMesh.add(axesHelper)
// scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 1900,
    height: 1000
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.x = 0
camera.position.y = 0.9
camera.position.z = 9
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const clock = new THREE.Clock()
const tick = () => 
    {
    const elapsedTime = clock.getElapsedTime()
    enemyMesh.position.x = Math.cos(elapsedTime) * 2
    enemyMesh.position.z = Math.sin(elapsedTime) * 2
    const progress = (Math.sin(elapsedTime) + 1) / 2
  // Make big cube look at enemyMesh
const meshToEnemyMesh = enemyMesh.position.clone().sub(mesh.position).normalize()
const lookAtQuaternion = new THREE.Quaternion()
lookAtQuaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    meshToEnemyMesh
)
// mesh.quaternion.slerp(lookAtQuaternion, 1)
  
    mesh.quaternion.slerp(lookAtQuaternion, 0.03)
    // quaternionMesh.quaternion.copy(quaternionX, 0.02).multiply(quaternionZ)
    // quaternionMesh.quaternion.copy(combinedRotation)
    
    window.requestAnimationFrame(tick)
    renderer.render(scene, camera)
}
tick()