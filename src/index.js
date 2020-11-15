import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    MeshBasicMaterial,
    CanvasTexture,
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
    TextBufferGeometry,
    DoubleSide,
    Vector2,
    BufferAttribute,
    BoxBufferGeometry,
    WireframeGeometry,
    LineBasicMaterial,
    LineSegments,
  } from "three";
  // import { Wireframe } from './jsm/lines/Wireframe.js';
  // import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  import * as Stats from 'stats.js';
  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";
  import * as THREE from 'three'; //REMOVE this in production
  const DEBUG = true; // Set to false in production
  if(DEBUG) {
      window.THREE = THREE;
  }

  let uniforms;
  let container, container2, scene, scene2, camera, camera2, renderer, renderer2, mesh, clock, mesh2, repoData, geometry, wireGeo, line, material, time, mesh3;
  let stats;

  function init () {
    container = document.querySelector(".container");
    container2 = document.querySelector(".container-work");
    scene = new Scene();
    scene2 = new Scene();
    clock = new Clock();
    createRenderer();
    createGeometry();

    fetch('https://isaac-repo.glitch.me/pages', {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin':'*'
        }
    }).then(resp => resp.json())
    .then(data => {
      console.log(data)
        repoData = data ;
        createProjecttGeometry();
        // repoLength = repoData.length;
        // createGeometries();
    }).catch(e => console.error(e));

    createCamera();
    createLights();
    time = 0;
    if(DEBUG) {
      window.scene = scene;
      window.camera = camera;
      stats = Stats.default();
      document.body.appendChild( stats.dom );
  }
  }

  function createCamera() {
    const aspect = container.clientWidth / container.clientHeight;
    const aspect2 = container2.clientWidth / container2.clientHeight;
    camera = new PerspectiveCamera(100, aspect, 0.1, 1000);
    camera.position.set(0, -0.5, 3);
    camera2 = new PerspectiveCamera(1, aspect2, 0.1, 1100);
    camera2.position.set(0, 0, 1000);
}

function createLights() {
    const directionalLight = new DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 10);
    const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
    scene.add(directionalLight, hemisphereLight);
    scene2.add(directionalLight, hemisphereLight);
}


function createRenderer() {
    renderer = new WebGLRenderer({ antialias: true, alpha: true});
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    container.appendChild(renderer.domElement);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer2 = new WebGLRenderer({ antialias: true, alpha: true});
    renderer2.setClearColor( 0x000000, 0 );
    renderer2.setSize(container2.clientWidth, container2.clientHeight);
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.physicallyCorrectLights = true;
    container2.appendChild(renderer2.domElement);
    renderer2.setPixelRatio(window.devicePixelRatio);

}

  function createGeometry() {
    var loader = new FontLoader();
    loader.load( 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {
      geometry = new TextBufferGeometry( 'I create', {
        font: font,
        size: 1.2,
        height: 0,
      } );
      geometry.center();
      geometry.translate( 0, 0.5, 0 );
      var geometry2 = new TextBufferGeometry( 'Bridging the gap between design & technology.', {
        font: font,
        size: 0.2,
        height: 0,
      } );
      geometry2.center();
      geometry2.translate( 0, -1, 0 );

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

      mesh = new Mesh( geometry, material );
      mesh2 = new Mesh( geometry2, material );
      scene.add( mesh );
      scene.add( mesh2 );
    } );
  }

  function createProjecttGeometry() {
    let geometry3 = new BoxBufferGeometry(6,6,6);
    geometry3.center();

      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = '20pt Arial';
      // context.fillStyle = 'black';
      // context.textAlign = "center";
      // context.textBaseline = "middle";
      // context.fillText(new Date().getTime(), canvas.width / 2, canvas.height / 2);

      ctx.fillStyle = 'white';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText('hello world', ctx.canvas.width / 2, ctx.canvas.height / 2);
      // ctx.fillStyle = 'red';
      // ctx.fillRect(0, 0, 1, 1);
      // ctx.strokeStyle = '#FFFF00';
      // ctx.font = "30px Arial";
      // ctx.fillText("Hello World", 10, 50); 
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const texture = new CanvasTexture(ctx.canvas);


    const materialLast = new MeshBasicMaterial({
      map: texture,
    });

    mesh3 = new Mesh(geometry3, materialLast );
    scene2.add(mesh3)
    // let matLine = new LineBasicMaterial( {
    //   color: 0xACB6E5,
    //   linewidth: 100, // in pixels
    //   //resolution:  // to be set by renderer, eventually
    // } );

    // wireGeo = new WireframeGeometry (geometry3, matLine)
    // line = new LineSegments( wireGeo );
    // scene2.add( line );


  }

 function animate(){
  //  line.rotation.x += 0.005;
  //  line.rotation.y += 0.005;
  // mesh3.rotation.x += 0.005;
  // mesh3.rotation.y += 0.005;
}

// function onWindowResize() {
//   camera.aspect = container.clientWidth / container.clientHeight;
//   camera.position.z = innerWidth / 40
//   camera.updateProjectionMatrix();
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   camera2.aspect2 = container2.clientWidth / container2.clientHeight;
//   camera2.position.z = innerWidth / 40
//   camera2.updateProjectionMatrix();
//   renderer2.setSize(container2.clientWidth, container2.clientHeight);
// }

// window.addEventListener("resize", onWindowResize, false);
  init();
  setTimeout(function() { 
    renderer.setAnimationLoop(() => {
      stats.begin();
      animate();
      renderer.render(scene, camera);
      renderer2.render(scene2, camera2);
      stats.end();
      mesh.material.uniforms.u_time.value = clock.getElapsedTime();
    });
   }, 1000);
