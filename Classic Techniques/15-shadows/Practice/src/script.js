import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { Pane } from 'tweakpane'
import { TeapotGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Debug UI
 */
const pane = new Pane()
pane.element.style.position = 'fixed'
pane.element.style.right = '0px'
pane.element.style.top = '0px'
pane.element.style.width = '350px'

// Folders
const positioning = pane.addFolder({
    title: '😎 Object Positioning',
    // expanded: false
})

// Debug Object
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
    dpr: Math.min(window.devicePixelRatio, 2)
}

/**
 * Materials
 */
const groundMaterial = new THREE.MeshStandardMaterial({color: 'wheat'})
const objectsMaterial = new THREE.MeshStandardMaterial()

/**
 * Body
 */
// Group
const objectsGroup = new THREE.Group()

// Ground
const groundGeometry = new THREE.PlaneGeometry(20, 20)
const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
)
ground.rotation.x = - Math.PI * 0.5
// ground.position.y = - 0.5
// ground.castShadow = true
ground.receiveShadow = true
scene.add(ground)

// Scene Objects
const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    objectsMaterial
)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    objectsMaterial
)

const octahedron = new THREE.Mesh(
    new THREE.OctahedronGeometry(),
    objectsMaterial
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(),
    objectsMaterial
)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(),
    objectsMaterial
)

const cone = new THREE.Mesh(
    new THREE.ConeGeometry(),
    objectsMaterial
)
cone.rotation.x = Math.PI

const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(),
    objectsMaterial
)

const capsule = new THREE.Mesh(
    new THREE.CapsuleGeometry(),
    objectsMaterial
)


const teapot = new THREE.Mesh(
    new TeapotGeometry(1),
    objectsMaterial
)

objectsGroup.add(box, sphere, torus, cone, cylinder, torusKnot, capsule, octahedron, teapot)



// Positioning 
parameters.numberOfObjects = objectsGroup.children.length
parameters.numberOfRows = 3.0
parameters.numberOfLayers = 1.0
parameters.spacingX = 4.0
parameters.spacingY = 4.0
parameters.spacingZ = 5.0

const position = () => {
const numberOfObjectsPerRowPerLayer = parameters.numberOfObjects / parameters.numberOfRows / parameters.numberOfLayers

const xOffset = (numberOfObjectsPerRowPerLayer - 1) * parameters.spacingX / 2
const yOffset = (parameters.numberOfLayers - 1) * parameters.spacingY / 2
const zOffset = (parameters.numberOfRows - 1) * parameters.spacingZ / 2

let objectCounter = 0

for(let yIndex = 0; yIndex < parameters.numberOfLayers; yIndex++)
{
    for(let zIndex = 0; zIndex < parameters.numberOfRows; zIndex++)
    {
        for(let xIndex = 0; xIndex < numberOfObjectsPerRowPerLayer; xIndex++)
        {
            if(objectCounter >= parameters.numberOfObjects) break;

            const xPosition = (xIndex * parameters.spacingX) - xOffset

            const yPosition = (yIndex * parameters.spacingY) - yOffset
            console.log(yPosition)

            const zPosition = (zIndex * parameters.spacingZ) - zOffset
            
            objectsGroup.children[objectCounter].position.x = xPosition
            objectsGroup.children[objectCounter].position.y = yPosition
            objectsGroup.children[objectCounter].position.z = zPosition
            objectCounter++

        }
    }
}
for(let i = 0; i < objectsGroup.children.length; i++)
{
    objectsGroup.children[i].geometry.computeBoundingBox()
    const height = objectsGroup.children[i].geometry.boundingBox.max.y - objectsGroup.children[i].geometry.boundingBox.min.y

    objectsGroup.children[i].position.y += height / 2

}
}
position()
scene.add(objectsGroup)



positioning.addBinding(parameters, 'numberOfRows', {
    min: 1,
    max: parameters.numberOfObjects,
    step: 1
}).on('change', position)

positioning.addBinding(parameters, 'numberOfLayers', {
    min: 1,
    max: parameters.numberOfObjects,
    step: 1
}).on('change', position)

positioning.addBinding(parameters, 'spacingX', {
    min: 0,
    max: 15,
    step: 0.01
}).on('change', position)

positioning.addBinding(parameters, 'spacingY', {
    min: 0,
    max: 15,
    step: 0.01
}).on('change', position)

positioning.addBinding(parameters, 'spacingZ', {
    min: 0,
    max: 15,
    step: 0.01
}).on('change', position)

// Enabling Shadow
objectsGroup.children.forEach((object) => {
    object.castShadow = true
    object.receiveShadow = true
})

/**
 * Lightning
 */
// Lightning Parameters
parameters.directionalLightColor = 0xffffff
parameters.pointLightColor = 0xff00ff
parameters.rectAreaLightColor = 'lightred'

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15)
scene.add(ambientLight)

// DirectionalLight
const directionalLight = new THREE.DirectionalLight(parameters.directionalLightColor, 0.1)
directionalLight.position.set(7, 9, 0)
directionalLight.castShadow = true
scene.add(directionalLight)

// DirectionalLight Shadow Optimaizations
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024

// directionalLight.shadow.radius = 7

directionalLight.shadow.camera.near = 1.5
directionalLight.shadow.camera.far = 35

directionalLight.shadow.camera.top = 25 / 2
directionalLight.shadow.camera.right = 25 / 2
directionalLight.shadow.camera.bottom = - 25 / 2
directionalLight.shadow.camera.left = - 25 / 2

// DirectionalLight Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

// Directional Light Camera Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)

// DirectionalLight GUI
const directionalLightFolder = pane.addFolder({
    title: '↗️ Directional Light',
    expanded: false
})
directionalLightFolder.addBinding(parameters,'directionalLightColor', {
    view: 'color'
}).on('change', () => {
    directionalLight.color.set(parameters.directionalLightColor)
})
directionalLightFolder.addBinding(directionalLight, 'intensity', {
    min: 0,
    max: 5,
    step: 0.01
})
directionalLightFolder.addBinding(directionalLight.position, 'x', {
    min: -15,
    max: 15,
    step: 0.1
})
directionalLightFolder.addBinding(directionalLight.position, 'y', {
    min: -15,
    max: 15,
    step: 0.1
})
directionalLightFolder.addBinding(directionalLight.position, 'z', {
    min: -15,
    max: 15,
    step: 0.1
})
directionalLightFolder.addBinding(directionalLightHelper, 'visible', {
    label: 'lightHelper'
})
directionalLightFolder.addBinding(directionalLightCameraHelper, 'visible', {
    label: 'cameraHelper'
})

// PointLight
const pointLight = new THREE.PointLight(parameters.pointLightColor, 1.5, 15, 0)
pointLight.position.set(-5, 5.0, 0)
scene.add(pointLight)

// PointLight Shadow
pointLight.castShadow = true

pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.camera.far = 5

// Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight)
pointLightHelper.visible = false
scene.add(pointLightHelper)

// PointLight Camera Helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
scene.add(pointLightCameraHelper)

// PointLight GUI
const pointLightFolder = pane.addFolder({
    title: '👉 Point Light',
    expanded: false
})

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
pointLightFolder.addBinding(pointLight.position, 'x', {
    min: - 20,
    max: 20,
    step: 0.1
})
pointLightFolder.addBinding(pointLight.position, 'y', {
    min: - 20,
    max: 20,
    step: 0.1
})
pointLightFolder.addBinding(pointLight.position, 'z', {
    min: - 20,
    max: 20,
    step: 0.1
})
pointLightFolder.addBinding(pointLightHelper, 'visible', {
    label: 'lightHelper'
})
pointLightFolder.addBinding(pointLightCameraHelper, 'visible', {
    label: 'cameraHelper'
})

/**
 * Camera
 */
// Perspective Camera
const camera = new THREE.PerspectiveCamera(75, viewport.width / viewport.height)
camera.position.z = 4
camera.position.y = 3

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen()
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen()
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

// Use in Tick
const centerOfTheScene = new THREE.Vector3()

const tick = () => {
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - previousTime
    previousTime = currentTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()

    // Directional Light
    // directionalLight.lookAt(centerOfTheScene)

    // Update Camera
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Req. Frame
    window.requestAnimationFrame(tick)
}
tick()
