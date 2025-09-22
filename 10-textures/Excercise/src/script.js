import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane'

/**
 * Debug UI
 */
const pane = new Pane()

const parameters = {}
parameters.centerX = 0.5
parameters.centerY = 0.5
parameters.rotationSpeed = 0

/**
 * Textures
 */
// const image = new Image()
// const texture = new THREE.Texture(image)
// texture.colorSpace = THREE.SRGBColorSpace
// window.addEventListener('load', (event) => {
//     texture.needsUpdate = true
// })
// image.src = '/textures/door/color.jpg'

const loadingManager = new THREE.LoadingManager()
// loadingManager.onStart = () => {
//     console.log('onStart')
// }
// loadingManager.onLoad = () => {
//     console.log('onLoad')
// }
// loadingManager.onProgress = () => {
//     console.log('onProgress')
// }
// loadingManager.onError = () => {
//     console.log('onError')
// }

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/minecraft.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg ')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.ClampToEdgeWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// colorTexture.repeat.x = 6
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.3

colorTexture.center = new THREE.Vector2(parameters.centerX, parameters.centerY)
// colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

pane.addBinding(colorTexture.repeat, 'x', {
    min: 0,
    max: 20,
    step: 1,
    label: 'repeatX',
})

pane.addBinding(colorTexture.repeat, 'y', {
    min: 0,
    max: 20,
    step: 1,
    label: 'repeatY',
})

pane.addBinding(colorTexture.offset, 'x', {
    min: -1,
    max: 1,
    step: 0.01,
    label: 'offsetX',
})

pane.addBinding(colorTexture.offset, 'y', {
    min: -1,
    max: 1,
    step: 0.01,
    label: 'offsetY',
})
pane.addBinding(colorTexture, 'wrapS', {
    options: {
        Clamp_Default: THREE.ClampToEdgeWrapping,
        Repeat: THREE.RepeatWrapping,
        Mirrored: THREE.MirroredRepeatWrapping,
    },
}).on('change', () => {
    colorTexture.needsUpdate = true
})

pane.addBinding(colorTexture, 'wrapT', {
    options: {
        Clamp_Default: THREE.ClampToEdgeWrapping,
        Repeat: THREE.RepeatWrapping,
        Mirrored: THREE.MirroredRepeatWrapping,
    },
}).on('change', () => {
    colorTexture.needsUpdate = true
})

pane.addBinding(parameters, 'centerX', {
    min: 0,
    max: 1,
    step: 0.01
}).on('change', () => {
    colorTexture.center.x = parameters.centerX
})

pane.addBinding(parameters, 'centerY', {
    min: 0,
    max: 1,
    step: 0.01
}).on('change', () => {
    colorTexture.center.y = parameters.centerY
})
pane.addBinding(parameters, 'rotationSpeed', {
    min: 0,
    max: 5,
    step: 0.1,
    label: 'rotationSpeed'
})

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    /**color: 0xff0000,*/ map: colorTexture,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

pane.addBinding(material, 'wireframe')

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
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    const paneElement = pane.element

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
camera.position.z = 3
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

    colorTexture.rotation = Math.sin(elapsedTime * parameters.rotationSpeed) * Math.PI * 2
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
