import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useSvgTexture } from "./useSvgTexture";

const LOGO_ASPECT = 192 / 764; // public/logo.svg viewBox
const WHEEL_RADIUS = 0.5;

/**
 * 53' dry van trailer, in meters. Heading is +x; the logo side faces +z (toward the camera).
 * TruckScene aims the camera — and the flying DOM logo — at TRAILER.logo.
 */
export const TRAILER = {
  front: 2.6,
  length: 16.2,
  width: 2.6,
  bottom: 1.3,
  height: 2.8,
  logo: { x: -5.5, y: 2.7, width: 9.2, height: 9.2 * LOGO_ASPECT },
};

const TRAILER_CENTER_X = TRAILER.front - TRAILER.length / 2;

/** Axles: x position, tire width (duals drawn as one wide tire), distance from center line. */
const WHEELS = [
  { x: 8.0, width: 0.34, inset: 1.08 }, // steer
  { x: 2.55, width: 0.62, inset: 0.95 }, // drive tandem
  { x: 1.25, width: 0.62, inset: 0.95 },
  { x: -11.0, width: 0.62, inset: 0.95 }, // trailer tandem
  { x: -12.3, width: 0.62, inset: 0.95 },
];

function useMaterials() {
  const materials = useMemo(
    () => ({
      paint: new THREE.MeshPhysicalMaterial({ color: "#232324", metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12 }),
      trailer: new THREE.MeshStandardMaterial({ color: "#f6f6f4", roughness: 0.5, metalness: 0.05 }),
      skirt: new THREE.MeshStandardMaterial({ color: "#e6e6e3", roughness: 0.6 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#dcdcdc", metalness: 1, roughness: 0.18 }),
      steel: new THREE.MeshStandardMaterial({ color: "#8d9093", metalness: 0.7, roughness: 0.4 }),
      frame: new THREE.MeshStandardMaterial({ color: "#1c1c1d", roughness: 0.8 }),
      rubber: new THREE.MeshStandardMaterial({ color: "#151515", roughness: 0.95 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#0d1013", roughness: 0.06, metalness: 0.3, clearcoat: 1 }),
      accent: new THREE.MeshStandardMaterial({ color: "#ff3000", roughness: 0.45 }),
      headlight: new THREE.MeshStandardMaterial({ color: "#fffaf0", emissive: "#fff3d6", emissiveIntensity: 1.2 }),
      taillight: new THREE.MeshStandardMaterial({ color: "#b81a00", emissive: "#ff2a00", emissiveIntensity: 0.6 }),
    }),
    [],
  );

  useEffect(() => () => Object.values(materials).forEach((material) => material.dispose()), [materials]);
  return materials;
}

type Materials = ReturnType<typeof useMaterials>;

function Wheel({ x, z, width, materials, spinRef }: { x: number; z: number; width: number; materials: Materials; spinRef: (group: THREE.Group | null) => void }) {
  // The wheel group is tipped so its local +y (the axle) points along world +z.
  const outer = Math.sign(z) * (width / 2 + 0.012);

  return (
    <group position={[x, WHEEL_RADIUS, z]} rotation-x={Math.PI / 2}>
      <group ref={spinRef}>
        <mesh material={materials.rubber}>
          <cylinderGeometry args={[WHEEL_RADIUS, WHEEL_RADIUS, width, 32]} />
        </mesh>
        <mesh material={materials.chrome} position-y={outer}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
        </mesh>
        {/* Spokes make the spin visible */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={materials.steel} position-y={outer + Math.sign(z) * 0.012} rotation-y={(i * Math.PI) / 3}>
            <boxGeometry args={[0.52, 0.02, 0.07]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Stylized black tractor + white dry van with the logo on its side and the star on its roof. */
export function Truck({ speed }: { speed: number }) {
  const materials = useMaterials();
  const root = useRef<THREE.Group>(null);
  const tractor = useRef<THREE.Group>(null);
  const trailer = useRef<THREE.Group>(null);
  const wheels = useRef<Array<THREE.Group | null>>([]);
  const logo = useSvgTexture("/logo.svg", 2048);
  const icon = useSvgTexture("/logo-icon.svg", 1024);

  useLayoutEffect(() => {
    root.current?.traverse((object) => {
      if ((object as THREE.Mesh).isMesh && !object.userData.decal) object.castShadow = true;
    });
  });

  useFrame((state, delta) => {
    const turn = (speed / WHEEL_RADIUS) * Math.min(delta, 0.1);
    for (const wheel of wheels.current) if (wheel) wheel.rotation.y -= turn;

    // A touch of road vibration.
    const t = state.clock.elapsedTime;
    if (tractor.current) tractor.current.position.y = Math.sin(t * 17) * 0.008;
    if (trailer.current) trailer.current.position.y = Math.sin(t * 11 + 1.3) * 0.006;
  });

  const m = materials;

  return (
    <group ref={root}>
      <group ref={tractor}>
        <mesh material={m.frame} position={[4.75, 0.88, 0]}>
          <boxGeometry args={[8.3, 0.3, 1]} />
        </mesh>
        <mesh material={m.steel} position={[2.1, 1.08, 0]}>
          <boxGeometry args={[2.6, 0.12, 2]} />
        </mesh>
        <RoundedBox args={[2.15, 1.25, 2.3]} radius={0.2} smoothness={4} position={[8.2, 1.85, 0]} material={m.paint} />
        <RoundedBox args={[4, 2.75, 2.45]} radius={0.22} smoothness={4} position={[5.3, 2.5, 0]} material={m.paint} />
        <RoundedBox args={[2.6, 0.3, 2.4]} radius={0.12} smoothness={4} position={[4.6, 4, 0]} material={m.paint} />
        <mesh material={m.glass} position={[7.33, 3.12, 0]}>
          <boxGeometry args={[0.06, 0.85, 2.15]} />
        </mesh>
        <mesh material={m.steel} position={[9.3, 1.78, 0]}>
          <boxGeometry args={[0.06, 0.95, 1.25]} />
        </mesh>
        <RoundedBox args={[0.34, 0.42, 2.5]} radius={0.08} smoothness={3} position={[9.35, 0.95, 0]} material={m.chrome} />

        {[1, -1].map((side) => (
          <group key={side}>
            <mesh material={m.glass} position={[6.5, 3.12, side * 1.232]}>
              <boxGeometry args={[1.35, 0.78, 0.02]} />
            </mesh>
            <mesh material={m.accent} position={[5.3, 1.5, side * 1.232]}>
              <boxGeometry args={[3.9, 0.08, 0.02]} />
            </mesh>
            <mesh material={m.chrome} position={[5.9, 1.02, side * 1]} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.32, 0.32, 1.5, 24]} />
            </mesh>
            <mesh material={m.chrome} position={[3.15, 2.8, side * 1.08]}>
              <cylinderGeometry args={[0.09, 0.09, 3.3, 12]} />
            </mesh>
            <mesh material={m.frame} position={[7.55, 2.95, side * 1.45]}>
              <boxGeometry args={[0.1, 0.55, 0.22]} />
            </mesh>
            <mesh material={m.headlight} position={[9.29, 1.55, side * 0.88]}>
              <boxGeometry args={[0.06, 0.22, 0.44]} />
            </mesh>
            <mesh material={m.frame} position={[0.55, 0.62, side * 0.95]}>
              <boxGeometry args={[0.04, 0.62, 0.62]} />
            </mesh>
          </group>
        ))}
      </group>

      <group ref={trailer}>
        <RoundedBox
          args={[TRAILER.length, TRAILER.height, TRAILER.width]}
          radius={0.06}
          smoothness={3}
          position={[TRAILER_CENTER_X, TRAILER.bottom + TRAILER.height / 2, 0]}
          material={m.trailer}
        />
        <mesh material={m.steel} position={[TRAILER_CENTER_X, TRAILER.bottom + 0.05, 0]}>
          <boxGeometry args={[TRAILER.length, 0.1, TRAILER.width + 0.02]} />
        </mesh>
        <mesh material={m.frame} position={[-11.65, 1.12, 0]}>
          <boxGeometry args={[2.8, 0.24, 1.9]} />
        </mesh>
        <mesh material={m.frame} position={[-13.45, 0.66, 0]}>
          <boxGeometry args={[0.12, 0.12, 2.3]} />
        </mesh>

        {[1, -1].map((side) => (
          <group key={side}>
            <mesh material={m.skirt} position={[-6.2, 0.92, side * 1.26]}>
              <boxGeometry args={[8.6, 0.7, 0.04]} />
            </mesh>
            <mesh material={m.frame} position={[-0.3, 0.8, side * 0.85]}>
              <boxGeometry args={[0.12, 1, 0.12]} />
            </mesh>
            <mesh material={m.taillight} position={[-13.62, 1.5, side * 1.05]}>
              <boxGeometry args={[0.04, 0.14, 0.34]} />
            </mesh>
          </group>
        ))}

        {logo && (
          <mesh userData={{ decal: true }} position={[TRAILER.logo.x, TRAILER.logo.y, TRAILER.width / 2 + 0.012]}>
            <planeGeometry args={[TRAILER.logo.width, TRAILER.logo.height]} />
            <meshBasicMaterial map={logo} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        )}
        {icon && (
          <mesh userData={{ decal: true }} position={[TRAILER_CENTER_X, TRAILER.bottom + TRAILER.height + 0.012, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[2.2, 2.2]} />
            <meshBasicMaterial map={icon} transparent toneMapped={false} depthWrite={false} />
          </mesh>
        )}
      </group>

      {WHEELS.flatMap((wheel, axle) =>
        [1, -1].map((side, i) => (
          <Wheel
            key={`${axle}-${side}`}
            x={wheel.x}
            z={side * wheel.inset}
            width={wheel.width}
            materials={m}
            spinRef={(group) => {
              wheels.current[axle * 2 + i] = group;
            }}
          />
        )),
      )}
    </group>
  );
}
