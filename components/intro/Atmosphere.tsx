import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import { sampleDaylight } from "./daylight";
import { driveDistance, INTRO, range } from "./timeline";
import { useSceneProgress } from "./useSceneProgress";

const SKY_RADIUS = 600;

const vertexShader = /* glsl */ `
  varying vec3 vDirection;
  void main() {
    vDirection = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uDistant;
  uniform vec3 uSun;
  uniform vec3 uSunDirection;
  uniform float uGlow;
  varying vec3 vDirection;

  // Flat-topped desert mesas along the horizon (height in radians), open where the road meets the horizon.
  float skyline(float azimuth, float seed, float height) {
    float h = 0.5 + 0.3 * sin(azimuth * 2.0 + seed) + 0.2 * sin(azimuth * 5.0 + seed * 2.3) + 0.12 * sin(azimuth * 11.0 + seed * 4.1);
    // Terraces: flat tops joined by sloped cliffs; the lowest terrace drops to the open plain.
    float level = h * 4.0;
    float terraced = (floor(level) + smoothstep(0.5, 0.95, fract(level))) / 4.0;
    terraced = max(terraced - 0.25, 0.0) / 0.75;
    return terraced * height * smoothstep(0.06, 0.4, abs(sin(azimuth)));
  }

  void main() {
    vec3 direction = normalize(vDirection);
    float height = max(direction.y, 0.0);
    vec3 color = mix(uHorizon, uZenith, pow(smoothstep(0.0, 0.55, height), 0.7));

    float facing = max(dot(direction, uSunDirection), 0.0);
    color = mix(color, vec3(1.0, 0.96, 0.88), smoothstep(0.99955, 0.9998, facing));

    float azimuth = atan(direction.z, direction.x);
    float far = skyline(azimuth + 0.8, 1.7, 0.042);
    float near = skyline(azimuth * 1.3 + 2.9, 4.3, 0.024);
    color = mix(color, mix(uHorizon, uDistant, 0.45), 1.0 - smoothstep(far - 0.0012, far + 0.0012, direction.y));
    color = mix(color, mix(uHorizon, uDistant, 0.8), 1.0 - smoothstep(near - 0.0012, near + 0.0012, direction.y));

    color += uSun * uGlow * (pow(facing, 5.0) * 0.4 + pow(facing, 80.0) * 0.6);

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Sky dome with the sun and a distant mesa skyline, plus the light, fog and reflections for the
 * time of day — morning at the start of the intro, sunset by the time the truck drives off.
 */
export function Atmosphere({ progress }: { progress: MotionValue<number> }) {
  const scene = useSceneProgress(progress);
  const dome = useRef<THREE.Mesh>(null);
  const sky = useRef<THREE.ShaderMaterial>(null);
  const ambient = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const sunTarget = useRef<THREE.Object3D>(null);

  useFrame((state) => {
    const c = scene.current ?? progress.get();
    const light = sampleDaylight(range(c, INTRO.sunsetStart, INTRO.sunsetEnd));
    const world = state.scene;

    dome.current?.position.copy(state.camera.position);
    if (sky.current) {
      const uniforms = sky.current.uniforms;
      uniforms.uZenith.value.copy(light.zenith);
      uniforms.uHorizon.value.copy(light.horizon);
      uniforms.uDistant.value.copy(light.distant);
      uniforms.uSun.value.copy(light.sun);
      uniforms.uSunDirection.value.copy(light.sunDirection);
      uniforms.uGlow.value = light.glow;
    }

    if (world.fog instanceof THREE.Fog) world.fog.color.copy(light.horizon);
    if (world.background instanceof THREE.Color) world.background.copy(light.horizon);
    world.environmentIntensity = light.reflections;

    if (ambient.current) {
      ambient.current.color.copy(light.skyLight);
      ambient.current.groundColor.copy(light.groundLight);
      ambient.current.intensity = light.ambient;
    }

    // The sun follows the truck so its shadow stays sharp all the way down the road.
    if (sun.current && sunTarget.current) {
      const x = driveDistance(c) - 2;
      sunTarget.current.position.set(x, 0, 0);
      sun.current.target = sunTarget.current;
      sun.current.position.set(x, 0, 0).addScaledVector(light.sunDirection, 60);
      sun.current.color.copy(light.sun);
      sun.current.intensity = light.sunIntensity;
    }
  });

  return (
    <>
      <mesh ref={dome} renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[SKY_RADIUS, 48, 24]} />
        <shaderMaterial
          ref={sky}
          side={THREE.BackSide}
          depthWrite={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uZenith: { value: new THREE.Color() },
            uHorizon: { value: new THREE.Color() },
            uDistant: { value: new THREE.Color() },
            uSun: { value: new THREE.Color() },
            uSunDirection: { value: new THREE.Vector3(0, 1, 0) },
            uGlow: { value: 0 },
          }}
        />
      </mesh>

      <hemisphereLight ref={ambient} />
      <object3D ref={sunTarget} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-camera-near={1}
        shadow-camera-far={140}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
    </>
  );
}
