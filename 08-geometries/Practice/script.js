import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Essentials
const canvas = document.querySelector('canvas.webgl')
const centerOfTheScene = new THREE.Vector3()

// Scene
const scene = new THREE.Scene()

// Object
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 3000)
camera.position.z = 3
scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Body
// Geometry Creation Practice
const customGeometry = new THREE.BufferGeometry()
const positionsArray = new Float32Array([
    0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    -0.5, 0.5, 0.0,
    -0.5, -0.5, 0.0
])
const positionsArrayIndex = new Uint16Array([
    0.0, 1.0, 2.0,
    1.0, 2.0, 3.0
])
const customGeometryAttribute = new THREE.BufferAttribute(positionsArray, 3)
customGeometry.setIndex(new THREE.BufferAttribute(positionsArrayIndex, 1))
customGeometry.setAttribute('position', customGeometryAttribute)

// Material
const material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 'red'})

// Mesh
const customMesh = new THREE.Mesh(
    customGeometry, 
    material
)
customMesh.position.y = 3
scene.add(customMesh)

// Instanced Mesh Practice
const instancedMeshGeometry = new THREE.BoxGeometry(0.5, 3.0, 0.5)
const instancedMeshMaterial = new THREE.MeshBasicMaterial()
const numberOfInstances = 25

// Instanced Mesh
const instancedMesh = new THREE.InstancedMesh(
    instancedMeshGeometry,
    instancedMeshMaterial,
    numberOfInstances
)

// Rows, Columns and Spacing
const numberOfRows = 5
const numberOfLayers = 1
const numberOfInstancesPerRowPerLayer = numberOfInstances / numberOfRows / numberOfLayers
const spacing = 4

// Offset
const xOffset = (numberOfInstancesPerRowPerLayer - 1) * spacing / 2
const zOffset = (numberOfRows - 1) * spacing / 2
const yOffset = (numberOfLayers - 1) * spacing / 2

// Object 3d
const dummy = new THREE.Object3D()

// Store Positions
const storePosition = []

// Object Index
let objectIndex = 0

for(let col = 0; col < numberOfLayers; col++)
{
    for(let row = 0; row < numberOfRows; row++)
    {
        for(let index = 0; index < numberOfInstancesPerRowPerLayer; index++)
        {
            const xPosition = (index * spacing) - xOffset
            const zPosition = (row * spacing) - zOffset
            const yPosition = (col * spacing) - yOffset

            
            dummy.position.set(xPosition, yPosition, zPosition)
            dummy.updateMatrix()
            
            storePosition[objectIndex] = {
                x: xPosition,
                y: yPosition,
                z: zPosition
            }
            instancedMesh.setMatrixAt(objectIndex, dummy.matrix)
            objectIndex++
        }
    }
}

instancedMesh.instanceMatrix.needsUpdate = true
scene.add(instancedMesh)

// Renderer 
const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)

// Event Listeners
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

window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement){
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


const planeToCameraQuaternion = new THREE.Quaternion()

// Animate
let time = Date.now()
const clock = new THREE.Clock()

const tick = () => 
{
    // Delta Time
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    // Elapsed Time
    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i < numberOfInstances; i++)
    {
        // Set Dummy Position
        dummy.position.set(storePosition[i].x, storePosition[i].y, storePosition[i].z)
        dummy.updateMatrix()
        
        // Calculate Distance To Center
        const rotationSpeed = dummy.position.distanceTo(centerOfTheScene)
        dummy.rotation.z = Math.sin(elapsedTime * rotationSpeed) * 0.1

        instancedMesh.setMatrixAt(i, dummy.matrix)
        instancedMesh.setColorAt(i, new THREE.Color().setHSL((elapsedTime * rotationSpeed) * 0.2, 1, 0.5))
    }
    instancedMesh.instanceMatrix.needsUpdate = true
    instancedMesh.instanceColor.needsUpdate = true

    // Make Custom Geometry Follow Camera
    const planeToCamera = camera.position.clone().sub(customMesh.position).normalize()

    planeToCameraQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1).normalize(),
        planeToCamera
    )
    customMesh.quaternion.slerp(planeToCameraQuaternion, 0.09)
    customMesh.material.color.setHSL(elapsedTime * 0.1, 1, 0.5)

    // Update Camera and Controls
    controls.update()

    // Update Renderer
    renderer.render(scene, camera)

    // Request Frame
    window.requestAnimationFrame(tick)
}
tick()