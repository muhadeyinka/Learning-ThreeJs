import * as THREE from 'three'
import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

/**
 * Debug UI
 */
const pane = new Pane()

/**
 * Loaders
 */
// Loading Manager
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('onStart')
}
loadingManager.onProgress = () => {
    console.log('onProgress')
}
loadingManager.onLoad = () => {
    console.log('onLoad')
}
loadingManager.onError = () => {
    console.log('onError')
}

// TextureLoader
const textureLoader = new THREE.TextureLoader(loadingManager)

const metalColorTexture = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_basecolor.png'
)
const metalHeightTexture = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_height.png'
)
const metalMetallicTexture = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_height.png'
)
const metalNormalTexture = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_normal.png'
)
const metalRoughnessTexture = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_roughness.png'
)
const metalAoMap = textureLoader.load(
    './Textures/Metal Weave/Metal_Weave_011_ambientOcclusion.png'
)
metalColorTexture.colorSpace = THREE.SRGBColorSpace

const landScapeDisplacementTexture = textureLoader.load(
    './Textures/Landscape/Rock_036_height.png'
)
const landScapeColorTexture = textureLoader.load(
    './Textures/Landscape/Rock_036_baseColor.jpg'
)
const landScapeRoughnessTexture = textureLoader.load(
    './Textures/Landscape/Rock_036_roughness.jpg'
)
const landScapeNormalTexture = textureLoader.load(
    './Textures/Landscape/Rock_036_normal.jpg'
)
const landScapeAmbientOcclusionTexture = textureLoader.load(
    './Textures/Landscape/Rock_036_ambientOcclusion.jpg'
)

/**
 * Essentials
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Objects
 */
// ViewPort
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
// Debug UI
const parameters = {}

/**
 * Body
 */
//### Instanced Mesh ###//
// Geometry
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 100, 100)

// Material
const material = new THREE.MeshStandardMaterial()
material.map = metalColorTexture
material.displacementMap = metalHeightTexture
material.normalMap = metalNormalTexture
material.metalnessMap = metalMetallicTexture
material.roughnessMap = metalRoughnessTexture
material.aoMap = metalAoMap

// Instancing
const numberOfInstances = 30
const numberOfRows = 5
const numberOfLayers = 3
const spacing = 5
const numberOfInstancesPerRowPerLayer =
    numberOfInstances / numberOfRows / numberOfLayers

const xOffset = ((numberOfInstancesPerRowPerLayer - 1) * spacing) / 2
const yOffset = ((numberOfLayers - 1) * spacing) / 2
const zOffset = ((numberOfRows - 1) * spacing) / 2

const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    numberOfInstances
)

const dummy = new THREE.Object3D()

let indexPosition = []
let indexCounter = 0

for (let col = 0; col < numberOfLayers; col++) {
    for (let row = 0; row < numberOfRows; row++) {
        for (let i = 0; i < numberOfInstancesPerRowPerLayer; i++) {
            const xPosition = i * spacing - xOffset
            const yPosition = col * spacing - yOffset
            const zPosition = row * spacing - zOffset

            indexPosition[indexCounter] = {
                x: xPosition,
                y: yPosition,
                z: zPosition,
            }

            dummy.position.set(xPosition, yPosition, zPosition)
            dummy.updateMatrix()

            instancedMesh.setMatrixAt(indexCounter, dummy.matrix)
            indexCounter++
        }
    }
}
instancedMesh.instanceMatrix.needsUpdate = true
scene.add(instancedMesh)

const landScapeGeometry = new THREE.PlaneGeometry(
    500,
    500,
    2000,
    2000
)
const landScapeMaterial = new THREE.MeshStandardMaterial()
landScapeMaterial.displacementMap = landScapeDisplacementTexture
landScapeMaterial.normalMap = landScapeNormalTexture
landScapeMaterial.roughnessMap = landScapeRoughnessTexture
landScapeMaterial.aoMap = landScapeAmbientOcclusionTexture
landScapeMaterial.aoMapIntensity = 2.5
landScapeMaterial.map = landScapeColorTexture

const landScape = new THREE.Mesh(landScapeGeometry, landScapeMaterial)
landScape.rotation.x = -Math.PI * 0.5
landScape.position.y = -yOffset - 3
scene.add(landScape)

// Light
const pointLight = new THREE.PointLight('white', 10, 1000, 1)
// pointLight.position.y = 3
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('white', 1)
// scene.add(ambientLight)
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Camera Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

/**
 * Listeners
 */
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

const meshToCameraQuaternion = new THREE.Quaternion()

/**
 * Animate
 */
let time = Date.now()
const clock = new THREE.Clock()

const tick = () => {
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = deltaTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()

    // Make mesh look at camera
    for (let i = 0; i < numberOfInstances; i++) {
        dummy.position.set(
            indexPosition[i].x,
            indexPosition[i].y,
            indexPosition[i].z
        )
        dummy.updateMatrix()

        const meshToCameraDirection = camera.position
            .clone()
            .sub(dummy.position)
            .normalize()
        meshToCameraQuaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0).normalize(),
            meshToCameraDirection
        )

        dummy.quaternion.slerp(meshToCameraQuaternion, 1)

        instancedMesh.setMatrixAt(i, dummy.matrix)
    }
    instancedMesh.instanceMatrix.needsUpdate = true

    // Update Camera
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Call tick on next frame
    window.requestAnimationFrame(tick)
}
tick()
