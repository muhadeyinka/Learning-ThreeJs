import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { Pane } from 'tweakpane'

/**
 * Debug
 */
const pane = new Pane({
    title: 'debugObject'
})
const appearance = pane.addFolder({
    title: 'Appearance',
    expanded: false
})
const translation = pane.addFolder({
    title: 'Translation',
    width: 400
})
const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Body
 */
debugObject.meshColor = '#a778d8'
debugObject.subdivision = 2

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial()
material.color.set(debugObject.meshColor)

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

translation.addBinding(mesh.position, 'y', {
    step: 0.01,
    min: -3,
    max: 3,
    label: 'elavation',
    options: { low: -3, medium: 0, high: 3 },
})

translation.addBinding(mesh.scale, 'x', {
    label: 'boxScaleX',
    options: {
        small: 0.5,
        medium: 2,
        big: 4,
    },
})
translation.addBinding(mesh.scale, 'x', {
    min: 0.2,
    max: 9,
    step: 0.2,
})

translation
    .addBinding(mesh.rotation, 'y', {
        min: -Math.PI * 2,
        max: Math.PI * 2,
        step: 0.001,
        label: 'rotateY',
    })
    .on('change', (event) => {
        console.log(event.value.toFixed(2))
        if (event.last) {
            console.log('(last)')
        }
    })

pane.addBinding(material, 'wireframe')
pane.addBinding(mesh, 'visible')
pane.addBinding(debugObject, 'subdivision', {
    min: 1,
    max: 20,
    step: 1,
}).on('change', (event) => {
    if (event.last) {
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1,
            1,
            1,
            debugObject.subdivision,
            debugObject.subdivision,
            debugObject.subdivision
        )
    }
})

appearance
    .addBinding(debugObject, 'meshColor', {
        view: 'color',
        expanded: true,
        picker: 'inline',
    })
    .on('change', (event) => {
        if (event.last) {
            material.color.set(debugObject.meshColor)
        }
    })

const spinCube = () => {
    gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2, duration: 1 })
}
debugObject.spin = () => {
    gsap.to(mesh.rotation, {
        y: mesh.rotation.y + Math.PI * 2,
        duration: 1,
    })
}
translation
    .addButton({
        title: 'Spin',
    })
    .on('click', spinCube)
/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
