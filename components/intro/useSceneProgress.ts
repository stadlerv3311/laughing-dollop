import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Scroll progress for the 3D scene, lightly damped so fast scrolls still glide.
 * Every scene part damps the same input the same way, so they stay in lockstep.
 * Read `.current` inside a useFrame registered after this hook. DOM overlays use raw progress instead.
 */
export function useSceneProgress(progress: MotionValue<number>) {
  const value = useRef<number | null>(null);

  useFrame((_, delta) => {
    const p = progress.get();
    value.current = value.current === null ? p : THREE.MathUtils.damp(value.current, p, 6, Math.min(delta, 0.1));
  });

  return value;
}
