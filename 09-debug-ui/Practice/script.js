import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from './node_modules/tweakpane'

/**
 * Debug UI
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
 * Objects
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}
const parameters = {}
// General Instanced Mesh

parameters.numberOfInstances = 100
parameters.temporaryNumberOfInstances = 100
parameters.instanceSpacing = 5
parameters.numberOfRows = 5
parameters.numberOfLayers = 5

// General Geometry Parameters
parameters.triangleCount = 10
parameters.triangleAmplitude = 1

// General Material Parameters
parameters.generalMaterialColor = '#ff00ff'
parameters.generalMaterialWireframe = false

/**
 * Body
 */
// General Geometry
const generalGeometry = new THREE.BufferGeometry()
const positionsArray = new Float32Array(parameters.triangleCount * 3 * 3)

const geometryDefinition = () => {
    parameters.numberOfInstancesPerRowPerLayer =
        parameters.numberOfInstances /
        parameters.numberOfRows /
        parameters.numberOfLayers
    for (let i = 0; i < parameters.triangleCount * 3 * 3; i++) {
        positionsArray[i] = (Math.random() - 0.5) * parameters.triangleAmplitude
    }
    generalGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positionsArray, 3)
    )
}
geometryDefinition()

// General Material
const generalMaterial = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
generalMaterial.color.set(parameters.generalMaterialColor)

// General Mesh
// const generalMesh = new THREE.Mesh(generalGeometry, generalMaterial)
// scene.add(generalMesh)

// General Instanced Mesh
let generalInstancedMesh = null
let storeInstancedMeshPosition = []
let dummy

const generateInstancedMesh = () => {
    generalInstancedMesh = new THREE.InstancedMesh(
        generalGeometry,
        generalMaterial,
        parameters.numberOfInstances
    )

    // Center All
    const xOffset =
        ((parameters.numberOfInstancesPerRowPerLayer - 1) *
            parameters.instanceSpacing) /
        2
    const zOffset =
        ((parameters.numberOfRows - 1) * parameters.instanceSpacing) / 2
    const yOffset =
        ((parameters.numberOfLayers - 1) * parameters.instanceSpacing) / 2

    // Dummy Object
    dummy = new THREE.Object3D()

    // Index
    let customGeometryIndex = 0

    // Positioning
    for (let col = 0; col < parameters.numberOfLayers; col++) {
        for (let row = 0; row < parameters.numberOfRows; row++) {
            for (
                let i = 0;
                i < parameters.numberOfInstancesPerRowPerLayer;
                i++
            ) {
                // Set(X, Y, Z) Positions
                const xPosition = i * parameters.instanceSpacing - xOffset
                const yPosition = col * parameters.instanceSpacing - yOffset
                const zPosition = row * parameters.instanceSpacing - zOffset

                // Store(X, Y, Z) Positions
                storeInstancedMeshPosition[customGeometryIndex] = {
                    x: xPosition,
                    y: yPosition,
                    z: zPosition,
                }

                // Update Dummy
                dummy.position.set(xPosition, yPosition, zPosition)
                dummy.updateMatrix()

                // Update Positions
                generalInstancedMesh.setMatrixAt(
                    customGeometryIndex,
                    dummy.matrix
                )
                customGeometryIndex++
            }
        }
    }

    generalInstancedMesh.instanceMatrix.needsUpdate = true
    scene.add(generalInstancedMesh)
}
generateInstancedMesh()
console.log(storeInstancedMeshPosition)

const resetGeometry = () => {
    generalInstancedMesh.geometry.dispose()
    positionsArray.fill(0.0)
}

// General Geometry Tweak
const generalGeometryTweaks = pane.addFolder({
    title: 'General Geometry',
})

generalGeometryTweaks
    .addBinding(parameters, 'triangleCount', {
        min: 1,
        max: 50,
        step: 1,
    })
    .on('change', (event) => {
        if (event.last) {
            resetGeometry()
            geometryDefinition()
        }
    })
generalGeometryTweaks
    .addBinding(parameters, 'triangleAmplitude', {
        min: 1,
        max: 10,
        step: 1,
    })
    .on('change', (event) => {
        if (event.last) {
            resetGeometry()
            geometryDefinition()
        }
    })

// General Material Tweak
const generalMaterialTweaks = pane.addFolder({
    title: 'General Material',
    expanded: false,
})
generalMaterialTweaks
    .addBinding(parameters, 'generalMaterialColor', {
        view: 'color',
        expanded: true,
        picker: 'inline',
    })
    .on('change', () => {
        generalMaterial.color.set(parameters.generalMaterialColor)
    })

// General Instaced Mesh Tweak
const generalInstancedMeshTweak = pane.addFolder({
    title: 'General Instanced Mesh',
})
generalInstancedMeshTweak
    .addBinding(parameters, 'instanceSpacing', {
        min: 0,
        max: 20,
        step: 0.1,
    })
    .on('change', (event) => {
        resetGeometry()
        scene.remove(generalInstancedMesh)
        geometryDefinition()
        generateInstancedMesh()
    })
generalInstancedMeshTweak
    .addBinding(parameters, 'numberOfInstances', {
        min: 1,
        max: 3000,
        step: 1,
    })
    .on('change', (event) => {
        if (event.last) {
            parameters.temporaryNumberOfInstances = parameters.numberOfInstances
            resetGeometry(), scene.remove(generalInstancedMesh)
            geometryDefinition()
            generateInstancedMesh()
        }
    })

generalInstancedMeshTweak
    .addBinding(parameters, 'numberOfRows', {
        min: 1,
        max: 50,
        step: 1,
    })
    .on('change', () => {
        resetGeometry(), scene.remove(generalInstancedMesh)
        geometryDefinition()
        generateInstancedMesh()
    })

generalInstancedMeshTweak
    .addBinding(parameters, 'numberOfLayers', {
        min: 1,
        max: 20,
        step: 1,
    })
    .on('change', () => {
        resetGeometry(), scene.remove(generalInstancedMesh)
        geometryDefinition()
        generateInstancedMesh()
    })

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(20, 10, 20)
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
 * Event Listeners
 */
// Handle Resize
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

// Handle Fullscreen
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
 * Animation
 */
const clock = new THREE.Clock()
let time = Date.now()
const customGeometryToCameraQuaternion = new THREE.Quaternion()

const tick = () => {
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()

    // console.log(storeInstancedMeshPosition.length, parameters.numberOfInstances)
    // Geometry Look at Camera
    if (
        (parameters.temporaryNumberOfInstances =
            storeInstancedMeshPosition.length)
    ) {
        for (let i = 0; i < parameters.temporaryNumberOfInstances; i++) {
            dummy.position.set(
                storeInstancedMeshPosition[i].x,
                storeInstancedMeshPosition[i].y,
                storeInstancedMeshPosition[i].z
            )
            dummy.updateMatrix()

            const customGeometryToCamera = camera.position
                .clone()
                .sub(dummy.position)
                .normalize()
            customGeometryToCameraQuaternion.setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),
                customGeometryToCamera
            )
            dummy.quaternion.slerp(customGeometryToCameraQuaternion, 0.02)
            generalInstancedMesh.setMatrixAt(i, dummy.matrix)
        }
    }
    generalInstancedMesh.instanceMatrix.needsUpdate = true
    // Update Controls
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Call tick on next Frame
    window.requestAnimationFrame(tick)
}
tick()
