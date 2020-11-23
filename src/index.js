import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    Color,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Vector2,
    Vector3,
    FontLoader,
    TextBufferGeometry,
  } from "three";
  import * as Stats from 'stats.js';
  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";
  import * as THREE from 'three'; //REMOVE this in production
 import {lerp, params} from './helpers.js';
  import {createSculpture} from 'shader-park-core';

  const DEBUG = true; // Set to false in production
  if(DEBUG) {
      window.THREE = THREE;
  }
  let uniforms;
  let container, scene, camera, renderer, mesh, mesh2, mesh3, geometry, geometry2, geometry3, clock, repoData, material, time, record, pIndex;
  let globalString, globalSubtitle, globalURL;
  let stats;

  function init () {
    container = document.querySelector(".container");
    scene = new Scene();
    scene.background = new Color( 0x1B2735);
    clock = new Clock();
    time = 0;
    createRenderer();
    fetch('https://isaac-repo.glitch.me/pages', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
        repoData = data ;
        pIndex = repoData.findIndex(x => x["Project Name"] === "Isaac Sante")
        record = repoData[pIndex];
        globalString = record['Project Name'];
        globalSubtitle = record.Subtitle;
        globalURL = 'content.html?' + record.Slug;
        createGeometry(record);
    }).catch(e => console.error(e));
    createCamera();
    createLights();
    backgroundGeometry();
    if(DEBUG) {
      window.scene = scene;
      window.camera = camera;
      stats = Stats.default();
      document.body.appendChild( stats.dom );
  }
 }

  function createCamera() {
    const aspect = container.clientWidth / container.clientHeight;
    camera = new PerspectiveCamera(100, aspect, 0.1, 1000);
    camera.position.set(0, -0.5, 3);
}

function createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 10);
    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    scene.add(directionalLight, hemisphereLight);
}

function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true, alpha: true});
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
}

function createGeometry(record) {
   var loader = new FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
      geometry = new TextBufferGeometry(globalString, {
        font: font,
        size: 0.8,
        height: 0,
      } );
      geometry.center();

      geometry2 = new TextBufferGeometry(globalSubtitle, {
        font: font,
        size: 0.15,
        height: 0,
      } );
      geometry2.center();
      geometry2.translate( 0, -1, 0);
      uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: { x: null, y: null } },
        colorA: {type: 'vec3', value: new Color(0x74ebd5)},
        colorB: {type: 'vec3', value: new Color(0xACB6E5)}
      };
      material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });

      mesh = new Mesh(geometry, material);
      mesh2 = new Mesh(geometry2, material);
      scene.add(mesh);
      scene.add(mesh2);
    } );
  }

  let btnElement = document.getElementById('next');
  btnElement.addEventListener("click", () => {
      scene.remove( mesh );
      scene.remove( mesh2 );
      scene.remove( mesh3 );
      pIndex = (pIndex + 1) % repoData.length;
      record = repoData[pIndex];
      globalString = record['Project Name'];
      globalSubtitle = record.Subtitle;
      globalURL = 'content.html?' + record.Slug;
      createGeometry();
  });

    function uniformUpdateCallback() {
    return {
        time: time,
        _scale: params.sdfScale
    }
}

  // function backgroundGeometry() {
  //   let radius = params.boundingSphere;
  //   let spCode = `
  //   sphere(.9);
  //   `;
  //    mesh = createSculpture(spCode, () => ({
  //       'time': time
  //   }), {radius: 2});
  //   scene.add(mesh);
  // }

  let canvasElement = document.getElementById('container');
  if (canvasElement) {
  canvasElement.addEventListener("click", () => {
   window.location.href = globalURL;
  });
  }

// function resize () {
// //real code below
//   // camera.aspect = container.clientWidth / container.clientHeight;
//   // camera.position.z = innerWidth / 60
//   // camera.updateProjectionMatrix();
//   // renderer.setSize(container.clientWidth, container.clientHeight);
// }
// window.addEventListener("resize", resize, false);
  init();
  setTimeout(function() { 
    renderer.setAnimationLoop(() => {
      stats.begin();
      // animate();
      renderer.render(scene, camera);
      stats.end();
      mesh.material.uniforms.u_time.value = clock.getElapsedTime();
    });
   }, 1000);