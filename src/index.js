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
  } from "three";
  import * as Stats from 'stats.js';
  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";
  import * as THREE from 'three'; //REMOVE this in production
  import {params} from './helpers.js';
  import {createSculpture} from 'shader-park-core';
  var moment = require('moment-timezone');

  const DEBUG = true; // Set to false in production
  if(DEBUG) {
      window.THREE = THREE;
  }
  let uniforms;
  let container, scene, camera, renderer, mesh, mesh2, mesh3, geometry, geometry2, geometry3, geoMask1, maskMat,maskFinal, clock, repoData, material, material2,  time, record, pIndex;
  let globalString, globalSubtitle, globalURL, globalImg;
  let stats;
  let textSize1, textSize2;
  let intialImg = document.getElementById("initial-picture");
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
        globalImg = record.Img1[0].url
        intialImg.src = globalImg;
        createGeometry(record);
    }).catch(e => console.error(e));
    hideSpinner();
    createCamera();
    createLights();
    if(DEBUG) {
      window.scene = scene;
      window.camera = camera;
      // stats = Stats.default();
      // document.body.appendChild( stats.dom );
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
      geometry.translate( 0, 0, 0);

       geoMask1 = new TextBufferGeometry(globalString, {
        font: font,
        size: 0.899,
        height: 0,
      } );
      geoMask1.center();
      geoMask1.translate( 0, 0, 0.05);

      geometry2 = new TextBufferGeometry(globalSubtitle, {
        font: font,
        size: 0.16,
        height: 0,
      } );
      geometry2.center();
      geometry2.translate( 0, -1, 0);
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

      maskMat = new MeshBasicMaterial({color: 0x687681,  transparent: true, opacity: 0.5,})
      mesh = new Mesh(geometry, material);
      mesh2 = new Mesh(geometry2, material);
      maskFinal = new Mesh(geoMask1, maskMat)
      scene.add(mesh);
      scene.add(mesh2);
      // scene.add(maskFinal);
    } );

    // geometry3 = new PlaneGeometry(9.0, 6.0, 16, 16);
    // geometry3.center();
    // geometry3.translate( -0.2, -0.2, -1);
    // let Newtexture = new TextureLoader().load(globalImg);
    // material2 = new MeshBasicMaterial({ map: Newtexture, transparent: true, opacity: 0.3, });
    // mesh3 = new Mesh(geometry3, material2);
    // mesh3.rotation.y = Math.PI/18
    // scene.add(mesh3);
  }

  let btnElement = document.getElementById('next');
  let arrowAnimation = document.getElementById("arrowtxt");
   function hideArrow() {
      arrowAnimation.classList.add("hide");
   }
  function showArrow() {
      arrowAnimation.classList.add("show");
   }
  btnElement.addEventListener("click", () => {
      scene.remove( mesh );
      scene.remove( mesh2 );
      scene.remove( mesh3 );
      scene.remove( maskFinal );
      pIndex = (pIndex + 1) % repoData.length;
      record = repoData[pIndex];
      globalString = record['Project Name'];
      globalSubtitle = record.Subtitle;
      globalImg = record.Img1[0].url
      intialImg.src = globalImg;
      if(pIndex > 0){
      showArrow();
      globalURL = 'content.html?' + record.Slug;
      btnElement.innerHTML = 'Next project'
      }else{
      hideArrow();
      btnElement.innerHTML = 'View work'
      globalURL = '#'
      }
      createGeometry();
  });

    function uniformUpdateCallback() {
    return {
        time: time,
        _scale: params.sdfScale
    }
}

  let canvasElement = document.getElementById('container');
  if (canvasElement) {
  canvasElement.addEventListener("click", () => {
   window.location.href = globalURL;
  });
  }
  init();
  
  let timetxt = document.getElementById("time");
  setTimeout(function() { 
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      if (mesh) {
        mesh.material.uniforms.uTime.value = clock.getElapsedTime(); 
      }
      let now = moment().tz("America/New_York").format('hh:mm:ss')
      timetxt.innerHTML = now;
    });
   }, 500);

console.log(camera.position.z)

window.addEventListener('resize', resize);

function resize() {
    if (window.innerWidth < 700) {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.position.z = innerWidth / 50
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  textSize1 = 0.5;
  textSize2 = 0.11;
  // scene.remove( mesh );
  // scene.remove( mesh2 );
  // scene.remove( mesh3 );
  // createGeometry();
    }else{
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.position.z = 3;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  textSize1 = 0.75;
  textSize2 = 0.15;
  // scene.remove( mesh );
  // scene.remove( mesh2 );
  // scene.remove( mesh3 );
  // createGeometry();
    }
}