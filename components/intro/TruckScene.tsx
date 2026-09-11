"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { Atmosphere } from "./Atmosphere";
import { STAGE_COLOR } from "./daylight";
import { Highway } from "./Highway";
import { driveDistance, easeInOutCubic, INTRO, lerp, range } from "./timeline";
import { TRAILER, Truck } from "./Truck";
import { useSceneProgress } from "./useSceneProgress";

type ScreenRect = { x: number; y: number; width: number };

/** Sent to TruckIntro every frame (px, relative to the canvas). */
export type SceneFrame = {
  /** Where the trailer logo is right now. */
  logo: ScreenRect;
  /** Where the trailer logo sits when the camera stops on it — the flat logo stays here while the truck drives off. */
  anchor: ScreenRect;
};

type TruckSceneProps = {
  progress: MotionValue<number>;
  /** Pauses rendering while the intro is scrolled out of view. */
  active: boolean;
  onReady: () => void;
  onFrame: (frame: SceneFrame) => void;
};

const SPEED = 24; // m/s ≈ 54 mph
const deg = THREE.MathUtils.degToRad;

type Shot = { azimuth: number; elevation: number; distance: number; target: THREE.Vector3 };

/** High and ahead of the truck, looking back down the road at it. Azimuth 0 = trailer's logo side, 90° = straight ahead. */
const AERIAL: Shot = { azimuth: deg(46), elevation: deg(17), distance: 50, target: new THREE.Vector3(-9, 3, -2) };
/** Low, just ahead of the grille. */
const FRONT: Shot = { azimuth: deg(90), elevation: deg(6), distance: 27, target: new THREE.Vector3(3, 2.4, 0) };
/** Level with the logo: any higher and the roof (and its star decal) peeks over the trailer edge. */
const SIDE = { azimuth: 0, elevation: 0 };
const PUSH_IN = 0.95;
const LOGO_Z = TRAILER.width / 2 + 0.012;
const LOGO_CENTER = new THREE.Vector3(TRAILER.logo.x, TRAILER.logo.y, LOGO_Z);
/** Where the camera ends up, down in the lane behind the truck, watching it go. */
const DRIVE_CAMERA = new THREE.Vector3(-38, 5.5, 7);
/** How far the view tilts up (m at the truck) so the horizon settles below the logo. */
const DRIVE_LIFT = 20;

// Reused every frame to avoid allocations.
const lookTarget = new THREE.Vector3();
const truckPoint = new THREE.Vector3();
const corner = new THREE.Vector3();
const anchorCamera = new THREE.PerspectiveCamera();

/** Camera distance so the trailer logo fills ~half a wide screen, or most of a phone screen. */
function sideDistance(aspect: number, fov: number) {
  const tanHalfFov = Math.tan(deg(fov / 2));
  const share = THREE.MathUtils.clamp(0.52 + (1 - aspect) * 0.55, 0.52, 0.86);
  return TRAILER.logo.width / (share * 2 * tanHalfFov * aspect);
}

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t2 * t);
}

/** A smooth curve through three values; `b` is passed at t = 0.5, so the camera never stops at the middle shot. */
function through(a: number, b: number, c: number, t: number) {
  const s = t * 2;
  return s <= 1 ? catmullRom(a, a, b, c, s) : catmullRom(a, b, c, c, s - 1);
}

function orbit(out: THREE.Vector3, target: THREE.Vector3, azimuth: number, elevation: number, distance: number) {
  return out.set(
    target.x + distance * Math.cos(elevation) * Math.sin(azimuth),
    target.y + distance * Math.sin(elevation),
    target.z + distance * Math.cos(elevation) * Math.cos(azimuth),
  );
}

function projectLogo(camera: THREE.Camera, width: number, height: number): ScreenRect {
  const halfWidth = TRAILER.logo.width / 2;
  const halfHeight = TRAILER.logo.height / 2;
  corner.set(LOGO_CENTER.x - halfWidth, LOGO_CENTER.y + halfHeight, LOGO_Z).project(camera);
  const left = ((corner.x + 1) / 2) * width;
  const top = ((1 - corner.y) / 2) * height;
  corner.set(LOGO_CENTER.x + halfWidth, LOGO_CENTER.y - halfHeight, LOGO_Z).project(camera);
  const right = ((corner.x + 1) / 2) * width;
  return { x: left, y: top, width: right - left };
}

/** Moves the camera along the scroll path, then reports where the trailer logo landed on screen. */
function Director({ progress, onFrame }: { progress: MotionValue<number>; onFrame: (frame: SceneFrame) => void }) {
  const scene = useSceneProgress(progress);

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const aspect = width / height;
    const c = scene.current ?? progress.get();

    // Narrow (phone) screens pull the wide shots back so the whole truck stays in frame.
    const fit = Math.max(1, 1.1 / aspect);
    const side = sideDistance(aspect, camera.fov);

    // Aerial → in front of the grille → around to the trailer's side, then a slow push-in on the logo.
    const fly = easeInOutCubic(range(c, 0, INTRO.sideEnd));
    const push = lerp(1, PUSH_IN, easeInOutCubic(range(c, INTRO.sideEnd, INTRO.holdEnd)));
    lookTarget.set(
      through(AERIAL.target.x, FRONT.target.x, LOGO_CENTER.x, fly),
      through(AERIAL.target.y, FRONT.target.y, LOGO_CENTER.y, fly),
      through(AERIAL.target.z, FRONT.target.z, LOGO_CENTER.z, fly),
    );
    orbit(
      camera.position,
      lookTarget,
      through(AERIAL.azimuth, FRONT.azimuth, SIDE.azimuth, fly),
      through(AERIAL.elevation, FRONT.elevation, SIDE.elevation, fly),
      through(AERIAL.distance * fit, FRONT.distance * Math.sqrt(fit), side, fly) * push,
    );

    // The truck drives off into the sunset: the camera drops back into the lane and follows it down the road.
    const drive = easeInOutCubic(range(c, INTRO.driveStart, INTRO.driveEnd));
    if (drive > 0) {
      camera.position.lerp(DRIVE_CAMERA, drive);
      truckPoint.set(driveDistance(c) - 2, 2.2 + DRIVE_LIFT * drive, 0);
      lookTarget.lerp(truckPoint, easeInOutCubic(range(c, INTRO.driveStart, INTRO.driveStart + 0.1)));
    }

    camera.lookAt(lookTarget);
    camera.updateMatrixWorld();

    anchorCamera.fov = camera.fov;
    anchorCamera.aspect = camera.aspect;
    anchorCamera.updateProjectionMatrix();
    orbit(anchorCamera.position, LOGO_CENTER, SIDE.azimuth, SIDE.elevation, side * PUSH_IN);
    anchorCamera.lookAt(LOGO_CENTER);
    anchorCamera.updateMatrixWorld();

    onFrame({ logo: projectLogo(camera, width, height), anchor: projectLogo(anchorCamera, width, height) });
  });

  return null;
}

/** The WebGL canvas for the homepage intro: sky, light, highway, truck and the scroll director. */
export default function TruckScene({ progress, active, onReady, onFrame }: TruckSceneProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 35, near: 0.5, far: 900, position: [20, 25, 40] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
    >
      <color attach="background" args={[STAGE_COLOR]} />
      <fog attach="fog" args={[STAGE_COLOR, 90, 340]} />

      <Atmosphere progress={progress} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 20, 0]} rotation-x={Math.PI / 2} scale={[40, 40, 1]} />
        <Lightformer intensity={1.4} position={[0, 5, 30]} rotation-y={Math.PI} scale={[40, 8, 1]} />
        <Lightformer intensity={0.8} position={[-30, 5, 0]} rotation-y={Math.PI / 2} scale={[40, 8, 1]} />
      </Environment>

      <Highway speed={SPEED} progress={progress} />
      <Truck speed={SPEED} progress={progress} />
      <Director progress={progress} onFrame={onFrame} />
    </Canvas>
  );
}
