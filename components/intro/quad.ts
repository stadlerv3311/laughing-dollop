export type Point = { x: number; y: number };
/** Four corners in order: top-left, top-right, bottom-right, bottom-left. */
export type Quad = readonly [Point, Point, Point, Point];
export type Rect = { x: number; y: number; width: number; height: number };

export function rectToQuad({ x, y, width, height }: Rect): Quad {
  return [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
}

export function mapQuad([a, b, c, d]: Quad, map: (point: Point) => Point): Quad {
  return [map(a), map(b), map(c), map(d)];
}

export function lerpQuad(from: Quad, to: Quad, t: number): Quad {
  const mix = (i: number) => ({ x: from[i].x + (to[i].x - from[i].x) * t, y: from[i].y + (to[i].y - from[i].y) * t });
  return [mix(0), mix(1), mix(2), mix(3)];
}

/**
 * CSS `matrix3d` that stretches an element's box (`width` × `height`, `transform-origin: 0 0`) onto any four
 * corners, perspective included, so a flat logo can sit on the trailer's side as the camera sees it
 * (Heckbert's square-to-quad mapping).
 */
export function quadToMatrix3d(width: number, height: number, [p0, p1, p2, p3]: Quad) {
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = det === 0 ? 0 : (dx3 * dy2 - dx2 * dy3) / det;
  const h = det === 0 ? 0 : (dx1 * dy3 - dx3 * dy1) / det;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;
  return `matrix3d(${a / width},${d / width},0,${g / width},${b / height},${e / height},0,${h / height},0,0,1,0,${p0.x},${p0.y},0,1)`;
}
