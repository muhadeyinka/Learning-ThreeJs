import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Scene Objects

// Geometries
const firstGeometry = new THREE.BoxGeometry(1, 1, 1)
const secondGeometry = new THREE.BoxGeometry(1, 1, 1)
const thirdGeometry = new THREE.BoxGeometry(1, 1, 1)

// Materials
const firstGeometryMaterial = new THREE.MeshBasicMaterial({color: 'red'})
const secondGeometryMaterial = new THREE.MeshBasicMaterial({color: '#00ff00'})
const thirdGeometryMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff})

// Mesh
const box1  = new THREE.Mesh(firstGeometry, firstGeometryMaterial)
const box2  = new THREE.Mesh(secondGeometry, secondGeometryMaterial)
const box3  = new THREE.Mesh(thirdGeometry, thirdGeometryMaterial)

box2.position.x = 2 
box3.position.x = -2
scene.add(box1, box2, box3)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 1
// camera.position.x = 2
scene.add(camera)

// Resize Handling
window.addEventListener('resize', () => {

    // Update Objects
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera Aspect
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Box1 Resize
    const box1Width = Math.floor(Math.max(1, sizes.width / 400))
    box1.scale.x = box1Width

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)

    console.log()
    

})

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)