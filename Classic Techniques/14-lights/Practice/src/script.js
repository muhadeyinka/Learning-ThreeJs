import * as THREE from 'three'
import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'
import { TeapotGeometry } from 'three/examples/jsm/Addons.js'
import { RGBELoader } from 'three/examples/jsm/Addons.js'
/**
 * Debug Object
 */
const pane = new Pane()
const ambientLightFolder = pane.addFolder({
  title: 'Ambient Light'
})

const directionalLightFolder = pane.addFolder({
  title: 'Directional Light'
})

const pointLightFolder = pane.addFolder({
  title: 'Point Light'
})

const spotLightFolder = pane.addFolder({
  title: 'Spot Light'
})

const rectAreaLightFolder = pane.addFolder({
  title: 'Rect Area Light'
})
const parameters = {}

/**
 * Essentials
 */
// Canvas
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
    dpr: Math.min(window.devicePixelRatio, 2),
}

/**
 * Loader
 */
const fontLoader = new FontLoader()
const rgbeLoader = new RGBELoader()

rgbeLoader.load('/envMap/dancing_hall_1k.hdr',
    (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping

        scene.environment = environmentMap
        scene.background = environmentMap
        // scene.backgroundBlurriness = 0.
        scene.environmentIntensity = 0.33
    }
)

/**
 * Body
 */
// Room Structure
// console.time('Test')
// const wallGeometry = new THREE.BoxGeometry(0.1, 3, 3)
// const wallMaterial = new THREE.MeshStandardMaterial()

// const wall = new THREE.InstancedMesh(wallGeometry, wallMaterial, 6)

// // Matrices
// const leftWallMatrix = new THREE.Matrix4()
// leftWallMatrix.setPosition(-1.5, 0, 0.05)

// const rightWallMatrix = new THREE.Matrix4()
// rightWallMatrix.setPosition(1.5, 0, 0.05)

// const backWallMatrix = new THREE.Matrix4()
// backWallMatrix.compose(
//     new THREE.Vector3(0, 0, -1.5),
//     new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(0, 1, 0),
//         Math.PI * 0.5
//     ),
//     new THREE.Vector3(1, 1, 1.03)
// )
// // backWallMatrix.makeRotationY(Math.PI * 0.5)
// // backWallMatrix.setPosition(0, 0, -1.5)

// const frontWallMatrix = new THREE.Matrix4()
// frontWallMatrix.compose(
//     new THREE.Vector3(0, 0, 3.5),
//     new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(0, 1, 0),
//         Math.PI * 0.5
//     ),
//     new THREE.Vector3(1, 1, 1.03)
// )

// const topWallMatrix = new THREE.Matrix4()
// topWallMatrix.compose(
//     new THREE.Vector3(0, 3.5, 0),
//     new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(0, 0, 1),
//         Math.PI * 0.5
//     ),
//     new THREE.Vector3(1, 1, 1)
// )

// const bottomWallMatrix = new THREE.Matrix4()
// bottomWallMatrix.compose(
//     new THREE.Vector3(0, -1.55, 0),
//     new THREE.Quaternion().setFromAxisAngle(
//         new THREE.Vector3(0, 0, 1),
//         Math.PI * 0.5
//     ),
//     new THREE.Vector3(1, 1.03, 1.037)
// )

// wall.setMatrixAt(0, leftWallMatrix)
// wall.setMatrixAt(1, rightWallMatrix)
// wall.setMatrixAt(2, backWallMatrix)
// wall.setMatrixAt(3, frontWallMatrix)
// wall.setMatrixAt(4, topWallMatrix)
// wall.setMatrixAt(5, bottomWallMatrix)

// wall.setColorAt(2, new THREE.Color('red'))
// wall.setColorAt(5, new THREE.Color('green'))

// wall.instanceMatrix.needsUpdate = true
// wall.instanceColor.needsUpdate = true
// scene.add(wall)
// console.timeEnd('Test')

// console.time('Test')
const wallGeometry = new THREE.BoxGeometry(0.1, 3, 3)
const wallMaterial = new THREE.MeshPhysicalMaterial()
wallMaterial.ior = 1
wallMaterial.transmission = 0.9
wallMaterial.roughness = 0
wallMaterial.metalness = 0.3

// Left Wall
// const leftWall = new THREE.Mesh(wallGeometry, wallMaterial)
// leftWall.scale.z = 1.05
// leftWall.position.set(-2.48, 0, 0.075)
// scene.add(leftWall)

// Right Wall
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial)
rightWall.position.set(1.5, 0, 0.1)
scene.add(rightWall)

// Back Wall
const backWall = new THREE.Mesh(wallGeometry, wallMaterial)
backWall.position.set(-0.45, 0, -1.5)
backWall.rotation.y = Math.PI * 0.5
backWall.scale.set(1, 1, 1.33)
scene.add(backWall)

// Front Wall
// const frontWall = new THREE.Mesh(wallGeometry, wallMaterial)
// frontWall.position.set(0, 0, 3.5)
// frontWall.rotation.y = Math.PI * 0.5
// frontWall.scale.set(1, 1, 1.03)
// scene.add(frontWall)

// Top Wall
// const topWall = new THREE.Mesh(wallGeometry, wallMaterial)
// topWall.position.set(0, 3.5, 0)
// topWall.rotation.z = Math.PI * 0.5
// scene.add(topWall)

// Bottom Wall
const bottomWall = new THREE.Mesh(
    wallGeometry,
    wallMaterial
)
bottomWall.position.set(-0.45, -1.55, 0)
bottomWall.rotation.z = Math.PI * 0.5
bottomWall.scale.y = 1.3
bottomWall.scale.z = 1.1
scene.add(bottomWall)

// Glass Material
const glassMaterial = new THREE.MeshPhysicalMaterial()

// glassMaterial.transparent = true
glassMaterial.ior = 1.5
glassMaterial.thickness = 0.5
glassMaterial.transmission = 1
glassMaterial.metalness = 1
glassMaterial.roughness = 0

// Center Table
// // Teapot

const centerTable = new THREE.Group()
const centerTableTop = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.3, 0.9),
    wallMaterial
)
centerTableTop.position.y = -1

const centerTableBottom = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.5, 0.7),
    glassMaterial
)
centerTableBottom.position.y = -1.3

const teapotGeometry = new TeapotGeometry(0.23, 35)
const teapot = new THREE.Mesh(teapotGeometry, glassMaterial)
teapot.position.y = -0.62
teapot.rotation.y = -Math.PI * 0.25
scene.add(teapot)

centerTable.add(centerTableTop, centerTableBottom, teapot)
// centerTable.position.x = 0.8
centerTable.position.z = 0.5
scene.add(centerTable)

// Instanced Glass Sphere
const sphereGeometry = new THREE.SphereGeometry(0.1)

// sphere

const numberOfSphereInstances = 64
const numberOfRows = 4
const numberOfLayers = 4
const numberOfSphereInstancesPerRowPerLayer =
    numberOfSphereInstances / numberOfRows / numberOfLayers
const spacing = 0.25

const xOffset = ((numberOfSphereInstancesPerRowPerLayer - 1) * spacing) / 2
const yOffset = ((numberOfLayers - 1) * spacing) / 2
const zOffset = ((numberOfRows - 1) * spacing) / 2

const dummyForInstancedSphere = new THREE.Object3D()
let indexCounter = 0
const instancedSphere = new THREE.InstancedMesh(
    sphereGeometry,
    glassMaterial,
    numberOfSphereInstances
)

for (let layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) {
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
        for (
            let index = 0;
            index < numberOfSphereInstancesPerRowPerLayer;
            index++
        ) {
            const xPosition = index * spacing - xOffset
            const yPosition = layerIndex * spacing - yOffset
            const zPosition = rowIndex * spacing - zOffset

            dummyForInstancedSphere.position.set(
                xPosition,
                yPosition,
                zPosition
            )
            dummyForInstancedSphere.updateMatrix()

            instancedSphere.setMatrixAt(
                indexCounter,
                dummyForInstancedSphere.matrix
            )
            indexCounter++
        }
    }
}
instancedSphere.rotation.x = Math.PI * 0.25
instancedSphere.rotation.z = Math.PI * 0.25
instancedSphere.position.set(-0.3, 0.1, -0.7)
// instancedSphere.position.y = 1
instancedSphere.instanceMatrix.needsUpdate = true
scene.add(instancedSphere)

// ThreeJs Journey Text
fontLoader.load('/font/optimer_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Three.js Journey', {
        font,
        size: 0.27,
        depth: 0.09,
        curveSegments: 5,
        bevelEnabled: true,
        bevelSize: 0.03,
        bevelThickness: 0.03,
        bevelSegments: 5,
    })
    textGeometry.center()
    // const textMaterial = new THREE.MeshStandardMaterial({
    //     color: 'purple',
    //     // wireframe: true,
    // })
    const text = new THREE.Mesh(textGeometry, glassMaterial)
    text.position.set(0.1, 1.27, -1.37)
    // text.rotation.y = -Math.PI * 0.5
    scene.add(text)
})

// Mirror
// const mirrorGeometry = new THREE.BoxGeometry(0.1, 1.5, 2.5)
// const mirrorMaterial = new THREE.MeshStandardMaterial({ color: 'darkgrey' })
// const mirror = new THREE.Mesh(mirrorGeometry, glassMaterial)
// mirror.material.metalness = 1
// mirror.position.set(1.4, 0.3, 0.3)
// scene.add(mirror)

// Chandelier
// const chandelierGeometry = new THREE.TorusKnotGeometry(0.3, 0.1)
// const chandelierMaterial = new THREE.MeshStandardMaterial({ color: 'blue' })
// const chandelier = new THREE.Mesh(chandelierGeometry, chandelierMaterial)
// chandelier.position.y = 1.5
// chandelier.rotation.x = Math.PI * 0.5
// scene.add(chandelier)

// Front Light
const frontLightGroup = new THREE.Group()

const frontLightPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 1.7),
    glassMaterial
)

const frontLightStand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 0.03),
    glassMaterial
)
frontLightStand.position.y = -0.87

const frontLightConeGeometry = new THREE.ConeGeometry(0.19, 0.3, 32, 1, false)
const frontLightCone = new THREE.Mesh(
    frontLightConeGeometry,
    glassMaterial
)
frontLightCone.position.y = 0.9
frontLightCone.rotation.z = Math.PI * 0.5

frontLightGroup.position.set(1.1, -0.63, - 1)

frontLightGroup.add(frontLightPole, frontLightStand, frontLightCone)

scene.add(frontLightGroup)

// Wall Instanced Mesh
const wallInstancedMeshGeometry = new THREE.BoxGeometry(0.7, 0.3, 0.3)

const numberOfWallBoxInstances = 100
const numberOfWallBoxRows = 10
const numberOfWallBoxLayers = 10
const numberOfWallBoxPerRowPerLayers =
    numberOfWallBoxInstances / numberOfWallBoxRows / numberOfWallBoxLayers
const spacingBetweenWallBoxes = 0.3

const xOffsetForWallBoxes =
    ((numberOfWallBoxPerRowPerLayers - 1) * spacingBetweenWallBoxes) / 2
const yOffsetForWallBoxes =
    ((numberOfWallBoxLayers - 1) * spacingBetweenWallBoxes) / 2
const zOffsetForWallBoxes =
    ((numberOfWallBoxRows - 1) * spacingBetweenWallBoxes) / 2

const dummyForWallBoxes = new THREE.Object3D()
let positionForWallBoxes = []
let indexCounterForWallBoxes = 0
const wallInstancedMesh = new THREE.InstancedMesh(
    wallInstancedMeshGeometry,
    glassMaterial,
    numberOfWallBoxInstances
)

for (
    let wallBoxLayersCount = 0;
    wallBoxLayersCount < numberOfWallBoxLayers;
    wallBoxLayersCount++
) {
    for (
        let wallBoxRowsCount = 0;
        wallBoxRowsCount < numberOfWallBoxRows;
        wallBoxRowsCount++
    ) {
        for (
            let wallBoxIndexCount = 0;
            wallBoxIndexCount < numberOfWallBoxPerRowPerLayers;
            wallBoxIndexCount++
        ) {
            const xPosition =
                wallBoxIndexCount * spacingBetweenWallBoxes -
                xOffsetForWallBoxes +
                Math.sin(Math.random() * 0.3)
            const yPosition =
                wallBoxRowsCount * spacingBetweenWallBoxes - yOffsetForWallBoxes
            const zPosition =
                wallBoxLayersCount * spacingBetweenWallBoxes -
                zOffsetForWallBoxes

            dummyForWallBoxes.position.set(xPosition, yPosition, zPosition)
            dummyForWallBoxes.updateMatrix()

            positionForWallBoxes[indexCounterForWallBoxes] = {
                x: xPosition,
                y: yPosition,
                z: zPosition,
            }

            wallInstancedMesh.setMatrixAt(
                indexCounterForWallBoxes,
                dummyForWallBoxes.matrix
            )
            wallInstancedMesh.setColorAt(
                indexCounterForWallBoxes,
                new THREE.Color().setHSL(Math.random(), 1, Math.random())
            )
            indexCounterForWallBoxes++
        }
    }
}

wallInstancedMesh.position.x = -1.95
wallInstancedMesh.position.z = 0.05
wallInstancedMesh.instanceMatrix.needsUpdate = true
scene.add(wallInstancedMesh)

// const frontCover = new THREE.Mesh(
//     new THREE.BoxGeometry(1.25, 3, 0.1),
//     new THREE.MeshBasicMaterial()
// )
// frontCover.position.set(-1.77, 0, 1.65)
// scene.add(frontCover)

// Face
const face = new THREE.Group()
const faceDonut = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.03),
    glassMaterial
)
const faceTorusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.13, 0.013),
    glassMaterial
)
faceTorusKnot.rotation.z = Math.PI * 0.5

const faceEarsGeometry = new THREE.ConeGeometry(0.023, 0.2)
const leftFaceEar = new THREE.Mesh(
    faceEarsGeometry,
    glassMaterial
)
const rightFaceEar = new THREE.Mesh(
    faceEarsGeometry,
    glassMaterial
)
leftFaceEar.position.set(- 0.15, 0.3, 0)
leftFaceEar.rotation.z = Math.PI * 0.15

rightFaceEar.position.set(0.15, 0.3, 0)
rightFaceEar.rotation.z = - Math.PI * 0.15

face.add(faceDonut, faceTorusKnot, leftFaceEar, rightFaceEar)
face.position.set(0, 1.7, 0)

scene.add(face)


/**
 * Light
 */
// Ambient Light
parameters.ambientLightColor = '#404040'
const ambientLight = new THREE.AmbientLight(parameters.ambientLightColor, 0)
scene.add(ambientLight)

ambientLightFolder.addBinding(parameters, 'ambientLightColor', {
    view: 'color'
}).on('change', () => {
    ambientLight.color.set(parameters.ambientLightColor)
})
ambientLightFolder.addBinding(ambientLight, 'intensity', {
    min: 0,
    max: 5,
    step: 0.01
})

// Directional Light
parameters.directionalLightColor = '#00B4D8'
const directionalLight = new THREE.DirectionalLight(parameters.directionalLightColor, 0)
scene.add(directionalLight)

directionalLightFolder.addBinding(parameters, 'directionalLightColor', {
    view: 'color'
}).on('change', () => {
   directionalLight.color.set(parameters.directionalLightColor) 
})
directionalLightFolder.addBinding(directionalLight, 'intensity', {
    min: 0,
    max: 5, 
    step: 0.01
})

// Point Light
parameters.pointLightColor = '#FFE5B4'
const pointLight = new THREE.PointLight(parameters.pointLightColor, 5, 0, 1.5)
pointLight.position.y = 1
scene.add(pointLight)

pointLightFolder.addBinding(parameters, 'pointLightColor', {
    view: 'color'
}).on('change', () => {
    pointLight.color.set(parameters.pointLightColor)
})
pointLightFolder.addBinding(pointLight, 'intensity', {
    min: 0,
    max: 5,
    step: 0.01
})

// Spot Light
parameters.spotLightColor = '#B020FF'
const spotLight = new THREE.SpotLight(parameters.spotLightColor, 0, 0, Math.PI * 0.07)
scene.add(spotLight)

spotLightFolder.addBinding(parameters, 'spotLightColor', {
    view: 'color'
}).on('change', () => {
    spotLight.color.set(parameters.spotLightColor)
})
spotLightFolder.addBinding(spotLight, 'intensity', {
    min: 0,
    max: 5,
    step: 0.01
})



/**
 * Camera
 */
// Perspective Camera
const camera = new THREE.PerspectiveCamera(75, viewport.width / viewport.height)
camera.position.z = 3

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(viewport.width, viewport.height)
renderer.setPixelRatio(viewport.dpr)
// renderer.setClearColor('navy')
renderer.render(scene, camera)

/**
 * Event Listeners
 */
// Resize
window.addEventListener('resize', () => {
    // Update Viewport
    viewport.width = window.innerWidth
    viewport.height = window.innerHeight
    viewport.dpr = Math.min(window.devicePixelRatio, 2)

    // Update Camera
    camera.aspect = viewport.width / viewport.height
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(viewport.width, viewport.height)
    renderer.setPixelRatio(viewport.dpr)
})

// Fullscreen
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
let previousTime = Date.now()
const clock = new THREE.Clock()

const faceQuaternion = new THREE.Quaternion()
const coneQuaternion = new THREE.Quaternion()
const zVector = new THREE.Vector3(0, 0, 1)
const negYVector = new THREE.Vector3(0, -1, 0)
const tick = () => {
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - previousTime
    previousTime = currentTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()

    // Instanced Sphere
    instancedSphere.rotation.y = elapsedTime * 0.25

    // Instanced Wall Boxes
    if (positionForWallBoxes.length === numberOfWallBoxInstances) {
        for (let i = 0; i < indexCounterForWallBoxes; i++) {
            dummyForWallBoxes.position.set(
                positionForWallBoxes[i].x +
                    Math.sin(elapsedTime * (i * 0.03)) * 0.14,
                positionForWallBoxes[i].y,
                positionForWallBoxes[i].z
            )

            // dummyForWallBoxes.position.x = posit Math.sin(elapsedTime * Math.random()) * 0.13
            dummyForWallBoxes.updateMatrix()

            wallInstancedMesh.setMatrixAt(i, dummyForWallBoxes.matrix)
        }
    }
    wallInstancedMesh.instanceMatrix.needsUpdate = true

    // FaceQuaternion
    const faceToCamerDirection = camera.position.clone().sub(face.position).normalize()
    const coneToCamerDirection = camera.position.clone().sub(frontLightCone.position).normalize()

    faceQuaternion.setFromUnitVectors(
        zVector,
        faceToCamerDirection
    )
    face.quaternion.slerp(faceQuaternion, 0.05)

    coneQuaternion.setFromUnitVectors(
        negYVector,
        coneToCamerDirection
    )
    frontLightCone.quaternion.slerp(coneQuaternion, 0.03)



    // Update Camera
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Req. Frame
    window.requestAnimationFrame(tick)
}
tick()
