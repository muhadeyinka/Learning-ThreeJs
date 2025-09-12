import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 13;
camera.position.y = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);

/**
 * Object
 */
// Quaternion
const quaternionX = new THREE.Quaternion();
quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);

// Island Geometry
const islandGeometry = new THREE.ConeGeometry(1, 1);

// Islands
const leftIsland = new THREE.Mesh(
  islandGeometry,
  new THREE.MeshBasicMaterial({ color: "cyan" })
);
leftIsland.scale.set(2.5, 3, 3);
leftIsland.position.x = -7;
leftIsland.rotation.x = Math.PI;
// leftIsland.visible = false

const middleIsland = new THREE.Mesh(
  islandGeometry,
  new THREE.MeshBasicMaterial({ color: "purple" })
);
middleIsland.scale.set(2.5, 5, 2.5);
middleIsland.rotation.x = Math.PI;

const rightIsland = new THREE.Mesh(
  islandGeometry,
  new THREE.MeshBasicMaterial({ color: "brown" })
);
rightIsland.scale.set(3, 3.5, 2);
rightIsland.rotation.x = Math.PI;

scene.add(leftIsland, middleIsland, rightIsland);

// Left Island Project (Orbit Simulator)
const startPlanetGroup = new THREE.Group();
const starPlanetGeometry = new THREE.IcosahedronGeometry(0.3, 5);

// Sun
const sun = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "yellow" })
);
sun.scale.set(0.5, 0.5, 0.5);

// Planet0
const planet0 = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "white" })
);
planet0.scale.set(0.3, 0.3, 0.3);

// Planet0 Moon
const planet0Moon = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "red" })
);
planet0Moon.scale.set(0.15, 0.15, 0.15);

// Planet0 Moon LRO
const planet0MoonLro = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "orange" })
);
planet0MoonLro.scale.set(0.5, 0.5, 0.5);
planet0Moon.add(planet0MoonLro);

// Planet1
const planet1 = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "blue" })
);
planet1.scale.set(0.25, 0.25, 0.25);

// Planet1 Moon
const planet1Moon = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "green" })
);
planet1Moon.scale.set(0.15, 0.15, 0.15);

// Planet1 Moon LRO
const planet1MoonLro = new THREE.Mesh(
  starPlanetGeometry,
  new THREE.MeshBasicMaterial({ color: "gray" })
);
planet1MoonLro.scale.set(0.5, 0.5, 0.5);
planet1Moon.add(planet1MoonLro);

startPlanetGroup.add(sun, planet0, planet0Moon, planet1, planet1Moon);
scene.add(startPlanetGroup);

// Middle Island Project (Breathing Cube)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

const breathingCube = new THREE.Mesh(
  cubeGeometry,
  new THREE.MeshBasicMaterial({ color: "#EAE2B7" })
);
breathingCube.scale.set(0.5, 0.1, 0.5);
breathingCube.position.y -= 0.9;
middleIsland.add(breathingCube);

gsap.to(breathingCube.scale, {
  delay: 1,
  duration: 3,
  x: 1,
  repeat: -1,
  repeatDelay: 3.85,
});
gsap.to(breathingCube.rotation, {
  duration: 0.85,
  x: Math.PI * 2,
  delay: 3,
  repeat: -1,
  repeatDelay: 6,
});

gsap.to(breathingCube.scale, {
  delay: 3.85,
  duration: 3,
  x: 0.5,
  repeat: -1,
  repeatDelay: 3.85,
});
gsap.to(breathingCube.rotation, {
  duration: 1,
  y: Math.PI,
  repeat: -1,
  repeatDelay: 6,
});

// Right Island Project (Wave Pool)
const waveGroup = new THREE.Group();
const waveGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.1);
let cube0 = null;
let cube1 = null;
let cube2 = null;
let cube3 = null;
let cube4 = null;

const multipleCube = (zPos) => {
  cube0 = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({}));
  cube0.position.x = -0.3;
  cube0.position.z = zPos;

  cube1 = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({}));
  cube1.position.x = -0.15;
  cube1.position.z = zPos;

  cube2 = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({}));
  cube2.position.z = zPos;

  cube3 = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({}));
  cube3.position.x = 0.15;
  cube3.position.z = zPos;

  cube4 = new THREE.Mesh(waveGeometry, new THREE.MeshBasicMaterial({}));
  cube4.position.x = 0.3;
  cube4.position.z = zPos;

  waveGroup.add(cube0, cube1, cube2, cube3, cube4);
  rightIsland.add(waveGroup);

  // gsap.to(cube0.position, {
  //   duration: 1,
  //   y: Math.sin(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 5,
  // });
  // gsap.to(cube0.position, {
  //   duration: 5,
  //   delay: 4,
  //   y: Math.cos(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // // gsap.to(cube0.position, {duration: 3, delay: 6, y:  Math.sin(cube0.position.x), repeat: -1, repeatDelay:6})

  // gsap.to(cube1.position, {
  //   duration: 2,
  //   y: Math.sin(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 4,
  // });
  // gsap.to(cube1.position, {
  //   duration: 4,
  //   delay: 5,
  //   y: Math.cos(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // // gsap.to(cube1.position, {duration: 3, delay: 6, y:  Math.sin(cube0.position.x), repeat: -1, repeatDelay:6})

  // gsap.to(cube2.position, {
  //   duration: 3,
  //   y: Math.sin(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // gsap.to(cube2.position, {
  //   duration: 3,
  //   delay: 6,
  //   y: Math.cos(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // // gsap.to(cube2.position, {duration: 3, delay: 6, y:  Math.sin(cube0.position.x), repeat: -1, repeatDelay:6})

  // gsap.to(cube3.position, {
  //   duration: 4,
  //   y: Math.sin(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 2,
  // });
  // gsap.to(cube3.position, {
  //   duration: 2,
  //   delay: 7,
  //   y: Math.cos(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // // gsap.to(cube3.position, {duration: 3, delay: 6, y:  Math.sin(cube0.position.x), repeat: -1, repeatDelay:6})

  // gsap.to(cube4.position, {
  //   duration: 5,
  //   y: Math.sin(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 1,
  // });
  // gsap.to(cube4.position, {
  //   duration: 1,
  //   delay: 8,
  //   y: Math.cos(cube0.position.x),
  //   // repeat: -1,
  //   // repeatDelay: 3,
  // });
  // // gsap.to(cube4.position, {duration: 3, delay: 6, y:  Math.sin(cube0.position.x), repeat: -1, repeatDelay:6})
};

waveGroup.position.y -= 0.9;
multipleCube(0.3);
multipleCube(0.15);
multipleCube(0);
multipleCube(-0.15);
multipleCube(-0.3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

// Animation
let time = Date.now();
const clock = new THREE.Clock();

const tick = () => {
  // Delta Time Calculation
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Island Animation
  leftIsland.position.y = Math.sin(elapsedTime * 0.5);
  middleIsland.position.y = Math.cos(elapsedTime * 0.9);
  rightIsland.position.x = Math.cos(elapsedTime) + 5;
  rightIsland.position.z = Math.sin(elapsedTime) + 5;

  // Orbit Simulator Animation
  startPlanetGroup.position.copy(leftIsland.position);
  startPlanetGroup.position.y += 3;

  planet0.position.x = Math.cos(elapsedTime) * 1.4;
  planet0.position.z = Math.sin(elapsedTime) * 1.4;
  planet0Moon.position.copy(planet0.position);
  planet0Moon.position.y += Math.sin(elapsedTime * 3) * 0.5;
  planet0Moon.position.z += Math.cos(elapsedTime * 3) * 0.5;
  planet0MoonLro.position.x = Math.cos(elapsedTime * 6) * 0.95;
  planet0MoonLro.position.z = Math.sin(elapsedTime * 6) * 0.95;

  planet1.position.x = Math.cos(elapsedTime) * 0.7;
  planet1.position.y = Math.sin(elapsedTime) * 0.7;
  planet1Moon.position.copy(planet1.position);
  planet1Moon.position.x += Math.cos(elapsedTime * 5) * 0.2;
  planet1Moon.position.z += Math.sin(elapsedTime * 5) * 0.2;
  planet1MoonLro.position.y = Math.sin(elapsedTime * 6);
  planet1MoonLro.position.z = Math.cos(elapsedTime * 6);

  // Breathable Cube Animation
  const hue = (elapsedTime * 0.1) % 1;
  breathingCube.material.color.setHSL(hue, 1, 0.5);

  cube0.position.y = Math.sin(elapsedTime * 0.90) * 0.15
  cube1.position.y = Math.sin(elapsedTime * 0.92) * 0.15
  cube2.position.y = Math.sin(elapsedTime * 0.95) * 0.15
  cube3.position.y = Math.sin(elapsedTime * 0.97) * 0.15
  cube4.position.y = Math.sin(elapsedTime * 1.00) * 0.15

  // console.log(cube0)

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
