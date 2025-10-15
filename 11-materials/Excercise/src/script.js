import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Pane } from 'tweakpane'

/**
 * Base
 */
// TweakPane
const pane = new Pane()
const selectMaterial = pane.addFolder({
    title: 'Select Material',
})
const basicTweak = pane.addFolder({
    title: 'MeshBasicMaterial',
})
const normalTweak = pane.addFolder({
    title: 'MeshNormalMaterial',
})
const matcapTweak = pane.addFolder({
    title: 'MeshMatcapMaterial',
})
const depthTweak = pane.addFolder({
    title: 'MeshDepthMaterial',
})
const lambertTweak = pane.addFolder({
    title: 'MeshLambertMaterial',
})
const phongTweak = pane.addFolder({
    title: 'MeshLambertMaterial',
})
const toonTweak = pane.addFolder({
    title: 'MeshToonMaterial',
})
const standardTweak = pane.addFolder({
    title: 'MeshStandardMaterial',
})
const physicalTweak = pane.addFolder({
    title: 'MeshPhysicalMaterial',
})
let materialTweakArray = [
    basicTweak,
    normalTweak,
    matcapTweak,
    depthTweak,
    lambertTweak,
    phongTweak,
    toonTweak,
    standardTweak,
]
for (let i = 0; i < materialTweakArray.length; i++) {
    materialTweakArray[i].hidden = true
}
// const materialFolderObject = {
//     meshBasicMaterialfolder: pane.addFolder({
//         title: 'meshBasicMaterial',
//     }),
//     meshNormalMaterialfolder: pane.addFolder({
//         title: 'meshNormalMaterial',
//     }),
//     meshMatcapMaterialfolder: pane.addFolder({
//         title: 'meshMatcapMaterial',
//     }),
//     meshDepthMaterialfolder: pane.addFolder({
//         title: 'meshDepthMaterial',
//     }),
//     meshLambertMaterialfolder: pane.addFolder({
//         title: 'meshLambertMaterial',
//     }),
//     meshPhongMaterialfolder: pane.addFolder({
//         title: 'meshPhongMaterial',
//     }),
//     meshToonMaterialfolder: pane.addFolder({
//         title: 'meshToonMaterial',
//     }),
//     meshStandardMaterialfolder: pane.addFolder({
//         title: 'meshStandardMaterial',
//     }),
// }
// const materialFolderArray = [
//     materialFolderObject.meshBasicMaterialfolder,
//     materialFolderObject.meshNormalMaterialfolder,
//     materialFolderObject.meshMatcapMaterialfolder,
//     materialFolderObject.meshDepthMaterialfolder,
//     materialFolderObject.meshLambertMaterialfolder,
//     materialFolderObject.meshPhongMaterialfolder,
//     materialFolderObject.meshToonMaterialfolder,
//     materialFolderObject.meshStandardMaterialfolder
// ]
// const hideMaterialFolders = () => {
//     for(let i = 0; i < materialFolderArray.length; i++) {
//     materialFolderArray[i].hidden = true
//     }
// }
// hideMaterialFolders()

const parameters = {}
parameters.color = '#ffffff'
parameters.selectMaterial = ''
parameters.material = {
    meshBasicMaterial: new THREE.MeshBasicMaterial(),
    meshNormalMaterial: new THREE.MeshNormalMaterial(),
    meshMatcapMaterial: new THREE.MeshMatcapMaterial(),
    meshDepthMaterial: new THREE.MeshDepthMaterial(),
    meshLambertMaterial: new THREE.MeshLambertMaterial(),
    meshPhongMaterial: new THREE.MeshPhongMaterial(),
    meshToonMaterial: new THREE.MeshToonMaterial(),
    meshStandardMaterial: new THREE.MeshStandardMaterial(),
    meshPhysicalMaterial: new THREE.MeshPhysicalMaterial(),
}
parameters.specularColor = 0x1188ff
parameters.selectedGradient = ''
parameters.sheenColor = '#ffffff'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // environmentMap.mapping = THREE.EquirectangularRefractionMapping

    scene.environment = environmentMap
    scene.background = environmentMap
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(
    './textures/door/ambientOcclusion.jpg'
)
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture1 = textureLoader.load('./textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('./textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('./textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('./textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('./textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('./textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('./textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('./textures/matcaps/8.png')

const gradientTexture1 = textureLoader.load('./textures/gradients/3.jpg')
const gradientTexture2 = textureLoader.load('./textures/gradients/5.jpg')

gradientTexture1.minFilter = THREE.NearestFilter
gradientTexture2.minFilter = THREE.NearestFilter

gradientTexture1.magFilter = THREE.NearestFilter
gradientTexture2.magFilter = THREE.NearestFilter

gradientTexture1.generateMipmaps = false
gradientTexture2.generateMipmaps = false

doorColorTexture.colorSpace = THREE.SRGBColorSpace
let matcaps = [
    matcapTexture1,
    matcapTexture2,
    matcapTexture3,
    matcapTexture4,
    matcapTexture5,
    matcapTexture6,
    matcapTexture7,
    matcapTexture8,
]
for (let i = 0; i < matcaps.length; i++) {
    matcaps[i].colorSpace = THREE.SRGBColorSpace
}

/**
 * Body
 */
let sceneChildren = []
let material
// MeshBasicMaterial
// const material = parameters.material.meshBasicMaterial
// material.side = THREE.DoubleSide
// material.map = doorColorTexture
// material.color.set('red')
// material.color = new THREE.Color('red')
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = doorAlphaTexture

parameters.material.meshBasicMaterial.map = ''
basicTweak
    .addBinding(parameters.material.meshBasicMaterial, 'map', {
        options: {
            none: '',
            colorMap: doorColorTexture,
            alphaMap: doorAlphaTexture,
            aoMap: doorAmbientOcclusionTexture,
            heightMap: doorHeightTexture,
            nomralMap: doorNormalTexture,
            metalnessMap: doorMetalnessTexture,
            roughnessMap: doorRoughnessTexture,
            matcapMap: matcapTexture3,
            gradientMap: gradientTexture1,
        },
    })
    .on('change', () => {
        parameters.material.meshBasicMaterial.needsUpdate = true
    })
basicTweak.addBinding(parameters.material.meshBasicMaterial, 'side', {
    options: {
        frontSide: THREE.FrontSide,
        backSide: THREE.BackSide,
        doubleSide: THREE.DoubleSide,
    },
})
basicTweak
    .addBinding(parameters, 'color', {
        view: 'color',
        picker: 'inline',
    })
    .on('change', () => {
        parameters.material.meshBasicMaterial.color.set(parameters.color)
    })
basicTweak.addBinding(parameters.material.meshBasicMaterial, 'wireframe')
parameters.material.meshBasicMaterial.transparent = true
basicTweak.addBinding(parameters.material.meshBasicMaterial, 'transparent')
basicTweak.addBinding(parameters.material.meshBasicMaterial, 'opacity', {
    min: 0,
    max: 1,
    step: 0.01,
})

// MeshNomralMaterial
// const material = parameters.material.meshNormalMaterial
// parameters.material.meshNormalMaterial.flatShading = true

// // MeshMatcapMaterial
// const material = parameters.material.meshMatcapMaterial
// parameters.material.meshMatcapMaterial.matcap = matcapTexture

parameters.material.meshMatcapMaterial.matcap = ''
// console.log(parameters.material.meshMatcapMaterial.matcap)
matcapTweak
    .addBinding(parameters.material.meshMatcapMaterial, 'matcap', {
        options: {
            num1: matcapTexture1,
            num2: matcapTexture2,
            num3: matcapTexture3,
            num4: matcapTexture4,
            num5: matcapTexture5,
            num6: matcapTexture6,
            num7: matcapTexture7,
            num8: matcapTexture8,
        },
    })
    .on('change', () => {
        parameters.material.meshMatcapMaterial.needsUpdate = true
    })
// // MeshDepthMaterial
// const material = parameters.material.meshDepthMaterial

// // MeshLambertMaterial
// const material = parameters.material.meshLambertMaterial

// // MeshPhongMaterial
// const material = parameters.material.meshPhongMaterial
// material.shininess = 100
// material.specular = new THREE.Color('0x1188ff')
phongTweak.addBinding(parameters.material.meshPhongMaterial, 'shininess', {
    min: 0,
    max: 1000,
    step: 0.1,
})
parameters.material.meshPhongMaterial.specular.set(parameters.specularColor)
phongTweak
    .addBinding(parameters, 'specularColor', {
        view: 'color',
        picker: 'inline',
    })
    .on('change', () => {
        parameters.material.meshPhongMaterial.specular.set(
            parameters.specularColor
        )
    })
phongTweak
    .addBinding(parameters, 'color', {
        view: 'color',
        picker: 'inline',
    })
    .on('change', () => {
        parameters.material.meshPhongMaterial.color.set(parameters.color)
    })

// // MeshToonMaterial
// const material = parameters.material.meshToonMaterial
// material.gradientMap = gradientTexture

parameters.material.meshToonMaterial.gradientMap = null

// toonTweak
//     .addBinding(parameters.material.meshToonMaterial, 'gradientMap', {
//         options: {
//             none: null,
//             num1: gradientTexture1,
//             num2: gradientTexture2,
//         },
//     })
//     .on('change', () => {
//         parameters.material.meshToonMaterial.needsUpdate = true
//     })

// parameters.material.meshToonMaterial.gradientMap = null
toonTweak
    .addBinding(parameters, 'selectedGradient', {
        options: {
            none: '',
            num1: gradientTexture1,
            num2: gradientTexture2,
        },
    })
    .on('change', () => {
        if (parameters.selectedGradient === '') {
            parameters.material.meshToonMaterial.gradientMap = null
            parameters.material.meshToonMaterial.needsUpdate = true
        } else {
            parameters.material.meshToonMaterial.gradientMap =
                parameters.selectedGradient
            parameters.material.meshToonMaterial.needsUpdate = true
        }
    })

// MeshStandardMaterial
// material = parameters.material.meshStandardMaterial
// material.metalness = 1
// material.roughness = 1
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.roughnessMap = doorRoughnessTexture
// material.side = THREE.DoubleSide

standardTweak.addBinding(
    parameters.material.meshStandardMaterial,
    'metalness',
    {
        min: 0,
        max: 1,
        step: 0.0001,
    }
)
standardTweak.addBinding(
    parameters.material.meshStandardMaterial,
    'roughness',
    {
        min: 0,
        max: 1,
        step: 0.0001,
    }
)

// MeshPhysicalMaterial
material = parameters.material.meshPhysicalMaterial
material.metalness = 0
material.roughness = 0
// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.5, 0.5)
// material.roughnessMap = doorRoughnessTexture
// material.side = THREE.DoubleSide

// // Clearcoat
// material.clearcoat = 1
// material.clearcoatRoughness = 0

// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'clearcoat', {
//     min: 0,
//     max: 1,
//     step: 0.0001
// })
// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'clearcoatRoughness', {
//     min: 0,
//     max: 1,
//     step: 0.0001
// })

// // Sheen
// material.sheen = 1
// material.sheenRoughness = 0.25
// material.sheenColor.set(parameters.sheenColor)


// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'sheen', {
//     min: 0,
//     max: 1,
//     step: 0.0001
// })
// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'sheenRoughness', {
//     min: 0,
//     max: 1,
//     step: 0.0001
// })
// physicalTweak.addBinding(parameters, 'sheenColor', {
//     view: 'color',
//     picker: 'inline'
// }).on('change', () => {
//     parameters.material.meshPhysicalMaterial.sheenColor.set(parameters.sheenColor)
// })

// // Iridescence
// material.iridescence = 1
// material.iridescenceIOR = 1
// material.iridescenceThicknessRange = [100, 800]

// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'iridescence', {
//     min: 0,
//     max: 1,
//     step: 0.0001
// })
// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'iridescenceIOR', {
//     min: 0,
//     max: 2.333,
//     step: 0.0001
// })
// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial.iridescenceThicknessRange, '0', {
//     min: 1,
//     max: 1000,
//     step: 1
// })
// physicalTweak.addBinding(parameters.material.meshPhysicalMaterial.iridescenceThicknessRange, '1', {
//     min: 1,
//     max: 1000,
//     step: 1
// })

// Transmission
material.transmission = 1
material.ior = 1.5
material.thickness = 1

physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'transmission', {
    min: 0,
    max: 1,
    step: 0.0001
})
physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'ior', {
    min: 0,
    max: 1.5,
    step: 0.0001
})
physicalTweak.addBinding(parameters.material.meshPhysicalMaterial, 'thickness', {
    min: 0,
    max: 1,
    step: 0.0001
})



physicalTweak.addBinding(
    parameters.material.meshPhysicalMaterial,
    'metalness',
    {
        min: 0,
        max: 1,
        step: 0.0001,
    }
)
physicalTweak.addBinding(
    parameters.material.meshPhysicalMaterial,
    'roughness',
    {
        min: 0,
        max: 1,
        step: 0.0001,
    }
)


if (material.isMeshBasicMaterial) {
    basicTweak.hidden = false
} else basicTweak.hidden = true
if (material.isMeshNormalMaterial) {
    normalTweak.hidden = false
} else normalTweak.hidden = true
if (material.isMeshMatcapMaterial) {
    matcapTweak.hidden = false
} else matcapTweak.hidden = true
if (material.isMeshDepthMaterial) {
    depthTweak.hidden = false
} else depthTweak.hidden = true
if (material.isMeshLambertMaterial) {
    lambertTweak.hidden = false
} else lambertTweak.hidden = true
if (material.isMeshPhongMaterial) {
    phongTweak.hidden = false
} else phongTweak.hidden = true
if (material.isMeshToonMaterial) {
    toonTweak.hidden = false
} else toonTweak.hidden = true
if (material.isMeshStandardMaterial && !material.isMeshPhysicalMaterial) {
    standardTweak.hidden = false
} else standardTweak.hidden = true
if (material.isMeshPhysicalMaterial && material.isMeshStandardMaterial) {
    physicalTweak.hidden = false
} else physicalTweak.hidden = true

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 100, 100), material)
sphere.position.x = -3

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5, 100, 100),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.5, 0.2, 100, 100),
    material
)
torus.position.x = 3

scene.add(sphere, plane, torus)
for (let i = 0; i < scene.children.length; i++) {
    if (scene.children[i].isMesh) {
        // console.log(scene.children[i])
        sceneChildren.push(scene.children[i])
    }
}
normalTweak
    .addBinding(parameters.material.meshNormalMaterial, 'flatShading')
    .on('change', (event) => {
        for (let i = 0; i < sceneChildren.length; i++) {
            sceneChildren[i].geometry.deleteAttribute('normal')
            sceneChildren[i].geometry.computeVertexNormals()
            sceneChildren[i].material.needsUpdate = true
        }
    })

selectMaterial
    .addBinding(parameters, 'selectMaterial', {
        options: parameters.material,
    })
    .on('change', (event) => {
        for (let i = 0; i < sceneChildren.length; i++) {
            sceneChildren[i].material = event.value
        }
        if (event.value.isMeshBasicMaterial) {
            basicTweak.hidden = false
        } else basicTweak.hidden = true
        if (event.value.isMeshNormalMaterial) {
            normalTweak.hidden = false
        } else normalTweak.hidden = true
        if (event.value.isMeshMatcapMaterial) {
            matcapTweak.hidden = false
        } else matcapTweak.hidden = true
        if (event.value.isMeshDepthMaterial) {
            depthTweak.hidden = false
        } else depthTweak.hidden = true
        if (event.value.isMeshLambertMaterial) {
            lambertTweak.hidden = false
        } else lambertTweak.hidden = true
        if (event.value.isMeshPhongMaterial) {
            phongTweak.hidden = false
        } else phongTweak.hidden = true
        if (event.value.isMeshToonMaterial) {
            toonTweak.hidden = false
        } else toonTweak.hidden = true
        if (
            event.value.isMeshStandardMaterial &&
            !event.value.isMeshPhysicalMaterial
        ) {
            standardTweak.hidden = false
        } else standardTweak.hidden = true
        if (
            event.value.isMeshPhysicalMaterial &&
            event.value.isMeshStandardMaterial
        ) {
            physicalTweak.hidden = false
        } else physicalTweak.hidden = true
    })

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('white', 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight('white', 30)
pointLight.position.set(2.0, 3.0, 4.0)
scene.add(pointLight)

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

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen){
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
// renderer.setClearColor('darkorange')

/**
 * Animate
 */
const xQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(1, 0, 0),
    0.003
)
const yQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, -1, 0),
    0.003
)
const negativeXYQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(-1, 1, 0),
    0.003
)
const zQuaternion = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    0.003
)

const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    sphere.quaternion.multiply(xQuaternion)
    torus.quaternion.multiply(yQuaternion)
    plane.quaternion
        .multiply(negativeXYQuaternion)
        .multiply(zQuaternion)
        .multiply(yQuaternion)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
