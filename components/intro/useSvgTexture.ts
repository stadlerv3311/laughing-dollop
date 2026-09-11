import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";

/** Rasterizes an SVG (the logo) into a crisp texture at the given pixel width. */
export function useSvgTexture(url: string, pixelWidth: number) {
  const gl = useThree((state) => state.gl);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    let created: THREE.CanvasTexture | null = null;

    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      const canvas = document.createElement("canvas");
      canvas.width = pixelWidth;
      canvas.height = Math.round((pixelWidth * image.naturalHeight) / image.naturalWidth);
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);

      created = new THREE.CanvasTexture(canvas);
      created.colorSpace = THREE.SRGBColorSpace;
      created.anisotropy = gl.capabilities.getMaxAnisotropy();
      setTexture(created);
    };
    image.src = url;

    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [url, pixelWidth, gl]);

  return texture;
}
