
    uniform float u_time;
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      varying vec3 vUv;
    uniform vec2 u_resolution;
    void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(mix(sin(u_time * 0.8) + colorA , sin(u_time * 0.8) + colorB, vUv.x), 1.0);
      }