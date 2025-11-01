import * as THREE from 'three'
import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const pane = new Pane()
const ambientLightFolder = pane.addFolder({
    title: 'AmbientLight',
    expanded: false,
})
const directionalLightFolder = pane.addFolder({
    title: 'DirectionalLight',
    expanded: false,
})
const hemisphereLightFolder = pane.addFolder({
    title: 'HemisphereLight',
    expanded: false,
})
const pointLightFolder = pane.addFolder({
    title: 'PointLight',
    expanded: false,
})
const rectAreaLightFolder = pane.addFolder({
    title: 'RectAreaLight',
    expanded: false,
})
const spotLightFolder = pane.addFolder({
    title: 'SpotLight',
    expanded: false,
})

const parameters = {}
parameters.ambientLightColor = '#ffffff'
parameters.directionalLightColor = 0x00ffffc
parameters.hemisphereLightTopColor = 0xff0000
parameters.hemisphereLightBottomColor = 0x0000ff
parameters.pointLightColor = 0xff0000
parameters.rectAreaLightColor = 0x4e00ff
parameters.spotLightColor = 0x78ff00

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
// scene.add(ambientLight)

// const pointLight = new THREE.PointLight(0xffffff, 50)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
// scene.add(pointLight)

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
ambientLightFolder.addBinding(ambientLight, 'intensity', {
    min: 0,
    max: 3,
    step: 0.01,
})
ambientLightFolder
    .addBinding(parameters, 'ambientLightColor', {
        view: 'color',
    })
    .on('change', () => {
        ambientLight.color.set(parameters.ambientLightColor)
    })

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x00ffffc, 0.9)
directionalLight.position.set(1.0, 0.25, 0)
scene.add(directionalLight)

directionalLightFolder.addBinding(directionalLight, 'intensity', {
    min: 0,
    max: 3,
    step: 0.01,
})
directionalLightFolder
    .addBinding(parameters, 'directionalLightColor', {
        view: 'color',
    })
    .on('change', () => {
        directionalLight.color.set(parameters.directionalLightColor)
    })
directionalLightFolder.addBinding(directionalLight.position, 'x', {
    min: -10,
    max: 10,
    step: 0.1,
})
directionalLightFolder.addBinding(directionalLight.position, 'y', {
    min: -10,
    max: 10,
    step: 0.1,
})
directionalLightFolder.addBinding(directionalLight.position, 'z', {
    min: -10,
    max: 10,
    step: 0.1,
})

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9)
scene.add(hemisphereLight)

hemisphereLightFolder
    .addBinding(parameters, 'hemisphereLightTopColor', {
        view: 'color',
    })
    .on('change', () => {
        hemisphereLight.color.set(parameters.hemisphereLightTopColor)
    })
hemisphereLightFolder
    .addBinding(parameters, 'hemisphereLightBottomColor', {
        view: 'color',
    })
    .on('change', () => {
        hemisphereLight.groundColor.set(parameters.hemisphereLightBottomColor)
    })
hemisphereLightFolder.addBinding(hemisphereLight, 'intensity', {
    min: 0,
    max: 3,
    step: 0.01,
})

// Point Light
const pointLight = new THREE.PointLight(0xff0000, 3, 10, 2)
pointLight.position.set(1, -0.5, 1)
scene.add(pointLight)

pointLightFolder
    .addBinding(parameters, 'pointLightColor', {
        view: 'color',
    })
    .on('change', () => {
        pointLight.color.set(parameters.pointLightColor)
    })
pointLightFolder.addBinding(pointLight, 'intensity', {
    min: 0,
    max: 3,
    step: 0.01,
})
pointLightFolder.addBinding(pointLight.position, 'x', {
    min: -10,
    max: 10,
    step: 0.1,
})
pointLightFolder.addBinding(pointLight.position, 'y', {
    min: -10,
    max: 10,
    step: 0.1,
})
pointLightFolder.addBinding(pointLight.position, 'z', {
    min: -10,
    max: 10,
    step: 0.1,
})
pointLightFolder.addBinding(pointLight, 'distance', {
    min: 0,
    max: 15,
    step: 0.1,
})
pointLightFolder.addBinding(pointLight, 'decay', {
    min: 0,
    max: 15,
    step: 0.1,
})

// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

rectAreaLightFolder
    .addBinding(parameters, 'rectAreaLightColor', {
        view: 'color',
    })
    .on('change', () => {
        rectAreaLight.color.set(parameters.rectAreaLightColor)
    })
rectAreaLightFolder.addBinding(rectAreaLight.position, 'x', {
    min: -10,
    max: 10,
    step: 0.01,
})
rectAreaLightFolder.addBinding(rectAreaLight.position, 'y', {
    min: -10,
    max: 10,
    step: 0.01,
})
rectAreaLightFolder.addBinding(rectAreaLight.position, 'z', {
    min: -10,
    max: 10,
    step: 0.01,
})
rectAreaLightFolder.addBinding(rectAreaLight, 'intensity', {
    min: 0,
    max: 10,
    step: 0.01,
})
rectAreaLightFolder.addBinding(rectAreaLight, 'width', {
    min: 0,
    max: 10,
    step: 0.01,
})
rectAreaLightFolder.addBinding(rectAreaLight, 'height', {
    min: 0,
    max: 10,
    step: 0.01,
})
const spotLight = new THREE.SpotLight(
    parameters.spotLightColor,
    4.5,
    10,
    Math.PI * 0.1,
    0.25,
    1
)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLightFolder
    .addBinding(parameters, 'spotLightColor', {
        view: 'color',
        // expanded: true,
        picker: 'inline',
    })
    .on('change', () => {
        spotLight.color.set(parameters.spotLightColor)
    })

spotLightFolder.addBinding(spotLight.target.position, 'x', {
    min: -10,
    max: 10,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight.target.position, 'y', {
    min: -10,
    max: 10,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight.target.position, 'z', {
    min: -10,
    max: 10,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight, 'distance', {
    min: 0,
    max: 15,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight, 'angle', {
    min: 0,
    max: Math.PI * 2.0,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight, 'penumbra', {
    min: 0,
    max: 1,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight, 'decay', {
    min: 0,
    max: 15,
    step: 0.01,
})
spotLightFolder.addBinding(spotLight, 'intensity', {
    min: 0,
    max: 5,
    step: 0.01,
})
scene.add(spotLight.target)

/**
 * Light Helpers
 */
// Hemisphere Light Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
    hemisphereLight,
    0.5
)
scene.add(hemisphereLightHelper)

// Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.5
)
scene.add(directionalLightHelper)

// Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(pointLightHelper)

// Spot Light Helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

// Rect Area Light Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)
/**
 * Objects
 **/

// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.x = -1.5

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.65

scene.add(sphere, cube, torus, plane)

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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
