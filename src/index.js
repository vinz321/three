import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

let scene, camera, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const speed = 5;

// Initialize Scene

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky color

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.y=4;
    cube.receiveShadow=true;
    cube.castShadow=true;
    scene.add( cube );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
    dirLight.position.set( -5, 10, 0 );
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 100;
    dirLight.target.position.set(0,0,0)
    scene.add( dirLight );
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 5;

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow=true;
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 3 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );
    // Event Listeners for Movement
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    window.addEventListener('resize', onWindowResize);
    
    animate();
}

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

        velocity.x *= 0.9;
        velocity.z *= 0.9;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();