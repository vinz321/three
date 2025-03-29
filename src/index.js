import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as GAMEOBJ from './gameobject.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 5;
const clock = new THREE.Clock();
let delta=0.1
// Initialize Scene

scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky color

const world= new CANNON.World();
world.gravity.set(0, -9.82, 0); // Set gravity
world.broadphase = new CANNON.NaiveBroadphase()
world.solver.iterations = 10
world.allowSleep = true

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );

const cube= new GAMEOBJ.GameObject("cube", geometry, material, scene, world, 
    new THREE.Vector3(4, 3, -5), 
    new THREE.Quaternion(), 
    new THREE.Vector3(1, 1, 1), 
    {mass:1},
    new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
cube.instantiate();

const objects = [];

const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 0, 10, 0 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = - 10;
dirLight.shadow.camera.left = - 10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 200;
dirLight.shadow.normalBias=0.001;
dirLight.target.position.set(0,0,0)
scene.add( dirLight );

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;

renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.id='canvas'
document.body.appendChild(renderer.domElement);

// Pointer Lock Controls
controls = new PointerLockControls(camera, document.body);
controls.pointerSpeed=5
document.getElementById("instructions").addEventListener('click', () => {
    controls.lock();
});

controls.addEventListener('lock', () => {
    document.getElementById("instructions").style.display = 'none';
});

controls.addEventListener('unlock', () => {
    document.getElementById("instructions").style.display = 'flex';
});

scene.add(controls.getObject());

// Ground
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22, side: THREE.DoubleSide });
const ground = new GAMEOBJ.GameObject("ground", groundGeometry, groundMaterial, scene, world, 
                            new THREE.Vector3(0, 0, 0), 
                            new THREE.Quaternion().setFromEuler(new THREE.Euler( - Math.PI / 2, 0, 0) ),
                            new THREE.Vector3(1, 1, 1), 
                            {mass:0},
                        new CANNON.Plane());
ground.instantiate();
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
// Event Listeners for Movement
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

window.addEventListener('resize', onWindowResize);

const normalMaterial = new THREE.MeshNormalMaterial()
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, material)
cubeMesh.position.x = -3
cubeMesh.position.z = -3
cubeMesh.position.y = 3
cubeMesh.castShadow = true
cubeMesh.receiveShadow = true
// scene.add(cubeMesh)s
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const cubeBody = new CANNON.Body({ mass: 0  })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
// world.addBody(cubeBody)s



function onKeyDown(event) {
    console.log(event.code)
    switch (event.code) {
        case 'KeyW': moveForward = true; break;
        case 'KeyS': moveBackward = true; break;
        case 'KeyA': moveLeft = true; break;
        case 'KeyD': moveRight = true; break;
        case 'KeyQ': moveUp = true; break;
        case 'KeyE': moveDown = true; break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'KeyW': moveForward = false; break;
        case 'KeyS': moveBackward = false; break;
        case 'KeyA': moveLeft = false; break;
        case 'KeyD': moveRight = false; break;
        case 'KeyQ': moveUp = false; break;
        case 'KeyE': moveDown = false; break;
    }
}



function animate() {
    requestAnimationFrame(animate);

    delta = Math.min(clock.getDelta(), 0.1)
    world.step(delta)
    if (controls.isLocked) {
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveUp) - Number(moveDown);
        direction.normalize();

        velocity.z -= direction.z * speed * 0.1;
        velocity.x -= direction.x * speed * 0.1;
        velocity.y -= direction.y * speed * 0.1;

        controls.moveRight(-velocity.x * 0.1);
        controls.moveForward(-velocity.z * 0.1);

        camera.position.y += velocity.y * 0.1;

        velocity.y *= 0.9;
        velocity.x *= 0.9;
        velocity.z *= 0.9;
    }

    cube.update();
    ground.update();

    cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
    cubeMesh.quaternion.set(cubeBody.quaternion.x, cubeBody.quaternion.y, cubeBody.quaternion.z, cubeBody.quaternion.w)
  

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    
}

animate();