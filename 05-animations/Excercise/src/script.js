import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Time
let time = Date.now()

const clock = new THREE.Clock()  

gsap.to(mesh.rotation, {duration: 3, x: Math.PI * 2, delay: 1})
gsap.to(mesh.rotation, {duration: 1, y: Math.PI, delay: 2})

// Animations
const tick = () => 
{
    // Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    
    const elapsedTime = clock.getDelta()
    // Update Object

    // const quaternionY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.01)
    // mesh.quaternion.multiply(quaternionY)
    // mesh.rotation.y += elapsedTime * Math.PI * 2

    // Renderer
    renderer.render(scene, camera)
    
    //Request Animation Frame 
    window.requestAnimationFrame(tick)
}

tick()