import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from 'tweakpane'

/**
 * Debug Object
 */
const pane = new Pane()

/**
 * Essentials
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Object
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Body
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({color: 'red'})
// )
// scene.add(cube)

const geometry = new THREE.ConeGeometry()
const material = new THREE.MeshBasicMaterial({color: 'red'})

const numberOfInstances = 1000
const spacingBetweenInstances = 3
const numberOfRows = 10
const numberOfLayers = 10
const numberOfInstancesPerRowPerLayers = numberOfInstances / numberOfRows / numberOfLayers

const xOffset = (numberOfInstancesPerRowPerLayers - 1) * spacingBetweenInstances / 2
const zOffset = (numberOfRows - 1) * spacingBetweenInstances / 2
const yOffset = (numberOfLayers - 1) * spacingBetweenInstances / 2

const instancedMesh = new THREE.InstancedMesh(geometry, material, numberOfInstances)
let instanceIndex = 0
let dummy = new THREE.Object3D()

for(let col = 0; col < numberOfLayers; col++)
{
    for(let row = 0; row < numberOfRows; row++)
    {
        for(let index = 0; index < numberOfInstancesPerRowPerLayers; index++)
        {
            const xPosition = (index * spacingBetweenInstances) - xOffset
            const zPosition = (row * spacingBetweenInstances) - zOffset
            const yPosition = (col * spacingBetweenInstances) - yOffset

            dummy.position.set(xPosition, yPosition, zPosition)
            dummy.updateMatrix()

            instancedMesh.setMatrixAt(instanceIndex, dummy.matrix)
            instanceIndex++

            console.log(xPosition, yPosition, zPosition)
        }
    }
}
instancedMesh.instanceMatrix.needsUpdate = true
scene.add(instancedMesh)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

/**
 * Event Listeners
 */
// Resize
window.addEventListener('resize', () => {
    // Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update Camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Fullscreen
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    
    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }else {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
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

    // Update Camera
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Req. Frame
    window.requestAnimationFrame(tick)
}
tick()