import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshNormalMaterial,
    Mesh,
    Color,
    HemisphereLight,
    DirectionalLight,
    DirectionalLightHelper,
    ShaderMaterial,
    Clock,
    Raycaster,
    Vector3,
    FontLoader,
    TextGeometry,
    RawShaderMaterial,
    DoubleSide,
    Vector2,
  } from "three";
import {spCode} from './spCode.js';
import {sculptToThreeJSMesh} from 'shader-park-core'
import {Sculpture} from './Sculpture.js';
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import * as Stats from 'stats.js';
  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";
  import * as THREE from 'three'; //REMOVE this in production
  const DEBUG = true; // Set to false in production
  if(DEBUG) {
      window.THREE = THREE;
  }
  let container, scene, camera, renderer, controls, mesh, clock;
  let stats;
  let uniforms;
  let sculpture;

  function init () {
    container = document.querySelector(".container");
    scene = new Scene();
    clock = new Clock();
    createGeometry();
    createRenderer();
    createCamera();
    createLights();

    if(DEBUG) {
      window.scene = scene;
      window.camera = camera;
      window.controls = controls;
      stats = Stats.default();
      document.body.appendChild( stats.dom );
  }

    // sculpture = new Sculpture(spCode);
    // scene.add(sculpture.mesh);

    renderer.setAnimationLoop(() => {
      stats.begin();
      animate();
      renderer.render(scene, camera);
      stats.end();
  });

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
}

  function createGeometry() {
    var loader = new FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
      var geometry = new TextGeometry( 'Isaac Sante', {
        font: font,
        size: 1.2,
        height: 0,
      } );
      geometry.center();

      uniforms = {
        colorB: {type: 'vec3', value: new Color(0xACB6E5)},
        colorA: {type: 'vec3', value: new Color(0x74ebd5)}
      };
      const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });
      mesh = new Mesh( geometry, material );
    	scene.add( mesh );
    } );

    // sculpture = new Sculpture('sphere(0.2);');

    // let sculpMesh = sculptToThreeJSMesh('sphere(0.5);');
    // // console.log(mesh);
    // let uniformDescriptions = sculpMesh.material.uniformDescriptions;
    // let matUniforms = sculpMesh.material.uniforms;

    // let defaultUniforms = { 'sculptureCenter': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, 'mouse': 0};
    // let customUniforms = uniformDescriptions.filter(uniform => !(uniform.name in defaultUniforms));
    
    // //set the default value of the uniforms
    // customUniforms.forEach(uniform => matUniforms[uniform.name].value = uniform.value);

    // // default uniforms for the scupture
    // matUniforms['sculptureCenter'].value = new Vector3();
    // matUniforms['mouse'].value = new Vector3();
    // matUniforms['opacity'].value = 1.0;
    // matUniforms['time'].value = 0.0;
    // matUniforms['stepSize'].value = 0.85;
    
    // // console.log(sculpture);
    // scene.add(sculpture.mesh);

  }

 function animate(){
  renderer.render(scene, camera)
}
  init();