"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";
import { Highway } from "./Highway";
import { easeInOutCubic, INTRO, range } from "./timeline";
import { TRAILER, Truck } from "./Truck";

/** Sent to TruckIntro every frame: where the trailer logo sits on screen (px, relative to the canvas). */
export type SceneFrame = {
  logo: { x: number; y: number; width: number };
};

type TruckSceneProps = {
  progress: MotionValue<number>;
  /** Pauses rendering while the intro is scrolled out of view. */
  active: boolean;
  onReady: () => void;
  onFrame: (frame: SceneFrame) => void;
};

export const SKY = "#e9e5e0";
const SPEED = 24; // m/s ≈ 54 mph

const TOP = { elevation: THREE.MathUtils.degToRad(82), azimuth: THREE.MathUtils.degToRad(-65), distance: 46 };
// Level with the logo: any higher and the roof (and its star decal) peeks over the trailer edge.
const SIDE = { elevation: 0, azimuth: 0 };
const TRUCK_CENTER = new THREE.Vector3(-2.2, 1.6, 0);
const LOGO_Z = TRAILER.width / 2 + 0.012;
const LOGO_CENTER = new THREE.Vector3(TRAILER.logo.x, TRAILER.logo.y, LOGO_Z);

// Reused every frame to avoid allocations.
const lookTarget = new THREE.Vector3();
const corner = new THREE.Vector3();

/** Camera distance so the trailer logo fills ~half a wide screen, or most of a phone screen. */
function sideDistance(aspect: number, fov: number) {
  const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  const share = THREE.MathUtils.clamp(0.52 + (1 - aspect) * 0.55, 0.52, 0.86);
  return TRAILER.logo.width / (share * 2 * tanHalfFov * aspect);
}

/** Moves the camera along the scroll path, then reports where the trailer logo landed on screen. */
function Director({ progress, onFrame }: { progress: MotionValue<number>; onFrame: (frame: SceneFrame) => void }) {
  const cameraProgress = useRef<number | null>(null);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const p = progress.get();

    // Camera is lightly damped so fast scrolls still glide. TruckIntro's overlays use raw
    // progress so they stay in lockstep with the header.
    const previous = cameraProgress.current ?? p;
    const c = THREE.MathUtils.damp(previous, p, 6, Math.min(delta, 0.1));
    cameraProgress.current = c;

    const orbit = easeInOutCubic(range(c, 0, INTRO.orbitEnd));
    const push = easeInOutCubic(range(c, INTRO.orbitEnd, INTRO.holdEnd));
    const elevation = THREE.MathUtils.lerp(TOP.elevation, SIDE.elevation, orbit);
    const azimuth = THREE.MathUtils.lerp(TOP.azimuth, SIDE.azimuth, orbit);
    const distance =
      THREE.MathUtils.lerp(TOP.distance, sideDistance(width / height, camera.fov), orbit) * THREE.MathUtils.lerp(1, 0.94, push);

    lookTarget.lerpVectors(TRUCK_CENTER, LOGO_CENTER, orbit);
    camera.position.set(
      lookTarget.x + distance * Math.cos(elevation) * Math.sin(azimuth),
      lookTarget.y + distance * Math.sin(elevation),
      lookTarget.z + distance * Math.cos(elevation) * Math.cos(azimuth),
    );
    camera.lookAt(lookTarget);
    camera.updateMatrixWorld();

    const halfWidth = TRAILER.logo.width / 2;
    const halfHeight = TRAILER.logo.height / 2;
    corner.set(LOGO_CENTER.x - halfWidth, LOGO_CENTER.y + halfHeight, LOGO_Z).project(camera);
    const left = ((corner.x + 1) / 2) * width;
    const top = ((1 - corner.y) / 2) * height;
    corner.set(LOGO_CENTER.x + halfWidth, LOGO_CENTER.y - halfHeight, LOGO_Z).project(camera);
    const right = ((corner.x + 1) / 2) * width;

    onFrame({ logo: { x: left, y: top, width: right - left } });
  });

  return null;
}

/** The WebGL canvas for the homepage intro: lights, highway, truck and the scroll director. */
export default function TruckScene({ progress, active, onReady, onFrame }: TruckSceneProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 35, near: 0.5, far: 700, position: [0, 46, 10] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
    >
      <color attach="background" args={[SKY]} />
      <fog attach="fog" args={[SKY, 90, 340]} />

      <hemisphereLight args={["#ffffff", "#d6cfc6", 1.2]} />
      <directionalLight
        castShadow
        position={[16, 32, 24]}
        intensity={2.4}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <Environment resolution={256} frames={1} environmentIntensity={0.6}>
        <Lightformer intensity={2} position={[0, 20, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
        <Lightformer intensity={1.4} position={[0, 5, 30]} rotation-y={Math.PI} scale={[40, 8, 1]} />
        <Lightformer intensity={0.8} position={[-30, 5, 0]} rotation-y={Math.PI / 2} scale={[40, 8, 1]} />
      </Environment>

      <Highway speed={SPEED} />
      <Truck speed={SPEED} />
      <Director progress={progress} onFrame={onFrame} />
    </Canvas>
  );
}
