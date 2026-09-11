import { useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { sampleDaylight } from "./daylight";
import { easeInOutCubic, INTRO, range } from "./timeline";
import { useSceneProgress } from "./useSceneProgress";

/** Road layout in meters. The truck drives toward +x in the middle lane (z = 0). */
const ROAD = {
  segment: 24, // one texture tile: two 3 m dashes with 9 m gaps
  length: 1200, // long enough to stay unbroken while the camera looks down the road at the end
  halfWidth: 8.55, // 3 lanes × 3.7 m + 3 m shoulders
  oppositeZ: -25.1,
  railZ: -9.4,
  poleZ: -12.8,
};

const RAIL_POSTS = { count: 300, spacing: 4 };
const LIGHT_POLES = { count: 30, spacing: 40, height: 11 };

function createRoadTexture(maxAnisotropy: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const pxPerMeterX = canvas.width / ROAD.segment;
  const pxPerMeterZ = canvas.height / (ROAD.halfWidth * 2);
  const toY = (z: number) => (z + ROAD.halfWidth) * pxPerMeterZ;

  ctx.fillStyle = "#56595e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fine speckle so movement still reads when the camera is low.
  for (let i = 0; i < 9000; i++) {
    const shade = Math.random() < 0.5 ? 255 : 0;
    ctx.fillStyle = `rgba(${shade},${shade},${shade},${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  const lineWidth = 0.16 * pxPerMeterZ;
  ctx.fillStyle = "#f4f3ef";
  for (const z of [-5.55, 5.55]) {
    ctx.fillRect(0, toY(z) - lineWidth / 2, canvas.width, lineWidth); // solid edge lines
  }
  for (const z of [-1.85, 1.85]) {
    for (const x of [0, 12]) {
      ctx.fillRect(x * pxPerMeterX, toY(z) - lineWidth / 2, 3 * pxPerMeterX, lineWidth); // lane dashes
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(ROAD.length / ROAD.segment, 1);
  texture.anisotropy = maxAnisotropy;
  return texture;
}

const placement = new THREE.Object3D();

/** Spreads a row of instances along x and slides them backwards as the truck "travels". */
function layoutRow(mesh: THREE.InstancedMesh | null, spacing: number, travelled: number, y: number, z: number) {
  if (!mesh) return;
  const shift = travelled % spacing;
  const start = -(mesh.count * spacing) / 2;
  for (let i = 0; i < mesh.count; i++) {
    placement.position.set(start + i * spacing - shift, y, z);
    placement.updateMatrix();
    mesh.setMatrixAt(i, placement.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

/**
 * Endless highway: the truck stays put and the road, rail posts and light poles slide past.
 * During the drive-off the road slows down — the camera eases to a stop while the truck keeps going.
 */
export function Highway({ speed, progress }: { speed: number; progress: MotionValue<number> }) {
  const gl = useThree((state) => state.gl);
  const texture = useMemo(() => createRoadTexture(gl.capabilities.getMaxAnisotropy()), [gl]);
  const scene = useSceneProgress(progress);
  const ground = useRef<THREE.MeshStandardMaterial>(null);
  const road = useRef<THREE.MeshStandardMaterial>(null);
  const railPosts = useRef<THREE.InstancedMesh>(null);
  const poles = useRef<THREE.InstancedMesh>(null);
  const travelled = useRef(0);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    const c = scene.current ?? progress.get();
    const slowdown = 1 - 0.7 * easeInOutCubic(range(c, INTRO.driveStart, INTRO.driveEnd));
    travelled.current += speed * slowdown * Math.min(delta, 0.1);

    // Both carriageways share this texture, so shifting it once moves both.
    if (road.current?.map) road.current.map.offset.x = (travelled.current / ROAD.segment) % 1;
    layoutRow(railPosts.current, RAIL_POSTS.spacing, travelled.current, 0.4, ROAD.railZ - 0.08);
    layoutRow(poles.current, LIGHT_POLES.spacing, travelled.current, LIGHT_POLES.height / 2, ROAD.poleZ);
    ground.current?.color.copy(sampleDaylight(range(c, INTRO.sunsetStart, INTRO.sunsetEnd)).ground);
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[1400, 1400]} />
        <meshStandardMaterial ref={ground} roughness={1} />
      </mesh>

      {[0, ROAD.oppositeZ].map((z) => (
        <mesh key={z} rotation-x={-Math.PI / 2} position={[0, 0, z]} receiveShadow>
          <planeGeometry args={[ROAD.length, ROAD.halfWidth * 2]} />
          <meshStandardMaterial ref={z === 0 ? road : undefined} map={texture} roughness={0.92} />
        </mesh>
      ))}

      <mesh position={[0, 0.62, ROAD.railZ]} castShadow receiveShadow>
        <boxGeometry args={[ROAD.length, 0.32, 0.08]} />
        <meshStandardMaterial color="#c3c6c8" metalness={0.6} roughness={0.35} />
      </mesh>

      <instancedMesh ref={railPosts} args={[undefined, undefined, RAIL_POSTS.count]} castShadow frustumCulled={false}>
        <boxGeometry args={[0.14, 0.8, 0.14]} />
        <meshStandardMaterial color="#9fa3a6" metalness={0.4} roughness={0.5} />
      </instancedMesh>

      <instancedMesh ref={poles} args={[undefined, undefined, LIGHT_POLES.count]} castShadow frustumCulled={false}>
        <cylinderGeometry args={[0.09, 0.14, LIGHT_POLES.height, 10]} />
        <meshStandardMaterial color="#b4b7ba" metalness={0.5} roughness={0.45} />
      </instancedMesh>
    </group>
  );
}
