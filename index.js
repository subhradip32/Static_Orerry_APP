// import * as THREE from "three";
// import {OrbitControls} from "jsm/controls/OrbitControls.js";

// //main renderer
// const canvas = document.getElementById("Main_3D");
// const main_renderer = new THREE.WebGLRenderer({canvas, antialias: true});
// main_renderer.setSize(window.innerWidth, window.innerHeight);

// //scene
// const main_scene = new THREE.Scene(); 

// //Main camera 
// const fov = 75;
// let aspect = window.innerWidth / window.innerHeight;
// const near = 0.01, far = 1000; 
// const cam = new THREE.PerspectiveCamera(fov,aspect,near, far);
// cam.position.z = 2;

// // adding Planets 
// const earth_group = new THREE.Group();
// earth_group.rotation.z = -23.4 * Math.PI / 180;
// main_scene.add(earth_group); 
// const loader = new THREE.TextureLoader(); 
// // main shapes
// const earth = new THREE.IcosahedronGeometry(1,12);
// const earth_mat = new THREE.MeshPhongMaterial({
//     map: loader.load("../Project02/earthmap1k.jpg"),
//     specularMap: loader.load("../Project02/earthspec1k.jpg"),
//     bumpMap: loader.load("../Project02/earthbump1k.jpg"),
//     bumpScale: 0.04,
// })
// const earth_mesh = new THREE.Mesh(earth, earth_mat); 
// earth_group.add(earth_mesh);

// // adding the night side
// const earth_night_mat = new THREE.MeshBasicMaterial({
//     map: loader.load("../Project02/earthlights1k.jpg"),
//     blending: THREE.AdditiveBlending

// })
// const earth_night_mesh = new THREE.Mesh(earth, earth_night_mat);
// earth_group.add(earth_night_mesh); 

// const cloudsMat = new THREE.MeshStandardMaterial({
//     map: loader.load("../Project02/earthcloudmap.jpg"),
//     transparent: true,
//     opacity: 0.6,
//     blending: THREE.AdditiveBlending,
//     alphaTest: 0.3,
//   });
// const cloudsMesh = new THREE.Mesh(earth, cloudsMat);
// cloudsMesh.scale.setScalar(1.003);
// earth_group.add(cloudsMesh);

// // const fresnelMat = getFresnelMat();
// // const glowMesh = new THREE.Mesh(earth, fresnelMat);
// // glowMesh.scale.setScalar(1.01);
// // earth.add(glowMesh);



// const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
// sunLight.position.set(-2, 0.5, 1.5);
// main_scene.add(sunLight);


// function animate(){
//     requestAnimationFrame(animate); 
//     main_renderer.render(main_scene, cam);
    
//     //adding the roatation to the earth 
//     earth_mesh.rotation.y += 0.0002;
//     earth_night_mesh.rotation.y += 0.0002;
//     cloudsMesh.rotation.y += 0.00025; 
// }
// animate(); 

// window.addEventListener("resize",()=>{
//     cam.aspect = window.innerWidth / window.innerHeight;
//     cam.updateProjectionMatrix();
//     main_renderer.setSize(window.innerWidth, window.innerHeight);
// })

// const controls = new OrbitControls(cam, main_renderer   .domElement);


import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

// Main renderer
const canvas = document.getElementById("Main_3D");
const main_renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
main_renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const main_scene = new THREE.Scene();

// Main camera
const fov = 75;
let aspect = window.innerWidth / window.innerHeight;
const near = 0.01, far = 1000;
const cam = new THREE.PerspectiveCamera(fov, aspect, near, far);
cam.position.set(0, 5, 40);

// Controls
const controls = new OrbitControls(cam, main_renderer.domElement);

// Light (Sun as the source of light)
const sunLight = new THREE.PointLight(0xffffff, 2, 1000);  // Intensity, Distance
main_scene.add(sunLight);

// Texture loader (commented out)
// const loader = new THREE.TextureLoader();

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffff00, // Yellow color for the sun
    emissive: 0xffff00,
    emissiveIntensity: 1 
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
main_scene.add(sunMesh);

// Make the PointLight follow the sun
sunLight.position.copy(sunMesh.position);

// Function to create a planet with color material
function createPlanet(size, color, distance, orbitSpeed) {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ color: color });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);

    const planetGroup = new THREE.Group();
    planetGroup.add(planetMesh);
    planetMesh.position.x = distance;

    // Create orbit trail
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitVertices = [];
    const orbitRadius = distance;
    const segments = 128; // Number of points in the orbit path
    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * 2 * Math.PI;
        orbitVertices.push(orbitRadius * Math.cos(angle), 0, orbitRadius * Math.sin(angle));
    }
    orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitVertices, 3));

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff,opacity: 0.6 });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    main_scene.add(orbitLine);

    return { mesh: planetMesh, group: planetGroup, orbitSpeed: orbitSpeed };
}

// Planets created with color instead of textures
const planets = [
    createPlanet(0.5, 0xaaaaaa, 5, 0.004),  // Mercury - gray
    createPlanet(0.9, 0xffa500, 8, 0.003), // Venus - orange
    createPlanet(1, 0x0000ff, 11, 0.002),  // Earth - blue
    createPlanet(0.8, 0xff4500, 14, 0.0018), // Mars - red
    createPlanet(2, 0xffd700, 20, 0.001),  // Jupiter - golden
    createPlanet(1.5, 0xffff33, 25, 0.0009), // Saturn - pale yellow
    createPlanet(1.2, 0x40e0d0, 30, 0.0007), // Uranus - turquoise
    createPlanet(1.1, 0x000080, 35, 0.0005)  // Neptune - navy blue
];

// Adding planets and their orbits to the scene
planets.forEach((planet) => {
    main_scene.add(planet.group);
});

// Ambient light to slightly illuminate the whole scene
const ambientLight = new THREE.AmbientLight(0x404040,16);
main_scene.add(ambientLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotating the sun
    sunMesh.rotation.y += 0.002;

    // Planetary orbits
    planets.forEach((planet) => {
        planet.group.rotation.y += planet.orbitSpeed;
        planet.mesh.rotation.y += 0.005; // Planet's self-rotation
    });

    main_renderer.render(main_scene, cam);
}

animate();

// Resizing handler
window.addEventListener("resize", () => {
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();
    main_renderer.setSize(window.innerWidth, window.innerHeight);
});
