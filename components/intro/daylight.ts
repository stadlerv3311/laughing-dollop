import * as THREE from "three";

/** Background of the stage before the 3D scene loads — matches the morning horizon. */
export const STAGE_COLOR = "#eee8e0";

type Daylight = {
  zenith: THREE.Color;
  horizon: THREE.Color;
  ground: THREE.Color;
  distant: THREE.Color;
  sun: THREE.Color;
  skyLight: THREE.Color;
  groundLight: THREE.Color;
  sunDirection: THREE.Vector3;
  sunIntensity: number;
  ambient: number;
  reflections: number;
  glow: number;
};

const MORNING: Daylight = {
  zenith: new THREE.Color("#b7cde0"),
  horizon: new THREE.Color(STAGE_COLOR),
  ground: new THREE.Color("#ddd6cc"),
  distant: new THREE.Color("#d3c5b5"),
  sun: new THREE.Color("#fff4e2"),
  skyLight: new THREE.Color("#ffffff"),
  groundLight: new THREE.Color("#d6cfc6"),
  sunDirection: new THREE.Vector3(-0.25, 0.82, 0.52).normalize(),
  sunIntensity: 2.4,
  ambient: 1.2,
  reflections: 0.6,
  glow: 0.25,
};

const SUNSET: Daylight = {
  zenith: new THREE.Color("#8a97b8"),
  horizon: new THREE.Color("#ffb07a"),
  ground: new THREE.Color("#c2987f"),
  distant: new THREE.Color("#a27b70"),
  sun: new THREE.Color("#ff9e5c"),
  skyLight: new THREE.Color("#ffc99e"),
  groundLight: new THREE.Color("#6e5a52"),
  sunDirection: new THREE.Vector3(1, 0.035, 0.12).normalize(),
  sunIntensity: 2.2,
  ambient: 0.8,
  reflections: 0.3,
  glow: 1,
};

/** Shared result, overwritten on every call — read it right away. */
const daylight: Daylight = {
  zenith: new THREE.Color(),
  horizon: new THREE.Color(),
  ground: new THREE.Color(),
  distant: new THREE.Color(),
  sun: new THREE.Color(),
  skyLight: new THREE.Color(),
  groundLight: new THREE.Color(),
  sunDirection: new THREE.Vector3(),
  sunIntensity: 0,
  ambient: 0,
  reflections: 0,
  glow: 0,
};

const COLORS = ["zenith", "horizon", "ground", "distant", "sun", "skyLight", "groundLight"] as const;
const NUMBERS = ["sunIntensity", "ambient", "reflections", "glow"] as const;

/** Scene light for a time of day: 0 = morning, 1 = sunset. */
export function sampleDaylight(time: number) {
  const t = time * time * (3 - 2 * time);
  for (const key of COLORS) daylight[key].lerpColors(MORNING[key], SUNSET[key], t);
  for (const key of NUMBERS) daylight[key] = THREE.MathUtils.lerp(MORNING[key], SUNSET[key], t);
  daylight.sunDirection.lerpVectors(MORNING.sunDirection, SUNSET.sunDirection, t).normalize();
  return daylight;
}
