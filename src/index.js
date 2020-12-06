import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    Mesh,
    Color,
    HemisphereLight,
    DirectionalLight,
    ShaderMaterial,
    Clock,
    FontLoader,
    TextBufferGeometry,
    PlaneGeometry,
    TextureLoader,
    MeshBasicMaterial,
    SphereBufferGeometry,
    MeshLambertMaterial,
    BoxGeometry,
  } from "three";
  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";
  import * as THREE from 'three'; //REMOVE this in production

  const DEBUG = true; // Set to false in production
  if(DEBUG) {
      window.THREE = THREE;
  }
  let uniforms;
  let container, scene, camera, renderer, mesh, mesh2, mesh3, geometry, geometry2, geometry3, geoMask1, maskMat,maskFinal, clock, repoData, material, material2,  time, record, pIndex;
  let globalString, globalSubtitle, globalURL, globalImg;
  let textSize1, textSize2;
  let myCoolBool = false;

  function init () {
    container = document.querySelector(".container");
    scene = new Scene();
    clock = new Clock();
      const spinner = document.getElementById("spinner");
      function hideSpinner() {
      spinner.classList.add("hide");
   }
    time = 0;
    textSize1 = 0.75;
    textSize2 = 0.15;
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
        globalURL = '#'
        createGeometry(record);
    }).catch(e => console.error(e));
    hideSpinner();
    createCamera();
    createLights();
    // createDance();
    if(DEBUG) {
      window.scene = scene;
      window.camera = camera;
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
        size: 0.7,
        height: 0,
      } );
      geometry.center();
      geometry.translate( 0, 1, -0.3);

      geometry2 = new TextBufferGeometry(globalSubtitle, {
        font: font,
        size: 0.16,
        height: 0,
      } );
      geometry2.center();
      geometry2.translate( 0, 0, -0.3);
      uniforms = {
        uTime: { value: 0.0 },
        u_resolution: { value: { x: null, y: null } },
        colorA: {type: 'vec3', value: new Color(0x74ebd5)},
        colorB: {type: 'vec3', value: new Color(0xACB6E5)}
      };
      material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        opacity: 0.5,
         transparent: true,
      });

      maskMat = new MeshBasicMaterial({color: 0x687681,  transparent: true, opacity: 0.1,})
      mesh = new Mesh(geometry, material);
      mesh2 = new Mesh(geometry2, material);
      maskFinal = new Mesh(geoMask1, maskMat)
      scene.add(mesh);
      scene.add(mesh2);
      myCoolBool = true;
    } );
  }


function createDance() {
const geometryBall = new BoxGeometry( 1, 1, 1 );
geometryBall.center();
geometryBall.translate( 0, 1, -2);
const material1 = new MeshLambertMaterial( {color: 0xFFFFFF, transparent: true, opacity: 0.1} );
const sphere = new Mesh( geometryBall, material1 );
sphere.name = 'Spheres'
scene.add( sphere );
// const geometryBall2 = new SphereBufferGeometry( 0.2, 32, 32 );
// geometryBall2.center();
// geometryBall2.translate( 0, 0, -1);
// const material2 = new MeshBasicMaterial( {color: 0xffff00} );
// const sphere1 = new Mesh( geometryBall2, material2 );
// scene.add( sphere1 );
  }

  let btnElement = document.getElementById("next");
  let arrowAnimation = document.getElementById("arrowtxt");

   function hideArrow() {
      arrowAnimation.classList.add("hide");
      console.log('HIDING')
   }

  function showArrow() {
      arrowAnimation.classList.remove("hide");
      arrowAnimation.classList.add("show");
      console.log('SHOWING')
   }

  btnElement.addEventListener("click", () => {
    console.log('clickisvalid')
      scene.remove( mesh );
      scene.remove( mesh2 );
      pIndex = (pIndex + 1) % repoData.length;
      record = repoData[pIndex];
      globalString = record['Project Name'];
      globalSubtitle = record.Subtitle;
      if(pIndex > 0){
      globalURL = 'content.html?' + record.Slug;
      showArrow();
      }else{
      globalURL = '#'
      hideArrow();
      }
      createGeometry();
  });


  let canvasElement = document.getElementById('container');
  if (canvasElement) {
  canvasElement.addEventListener("click", () => {
   window.location.href = globalURL;
  });
  }
  init();
  var SPEED = 0.01;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      if (myCoolBool == true) {
        mesh.material.uniforms.uTime.value = clock.getElapsedTime(); 
      }
    });

window.addEventListener('resize', resize);

function resize() {
    if (window.innerWidth < 700) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.position.z = innerWidth / 50
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  textSize1 = 0.5;
  textSize2 = 0.11;
    }else{
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.position.z = 3;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  textSize1 = 0.75;
  textSize2 = 0.15;
    }
}