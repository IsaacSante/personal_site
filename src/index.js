import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshStandardMaterial,
    Mesh,
    Color,
    SphereBufferGeometry,
    BoxBufferGeometry,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Raycaster,
    Vector3,
  } from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import * as Stats from 'stats.js';
  import * as THREE from 'three'; //REMOVE this in production


  function init () {


    createCamera();
    createLights();
    createRenderer();
    createGeometry();
  }


//   function createCamera() {
//     const aspect = container.clientWidth / container.clientHeight;
//     camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
//     camera.position.set(100, 50, 200);

// }

function createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 10);
    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    scene.add(directionalLight, hemisphereLight);
}

function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
}

  function createGeometry() {


  }

  init();