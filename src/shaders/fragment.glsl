 uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;
      void main() {

        gl_FragColor = vec4(mix(colorA, colorB, vUv.x), 1.0);
      }


// uniform float delta;
// varying float vOpacity;
// varying vec3 vUv;

//  void main() {

//      float r = 1.0 + cos(vUv.x * delta);
//      float g = 0.5 + sin(delta) * 0.5;
//      float b = 0.0;
//          gl_FragColor = vec4(r, g, b, vOpacity);
//        }