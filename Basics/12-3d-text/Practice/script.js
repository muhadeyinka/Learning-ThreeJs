import * as THREE from 'three'
import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Debug Object
 */
const pane = new Pane()
const parameters = {}

/**
 * Essentials
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Viewport
 */
const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
}

/**
 * Loaders
 */
// Texture Loader
const textureLoader = new THREE.TextureLoader()

// Font Loader
const fontLoader = new FontLoader()

/**
 * Body
 */
// Text
let positionArray = []
let numberOfInstances = 100
let dummy = new THREE.Object3D()
let text = null

fontLoader.load('/font/gentilis_regular.typeface.json', (font) => {
    // TextGeometry and TextMaterial
    const textGeometry = new TextGeometry('Three.js Journey', {
        font: font,
        size: 0.2,
        depth: 0.02,
        curveSegments: 5,
    })
    textGeometry.center()
    const textMaterial = new THREE.MeshMatcapMaterial()

    const spacingBetweenInstances = 3
    const numberOfRow = 5
    const numberOfLayers = 5
    const numberOfInstancesPerRowPerLayer =
        numberOfInstances / numberOfRow / numberOfLayers

    const xOffset =
        ((numberOfInstancesPerRowPerLayer - 1) * spacingBetweenInstances) / 2
    const yOffset = ((numberOfLayers - 1) * spacingBetweenInstances) / 2
    const zOffset = ((numberOfRow - 1) * spacingBetweenInstances) / 2

    let indexCount = 0

    text = new THREE.InstancedMesh(
        textGeometry,
        textMaterial,
        numberOfInstances
    )
    for (let layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) {
        for (let rowIndex = 0; rowIndex < numberOfRow; rowIndex++) {
            for (
                let instanceIndex = 0;
                instanceIndex < numberOfInstancesPerRowPerLayer;
                instanceIndex++
            ) {
                const xPosition =
                    instanceIndex * spacingBetweenInstances - xOffset
                const yPosition = rowIndex * spacingBetweenInstances - yOffset
                const zPosition = layerIndex * spacingBetweenInstances - zOffset

                positionArray[indexCount] = {
                    x: xPosition,
                    y: yPosition,
                    z: zPosition,
                }

                dummy.position.set(xPosition, yPosition, zPosition)
                dummy.updateMatrix()

                text.setMatrixAt(indexCount, dummy.matrix)
                indexCount++
            }
        }
    }
    text.instanceMatrix.needsUpdate = true
    scene.add(text)
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, viewport.width / viewport.height)
camera.position.z = 3
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(viewport.width, viewport.height)
renderer.setPixelRatio(viewport.devicePixelRatio)
renderer.render(scene, camera)

/**
 * Event Listeners
 */
// Resize
window.addEventListener('resize', () => {
    // Update Viewport
    viewport.width = window.innerWidth
    viewport.height = window.innerHeight
    viewport.devicePixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update Camera
    camera.aspect = viewport.width / viewport.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(viewport.width, viewport.height)
    renderer.setPixelRatio(viewport.devicePixelRatio)
})

// Double-Click
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
 * Animate
 */
let previousTime = Date.now()
const clock = new THREE.Clock()

const threeJsJourneyToCameraQuaternion = new THREE.Quaternion()
const zVector = new THREE.Vector3(0, 0, 1)

const tick = () => {
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - previousTime
    previousTime = currentTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()
    // ThreeJs Journey to Camera
    if (positionArray.length === numberOfInstances && text !== null) {
        for (let i = 0; i < numberOfInstances; i++) {
            dummy.position.set(
                positionArray[i].x,
                positionArray[i].y,
                positionArray[i].z
            )
            dummy.updateMatrix()

            const threeJsJourneyToCameraDirection = camera.position
                .clone()
                .sub(dummy.position)
                .normalize()
            threeJsJourneyToCameraQuaternion.setFromUnitVectors(
                zVector,
                threeJsJourneyToCameraDirection
            )

            dummy.quaternion.slerp(threeJsJourneyToCameraQuaternion, 1)
            dummy.updateMatrix()
            text.setMatrixAt(i, dummy.matrix)
        }
        text.instanceMatrix.needsUpdate = true
    }

    // Update Controls
    controls.update()

    // Render scene
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
