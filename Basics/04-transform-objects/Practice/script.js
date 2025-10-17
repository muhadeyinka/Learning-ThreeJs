import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Clock
const clock = new THREE.Mesh(
    new THREE.CircleGeometry(1.3),
    new THREE.MeshBasicMaterial()
)

// Hands
const handsGeometry = new THREE.BoxGeometry(1, 1, 1)
handsGeometry.translate(0, 0.5, 0)
const hourHand = new THREE.Mesh(
    handsGeometry,
    new THREE.MeshBasicMaterial({color: 'red'})
)
hourHand.position.z =  0.013
hourHand.scale.set(0.04, 0.5, 0)

const minHand = new THREE.Mesh(
    handsGeometry, 
    new THREE.MeshBasicMaterial({color: 'blue'})
)
minHand.position.z = 0.01
minHand.scale.set(0.05, 0.6, 0)

const secHand = new THREE.Mesh(
    handsGeometry, 
    new THREE.MeshBasicMaterial({color: 'green'})
)
secHand.position.z = 0.02
secHand.scale.set(0.03, 0.7, 0)

const clockGroup = new THREE.Group()
clockGroup.add(clock, minHand, hourHand, secHand)
scene.add(clockGroup)



const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 2
scene.add(camera)
// const controls = new OrbitControls(camera, canvas)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


const time = new THREE.Clock()
const tick = () => {
    const elapsedTime = time.getElapsedTime()
    const seconds = (elapsedTime % 60) / 60
    const minute = (elapsedTime % 3600) / 3600 
    const hour = (elapsedTime % 43200) / 43200 

    // Quaternion
    const secondQuaternion = new THREE.Quaternion()
    secondQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1).normalize(), -seconds * Math.PI * 2)
    secHand.quaternion.copy(secondQuaternion)

    const minuteQuaternion = new THREE.Quaternion()
    minuteQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), - minute * Math.PI * 2)
    minHand.quaternion.copy(minuteQuaternion)

    const hourQuaternion = new THREE.Quaternion()
    hourQuaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), -hour * Math.PI * 2)
    hourHand.quaternion.copy(hourQuaternion)
    
    // Trail Camera
    const clockToCameraDirection = camera.position.clone().sub(clockGroup.position).normalize()
    
    const clockCameraQuaternion = new THREE.Quaternion()
    clockCameraQuaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1).normalize(),
        clockToCameraDirection
    )
    clockGroup.quaternion.slerp(clockCameraQuaternion, 0.5)

    window.requestAnimationFrame(tick)
    renderer.render(scene, camera)
}
tick()