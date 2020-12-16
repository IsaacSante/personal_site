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
      MeshBasicMaterial,
      SphereGeometry,
      BoxGeometry,
      TetrahedronGeometry,
      DodecahedronGeometry,
  } from "three";

  import fragmentShader from "./shaders/fragment.glsl"
  import vertexShader from "./shaders/vertex.glsl";

  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: "keyMKnZBFsdFtC0UX" }).base(
  'appvMjgA3Di00eDev'
 );

  let uniforms, container, scene, camera, renderer, mesh, mesh2, geometry, geometry2, clock, repoData, material, time, record, pIndex;
  let globalString, globalSubtitle, globalURL, sphere, bgImg;
  let myCoolBool = false;
  let colors = ['#000000','#A55C1B','#485461','#655B50','#517FA4'];
  var indexColor = 0; 
  let btnElement = document.getElementById("next");
  let backElement = document.getElementById("back");
  let geometryBall = new SphereGeometry(0.4, 8, -30);
  let geometries = [ new SphereGeometry(0.4, 8, -30), new SphereGeometry( 0.4, 16, 16 ), new BoxGeometry(0.4, 0.4, 0.4), new TetrahedronGeometry (0.4), new DodecahedronGeometry (0.4) ]; 

  function init () {
        container = document.querySelector(".container");
        scene = new Scene();
        clock = new Clock();
        time = 0;
        const spinner = document.getElementById("spinner");

      function hideSpinner() {
      spinner.classList.add("hide");
      }
        base('Work').select({
          view: "Grid view"
        }).eachPage(function page(records) {
              repoData = records
              pIndex = repoData.findIndex(x => x.fields["Project Name"] === "Isaac Sante")
              record = repoData[pIndex];
              globalString = record.fields['Project Name'];
              globalSubtitle = record.fields.Subtitle;
              globalURL = 'info.html'
              bgImg = record.fields.Img1[0].url
              document.getElementById("background-img").src = bgImg 
          createGeometry();

        }, function done(err) {
          if (err) { console.error(err); return; }
        });

    createRenderer();
    createCamera();
    hideSpinner();
    createLights();
    createDance();
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
    function createGeometry() {
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

              mesh = new Mesh(geometry, material);
              mesh2 = new Mesh(geometry2, material);
              scene.add(mesh);
              scene.add(mesh2);
              myCoolBool = true;

          } );
      }

    function createDance() {
        geometryBall.center();
        let material1 = new MeshBasicMaterial( {color: 0xFFFFFF, wireframe: true,} );
        sphere = new Mesh( geometryBall, material1 );
        sphere.name = 'Spheres'
        scene.add( sphere );
        sphere.position.y = -1.3; 
    }

   function hideArrow() {
      let arrowAnimation = document.getElementById("arrowtxt");
        arrowAnimation.classList.add("hide");
   }

    function showArrow() {
        let arrowAnimation = document.getElementById("arrowtxt");
            arrowAnimation.classList.remove("hide");
            arrowAnimation.classList.add("show");
    }

  if(btnElement){
      btnElement.addEventListener("click", () => {
        indexColor ++ 
        if (indexColor > 4 ) {
            indexColor = 0
        }
          document.getElementsByTagName("body")[0].style.backgroundColor = colors[indexColor]
          scene.remove( mesh )
          scene.remove( mesh2 )
          pIndex = (pIndex + 1) % repoData.length
          record = repoData[pIndex]
          globalString = record.fields['Project Name']
          globalSubtitle = record.fields.Subtitle
          bgImg = record.fields.Img1[0].url
          document.getElementById("background-img").src = bgImg 

          if(pIndex > 0){
              globalURL = 'content.html?' + record.fields.Slug
              showArrow();
          }else{
              globalURL = 'info.html'
              hideArrow();
          }

          createGeometry()
          scene.remove( sphere )
          geometryBall = geometries[indexColor]
          createDance()
      });
   }

   if(backElement){
        backElement.addEventListener("click", () => {

              if (indexColor == 0 ){
                indexColor = colors.length;
              }
              indexColor --

                document.getElementsByTagName("body")[0].style.backgroundColor = colors[indexColor]
                scene.remove( mesh );
                scene.remove( mesh2 );

                if (pIndex == 0 ){
                    pIndex = repoData.length - 1;
                }else{
                    pIndex = (pIndex - 1) % repoData.length;
                }
                record = repoData[pIndex];
                globalString = record.fields['Project Name'];
                globalSubtitle = record.fields.Subtitle;
                bgImg = record.fields.Img1[0].url
                document.getElementById("background-img").src = bgImg 

                if(pIndex > 0){
                  globalURL = 'content.html?' + record.fields.Slug;
                  showArrow();
                }else{
                    globalURL = 'info.html'
                    hideArrow();
                }
                createGeometry();
                scene.remove( sphere )
                geometryBall = geometries[indexColor]
                createDance()
        });
     }

init();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      if (myCoolBool == true) {
        mesh.material.uniforms.uTime.value = clock.getElapsedTime(); 
      }
      sphere.rotation.y += 0.015;
    });

    let canvasElement = document.getElementById('container');
    if (canvasElement) {
        canvasElement.addEventListener("click", () => {
        window.location.href = globalURL;
        });
    }

window.addEventListener('resize', resize);

function resize() {
    if (window.innerWidth < 700) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.z = innerWidth / 50
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }else{
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.position.z = 3;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
}