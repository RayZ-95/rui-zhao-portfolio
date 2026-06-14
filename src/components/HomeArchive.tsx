"use client";

import gsap from "gsap";
import Link from "next/link";
import { GlassBrandName } from "./GlassBrandName";
import { HomeUnicornBackground } from "./HomeUnicornBackground";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { encodePublicAssetPath } from "@/lib/content";
import type { HomeArchiveItem } from "@/lib/resolve-design-projects";

type ArchiveLayer = {
  title: string;
  label: string;
  slug: string;
  coverImage: string;
  tone: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  opacity: number;
  blur: number;
  halftone: number;
};

const layerTones = [
  "#eef3f2",
  "#f3f0e9",
  "#f6eeee",
  "#e9eef7",
  "#f4f4f4",
  "#eef1e7",
  "#f0f2ee",
  "#ebe8f0",
  "#f5f0ea",
  "#e8f0f2",
  "#f2ece8",
  "#eceff4",
  "#f1f3ef",
  "#eaeef2",
  "#f3f1ec",
  "#e9ece8"
];

const ARCHIVE_IMAGE_SCALE = 0.78;
const ARCHIVE_GROUP_Y_OFFSET = 0.55;

function buildArchiveLayers(layerItems: HomeArchiveItem[]): ArchiveLayer[] {
  const total = layerItems.length;
  if (total === 0) return [];
  const xStep = 0.46 * ARCHIVE_IMAGE_SCALE;
  const yStep = 0.33 * ARCHIVE_IMAGE_SCALE;
  const zStep = 0.24 * ARCHIVE_IMAGE_SCALE;
  const center = (total - 1) / 2;

  return layerItems.map((item, index) => ({
    ...item,
    tone: layerTones[index % layerTones.length],
    x: (index - center) * xStep,
    y: (index - center) * yStep,
    z: (center - index) * zStep,
    w: 2.2 * ARCHIVE_IMAGE_SCALE,
    h: 1.65 * ARCHIVE_IMAGE_SCALE,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    opacity: 1,
    blur: 0,
    halftone: 0
  }));
}

const CARD_DEPTH = 0.055 * ARCHIVE_IMAGE_SCALE;

type ArchiveCard = THREE.Group & {
  userData: {
    index: number;
    cardMesh: THREE.Mesh;
    frontMaterial: THREE.MeshBasicMaterial;
    planeW: number;
    planeH: number;
  };
};

function createCardMaterials(layer: ArchiveLayer, frontTexture: THREE.Texture) {
  const edge = new THREE.Color(layer.tone);
  const side = new THREE.MeshBasicMaterial({ color: edge });
  const back = new THREE.MeshBasicMaterial({ color: edge.clone().multiplyScalar(0.9) });
  const front = new THREE.MeshBasicMaterial({
    map: frontTexture,
    transparent: false,
    opacity: 1
  });

  return {
    front,
    materials: [side, side, side, side, front, back] as THREE.MeshBasicMaterial[]
  };
}

function createArchiveCard(
  layer: ArchiveLayer,
  index: number,
  planeW: number,
  planeH: number,
  frontTexture: THREE.Texture
): ArchiveCard {
  const group = new THREE.Group() as ArchiveCard;
  const { front, materials } = createCardMaterials(layer, frontTexture);
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(planeW, planeH, CARD_DEPTH), materials);
  group.add(mesh);
  group.userData = { index, cardMesh: mesh, frontMaterial: front, planeW, planeH };
  group.renderOrder = index;
  return group;
}

function resizeArchiveCard(card: ArchiveCard, planeW: number, planeH: number) {
  const mesh = card.userData.cardMesh;
  mesh.geometry.dispose();
  mesh.geometry = new THREE.BoxGeometry(planeW, planeH, CARD_DEPTH);
  card.userData.planeW = planeW;
  card.userData.planeH = planeH;
}

function getCardMaterials(card: ArchiveCard) {
  return card.userData.cardMesh.material as THREE.MeshBasicMaterial[];
}

function setArchiveCardOpacity(card: ArchiveCard, opacity: number) {
  getCardMaterials(card).forEach((material) => {
    material.transparent = opacity < 0.995;
    material.opacity = opacity;
    material.needsUpdate = true;
  });
}

function disposeArchiveCard(card: ArchiveCard) {
  const mesh = card.userData.cardMesh;
  mesh.geometry.dispose();
  getCardMaterials(card).forEach((material) => {
    material.map?.dispose();
    material.dispose();
  });
}

function getFocusFitScale(
  planeW: number,
  planeH: number,
  camera: THREE.PerspectiveCamera,
  cameraZ: number,
  layoutScale: number,
  cardZ: number
) {
  const fovRad = (camera.fov * Math.PI) / 180;
  const cardWorldZ = cardZ * layoutScale;
  const dist = Math.max(cameraZ - cardWorldZ, 2.8);
  const visibleH = 2 * Math.tan(fovRad / 2) * dist;
  const visibleW = visibleH * camera.aspect;
  const pad = 0.9;
  const scaleW = (visibleW * pad) / (planeW * layoutScale);
  const scaleH = (visibleH * pad) / (planeH * layoutScale);
  return Math.min(scaleW, scaleH);
}

const indexRows = [
  ["Research", "Digital Fashion Marketing", "DPPs / digital twins / consumer value"],
  ["Research", "AI in Fashion Education", "Pedagogy / creativity / digital literacy"],
  ["Research", "Cultural Heritage & Design", "Historical dress / textile technology / virtual heritage"],
  ["Publication", "Consumer Acceptance of Digital Product Passports", "Sustainability, 2025"],
  ["Publication", "Mapping 3D Design System to DPP Requirements", "Research Journal of Textile and Apparel, 2026"],
  ["Design", "Reimagining the Chiton", "Zero-waste knitwear / digital innovation"],
  ["Teaching", "Retail Buying and Management", "Instructor, LSU, Fall 2025"],
  ["Download", "Curriculum Vitae", "PDF and web CV"],
  ["Download", "Portfolio", "PDF portfolio"]
];

function drawHalftone(ctx: CanvasRenderingContext2D, width: number, height: number, strength: number) {
  const step = 7;
  const dot = 1.6;
  ctx.save();
  ctx.fillStyle = `rgba(12, 12, 12, ${0.1 * strength})`;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if ((x / step + y / step) % 2 === 0) ctx.fillRect(x, y, dot, dot);
    }
  }
  ctx.restore();
}

function drawEdgeMask(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createRadialGradient(width * 0.5, height * 0.52, width * 0.18, width * 0.5, height * 0.5, width * 0.62);
  gradient.addColorStop(0, "rgba(255,255,255,0)");
  gradient.addColorStop(0.72, "rgba(255,255,255,0)");
  gradient.addColorStop(1, "rgba(222,222,230,0.88)");
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function drawLayerArt(ctx: CanvasRenderingContext2D, layer: ArchiveLayer, width: number, height: number) {
  ctx.fillStyle = layer.tone;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.22;
  for (let i = 0; i < 14; i += 1) {
    ctx.strokeStyle = i % 2 ? "#111" : "#ffffff";
    ctx.lineWidth = 1;
    ctx.strokeRect(72 + i * 16, 64 + i * 11, 520 + i * 3, 310 + i * 2);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#111111";
  ctx.font = "38px Helvetica Neue, Arial, sans-serif";
  ctx.fillText(layer.label.toUpperCase(), 54, 78);
  ctx.font = "62px Helvetica Neue, Arial, sans-serif";
  const words = layer.title.split(" ");
  let line = "";
  let y = 430;
  words.forEach((word) => {
    const nextLine = `${line}${word} `;
    if (ctx.measureText(nextLine).width > 830) {
      ctx.fillText(line, 54, y);
      line = `${word} `;
      y += 72;
    } else {
      line = nextLine;
    }
  });
  ctx.fillText(line, 54, y);
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  if (layer.halftone > 0) drawHalftone(ctx, width, height, layer.halftone);
  drawEdgeMask(ctx, width, height);
}

const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 640;

type LayerTextureResult = {
  texture: THREE.Texture;
  planeW: number;
  planeH: number;
};

function getPhotoPlaneSize(pixelW: number, pixelH: number) {
  const aspect = pixelW / pixelH;
  const pxMax = Math.max(pixelW, pixelH);
  const scale = THREE.MathUtils.clamp(pxMax / 1800, 0.72, 1.18);
  const longest = 2.25 * scale * ARCHIVE_IMAGE_SCALE;

  if (aspect >= 1) {
    return { planeW: longest, planeH: longest / aspect };
  }

  return { planeW: longest * aspect, planeH: longest };
}

function finalizePhotoTexture(source: HTMLCanvasElement) {
  const output = document.createElement("canvas");
  output.width = source.width;
  output.height = source.height;
  const ctx = output.getContext("2d");

  if (!ctx) {
    const texture = new THREE.CanvasTexture(source);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const width = output.width;
  const height = output.height;
  ctx.drawImage(source, 0, 0, width, height);

  const milkyGradient = ctx.createLinearGradient(0, 0, width, height);
  milkyGradient.addColorStop(0, "rgba(255, 255, 255, 0.22)");
  milkyGradient.addColorStop(0.48, "rgba(255, 255, 255, 0.08)");
  milkyGradient.addColorStop(1, "rgba(232, 226, 214, 0.16)");
  ctx.fillStyle = milkyGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.92)";
  ctx.lineWidth = Math.max(6, width * 0.009);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, width - ctx.lineWidth, height - ctx.lineWidth);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.045;
  ctx.fillStyle = "#ffffff";
  for (let y = 0; y < height; y += 5) {
    for (let x = 0; x < width; x += 5) {
      if ((x * 13 + y * 7) % 23 < 9) ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(output);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function finalizeTexture(layer: ArchiveLayer, source: HTMLCanvasElement) {
  const output = document.createElement("canvas");
  output.width = TEXTURE_WIDTH;
  output.height = TEXTURE_HEIGHT;
  const outputCtx = output.getContext("2d");
  if (!outputCtx) return new THREE.CanvasTexture(source);

  if (layer.blur > 0.08) {
    const scale = 1 - layer.blur * 0.38;
    const offsetX = (TEXTURE_WIDTH * (1 - scale)) / 2;
    const offsetY = (TEXTURE_HEIGHT * (1 - scale)) / 2;
    outputCtx.filter = `blur(${layer.blur * 5.5}px) saturate(${1 - layer.blur * 0.22})`;
    outputCtx.drawImage(source, offsetX, offsetY, TEXTURE_WIDTH * scale, TEXTURE_HEIGHT * scale);
    outputCtx.filter = "none";
    outputCtx.globalAlpha = 0.92;
    outputCtx.drawImage(source, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
    outputCtx.globalAlpha = 1;
  } else {
    outputCtx.drawImage(source, 0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  }

  const texture = new THREE.CanvasTexture(output);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlaceholderTexture(layer: ArchiveLayer): LayerTextureResult {
  const source = document.createElement("canvas");
  source.width = TEXTURE_WIDTH;
  source.height = TEXTURE_HEIGHT;
  const sourceCtx = source.getContext("2d");
  if (!sourceCtx) {
    return {
      texture: new THREE.CanvasTexture(source),
      planeW: layer.w,
      planeH: layer.h
    };
  }

  drawLayerArt(sourceCtx, layer, TEXTURE_WIDTH, TEXTURE_HEIGHT);
  return {
    texture: finalizeTexture(layer, source),
    planeW: layer.w,
    planeH: layer.h
  };
}

function createLayerTexture(layer: ArchiveLayer): Promise<LayerTextureResult> {
  if (!layer.coverImage) {
    return Promise.resolve(createPlaceholderTexture(layer));
  }

  return new Promise((resolve) => {
    const source = document.createElement("canvas");
    const sourceCtx = source.getContext("2d");
    if (!sourceCtx) {
      resolve(createPlaceholderTexture(layer));
      return;
    }

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const maxSide = 1400;
      let drawSource: CanvasImageSource = image;
      let drawW = image.width;
      let drawH = image.height;

      if (Math.max(drawW, drawH) > maxSide) {
        const scale = maxSide / Math.max(drawW, drawH);
        drawW = Math.max(1, Math.round(image.width * scale));
        drawH = Math.max(1, Math.round(image.height * scale));
        const resized = document.createElement("canvas");
        resized.width = drawW;
        resized.height = drawH;
        const resizedCtx = resized.getContext("2d");
        if (resizedCtx) {
          resizedCtx.drawImage(image, 0, 0, drawW, drawH);
          drawSource = resized;
        }
      }

      const aspect = drawW / drawH;
      const { planeW, planeH } = getPhotoPlaneSize(drawW, drawH);
      const texW = TEXTURE_WIDTH;
      const texH = Math.max(1, Math.round(texW / aspect));
      source.width = texW;
      source.height = texH;
      sourceCtx.drawImage(drawSource, 0, 0, texW, texH);
      resolve({
        texture: finalizePhotoTexture(source),
        planeW,
        planeH
      });
    };
    image.onerror = () => {
      source.width = TEXTURE_WIDTH;
      source.height = TEXTURE_HEIGHT;
      drawLayerArt(sourceCtx, layer, TEXTURE_WIDTH, TEXTURE_HEIGHT);
      resolve({
        texture: finalizeTexture(layer, source),
        planeW: layer.w,
        planeH: layer.h
      });
    };
    image.src = encodePublicAssetPath(layer.coverImage);
  });
}

type PullState = {
  z: number;
  scale: number;
  dim: number;
  rotMix: number;
  centerX: number;
  centerY: number;
  planeW: number;
  planeH: number;
  opacity: number;
};

type SceneState = {
  group: THREE.Group;
  meshes: ArchiveCard[];
  floats: { x: number; y: number }[];
  pulls: PullState[];
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  layoutScale: number;
};

function getLayoutScale(width: number, height: number) {
  const fit = Math.min(width / 360, height / 500);
  if (width < 768) {
    return THREE.MathUtils.clamp(fit * 0.93, 0.64, 1.05);
  }
  return THREE.MathUtils.clamp(fit * 1.133, 0.787, 1.488);
}

function getCameraBaseZ(layoutScale: number, width: number) {
  const mobileBoost = width < 768 ? 1.45 : 1;
  return (12.2 / Math.sqrt(layoutScale)) * mobileBoost;
}

function getMobileGroupY(width: number, scale: number) {
  return (width < 768 ? 0.28 : ARCHIVE_GROUP_Y_OFFSET) * scale;
}

export function HomeArchive({ items }: { items: HomeArchiveItem[] }) {
  const layers = useMemo(() => buildArchiveLayers(items), [items]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const sceneStateRef = useRef<SceneState | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef(new THREE.Vector2(0, 0));
  const browseRef = useRef(0);
  const targetBrowseRef = useRef(0);
  const touchStartRef = useRef<number | null>(null);
  const selectedIndexRef = useRef(-1);
  const modeRef = useRef<"visual" | "index">("visual");
  const [loaded] = useState(true);
  const [mode] = useState<"visual" | "index">("visual");
  const [focusedLayer, setFocusedLayer] = useState<{ title: string; slug: string } | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const container = sceneRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !loaded || layers.length === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
    camera.position.set(0, 0, 12.2);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearColor(0x000000, 0);

    const group = new THREE.Group();
    group.rotation.set(0, 0, 0);
    scene.add(group);

    const floats = layers.map(() => ({ x: 0, y: 0 }));
    const pulls = layers.map((layer) => ({
      z: 0,
      scale: 1,
      dim: 1,
      rotMix: 0,
      centerX: 0,
      centerY: 0,
      planeW: layer.w,
      planeH: layer.h,
      opacity: 1
    }));
    const raycaster = new THREE.Raycaster();
    const pickMouse = new THREE.Vector2();

    const meshes = layers.map((layer, index) => {
      const placeholder = createPlaceholderTexture(layer);
      const card = createArchiveCard(layer, index, placeholder.planeW, placeholder.planeH, placeholder.texture);
      card.position.set(layer.x, layer.y, layer.z - 2.8);
      card.rotation.set(layer.rotX, layer.rotY, layer.rotZ);
      group.add(card);
      return card;
    });

    let layoutScale = 1;
    sceneStateRef.current = { group, meshes, floats, pulls, renderer, camera, layoutScale };

    let texturesCancelled = false;
    Promise.all(layers.map((layer) => createLayerTexture(layer))).then((results) => {
      if (texturesCancelled) {
        results.forEach((result) => result.texture.dispose());
        return;
      }
      meshes.forEach((card, index) => {
        const result = results[index];
        resizeArchiveCard(card, result.planeW, result.planeH);
        card.userData.frontMaterial.map?.dispose();
        card.userData.frontMaterial.map = result.texture;
        card.userData.frontMaterial.needsUpdate = true;
        pulls[index].planeW = result.planeW;
        pulls[index].planeH = result.planeH;
      });
    });

    meshes.forEach((card, index) => {
      const layer = layers[index];
      gsap.to(card.position, {
        x: layer.x,
        y: layer.y,
        z: layer.z,
        duration: 1.1,
        delay: index * 0.14,
        ease: "power2.out"
      });
      gsap.to(card.rotation, {
        x: layer.rotX,
        y: layer.rotY,
        z: layer.rotZ,
        duration: 2.1,
        delay: index * 0.045,
        ease: "power3.out"
      });
    });

    const pointer = pointerRef.current;
    const handlePointer = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const applyLayout = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      layoutScale = getLayoutScale(width, height);
      camera.aspect = width / height;
      camera.fov = width < 768 ? 42 : 36;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      group.scale.setScalar(layoutScale);
      if (selectedIndexRef.current < 0) {
        group.position.x = width < 768 ? 0.35 * layoutScale : 1.1 * layoutScale;
        group.position.y = getMobileGroupY(width, layoutScale);
      }

      const state = sceneStateRef.current;
      if (state) state.layoutScale = layoutScale;
    };

    const clearSelection = () => {
      if (selectedIndexRef.current < 0) return;
      selectedIndexRef.current = -1;
      setFocusedLayer(null);
    };

    const applyBrowseDelta = (delta: number, kind: "wheel" | "touch") => {
      const layerFactor = Math.max(layers.length / 12, 1);
      const sensitivity = kind === "wheel" ? 0.0016 * layerFactor : 0.0032 * layerFactor;
      targetBrowseRef.current = THREE.MathUtils.clamp(
        targetBrowseRef.current - delta * sensitivity,
        0,
        1
      );
    };

    const handleWheel = (event: WheelEvent) => {
      if (modeRef.current !== "visual") return;
      const bounds = container.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      ) {
        return;
      }

      event.preventDefault();
      clearSelection();
      applyBrowseDelta(event.deltaY, "wheel");
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (modeRef.current !== "visual") return;
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (modeRef.current !== "visual" || touchStartRef.current === null) return;
      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) return;
      const delta = touchStartRef.current - currentY;
      touchStartRef.current = currentY;
      event.preventDefault();
      clearSelection();
      applyBrowseDelta(delta, "touch");
    };

    const focusLayer = (index: number) => {
      const nextIndex = selectedIndexRef.current === index ? -1 : index;
      selectedIndexRef.current = nextIndex;
      if (nextIndex === -1) {
        setFocusedLayer(null);
        return;
      }
      const layer = layers[nextIndex];
      setFocusedLayer({ title: layer.title, slug: layer.slug });
    };

    const handleClick = (event: PointerEvent) => {
      if (modeRef.current !== "visual") return;
      const bounds = container.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) return;

      pickMouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pickMouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pickMouse, camera);

      const hits = raycaster.intersectObjects(meshes, true);
      if (hits.length > 0) {
        let node: THREE.Object3D | null = hits[0].object;
        while (node && node.userData.index === undefined) {
          node = node.parent;
        }
        if (node?.userData.index !== undefined) {
          focusLayer(node.userData.index as number);
        }
      } else {
        selectedIndexRef.current = -1;
        setFocusedLayer(null);
      }
    };

    applyLayout();
    const resizeObserver = new ResizeObserver(applyLayout);
    resizeObserver.observe(container);
    container.addEventListener("pointermove", handlePointer);
    container.addEventListener("click", handleClick);
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });

    const animate = () => {
      const state = sceneStateRef.current;
      if (state) {
        const { group: g, meshes: ms, pulls: pl, layoutScale: scale } = state;
        const visual = modeRef.current === "visual";
        const width = container.clientWidth;
        const selected = selectedIndexRef.current;
        const hasSelection = selected >= 0;

        browseRef.current += (targetBrowseRef.current - browseRef.current) * 0.07;
        const browse = browseRef.current;
        const baseZ = getCameraBaseZ(scale, width);
        const travel = visual ? Math.max(layers.length * 0.11, 5.8) : 3.8;
        const focusIndex = browse * Math.max(layers.length - 1, 1);
        const browseLayer = layers[Math.round(focusIndex)] ?? layers[0];
        const focusPullZ = 2.1;
        const cameraTargetX = hasSelection ? 0 : -browseLayer.x * 0.18;
        const cameraTargetY = hasSelection ? 0 : -browseLayer.y * 0.18;
        const cameraTargetZ = hasSelection ? baseZ - 1.2 : baseZ - travel * browse;
        const targetGroupX = hasSelection ? 0 : width < 768 ? 0.35 * scale : 1.1 * scale;
        const targetGroupY = hasSelection ? 0 : getMobileGroupY(width, scale);

        camera.position.x += (cameraTargetX - camera.position.x) * 0.08;
        camera.position.y += (cameraTargetY - camera.position.y) * 0.08;
        camera.position.z += (cameraTargetZ - camera.position.z) * 0.08;
        g.position.x += (targetGroupX - g.position.x) * 0.08;
        g.position.y += (targetGroupY - g.position.y) * 0.08;

        g.rotation.x += (0 - g.rotation.x) * 0.08;
        g.rotation.y += (0 - g.rotation.y) * 0.08;
        g.rotation.z += (0 - g.rotation.z) * 0.08;

        ms.forEach((card, index) => {
          const layer = layers[index];
          const isSelected = selected === index;
          const sequenceOffset = hasSelection || isSelected ? 0 : (focusIndex - index) * 0.1;
          const targetPullZ = isSelected ? focusPullZ : hasSelection ? -2.2 : 0;
          const fitScale = isSelected
            ? getFocusFitScale(
                pl[index].planeW,
                pl[index].planeH,
                camera,
                cameraTargetZ,
                scale,
                focusPullZ
              )
            : 1;
          const targetScale = isSelected ? fitScale : hasSelection ? 0.5 : 1;
          const targetRotMix = isSelected ? 1 : 0;
          const targetCenterX = isSelected ? -layer.x : 0;
          const targetCenterY = isSelected ? -layer.y : 0;
          const targetOpacity = isSelected ? 1 : hasSelection ? 0.05 : 1;

          pl[index].z += (targetPullZ - pl[index].z) * 0.1;
          pl[index].scale += (targetScale - pl[index].scale) * 0.1;
          pl[index].rotMix += (targetRotMix - pl[index].rotMix) * 0.1;
          pl[index].centerX += (targetCenterX - pl[index].centerX) * 0.1;
          pl[index].centerY += (targetCenterY - pl[index].centerY) * 0.1;
          pl[index].opacity += (targetOpacity - pl[index].opacity) * 0.12;

          const targetX = layer.x + pl[index].centerX;
          const targetY = layer.y + pl[index].centerY;
          const targetZ = isSelected ? pl[index].z : layer.z + sequenceOffset + pl[index].z;

          card.position.x += (targetX - card.position.x) * 0.07;
          card.position.y += (targetY - card.position.y) * 0.07;
          card.position.z += (targetZ - card.position.z) * 0.08;
          card.scale.set(pl[index].scale, pl[index].scale, 1);
          card.renderOrder = isSelected ? 100 : hasSelection ? 0 : index;
          card.visible = !hasSelection || isSelected;

          const rotMix = pl[index].rotMix;
          card.rotation.x += (layer.rotX * (1 - rotMix) - card.rotation.x) * 0.09;
          card.rotation.y += (layer.rotY * (1 - rotMix) - card.rotation.y) * 0.09;
          card.rotation.z += (layer.rotZ * (1 - rotMix) - card.rotation.z) * 0.09;

          if (visual) {
            setArchiveCardOpacity(card, pl[index].opacity);
          }
        });
      }

      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointer);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheel);
      texturesCancelled = true;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      gsap.killTweensOf([group, ...meshes, ...meshes.flatMap((card) => getCardMaterials(card)), ...floats]);
      renderer.dispose();
      meshes.forEach((card) => disposeArchiveCard(card));
      sceneStateRef.current = null;
    };
  }, [loaded, layers]);

  useEffect(() => {
    const state = sceneStateRef.current;
    if (!state || !loaded || layers.length === 0) return;

    const { group, meshes } = state;
    const cardMaterials = meshes.flatMap((card) => getCardMaterials(card));
    const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    if (mode === "index") {
      selectedIndexRef.current = -1;
      setFocusedLayer(null);
      timeline
        .to(group.position, { z: -1.6, duration: 1.1 }, 0)
        .to(group.rotation, { x: -0.04, y: 0.18, duration: 1.1 }, 0)
        .to(
          meshes.map((mesh) => mesh.position),
          {
            x: (index: number) => layers[index].x,
            y: (index: number) => layers[index].y,
            z: (index: number) => layers[index].z - 2.2,
            duration: 1,
            stagger: 0.05
          },
          0
        )
        .to(
          cardMaterials,
          {
            opacity: 0.08,
            duration: 0.85,
            stagger: 0.04,
            onStart() {
              cardMaterials.forEach((material) => {
                material.transparent = true;
              });
            }
          },
          0
        );
    } else {
      timeline
        .to(group.position, { z: 0, duration: 1.35 }, 0)
        .to(group.rotation, { x: 0, y: 0, z: 0, duration: 1.35 }, 0)
        .to(
          meshes.map((mesh) => mesh.position),
          {
            x: (index: number) => layers[index].x,
            y: (index: number) => layers[index].y,
            z: (index: number) => layers[index].z,
            duration: 1.25,
            stagger: 0.06
          },
          0
        )
        .to(
          cardMaterials,
          {
            opacity: 1,
            duration: 1.1,
            stagger: 0.05,
            onStart() {
              cardMaterials.forEach((material) => {
                material.transparent = false;
              });
            }
          },
          0.08
        );
    }

    return () => {
      timeline.kill();
    };
  }, [mode, loaded, layers]);

  return (
    <main className="site-main site-main--home relative h-[100dvh] w-full overflow-hidden">
      <HomeUnicornBackground />
      <section
        className={`fixed inset-0 z-10 flex h-[100dvh] w-full items-center justify-center overflow-y-auto px-4 transition-opacity duration-700 ease-out ${
          mode === "index" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="w-full max-w-5xl py-8 pl-[calc(var(--side-nav-width)+0.75rem)] pr-3 pt-[max(2rem,env(safe-area-inset-top))] md:py-10 md:pl-[calc(var(--side-nav-width)+1rem)] md:pr-4">
          <div className="archive-grid pb-6 text-[10px] uppercase text-[#111]">
            <span>Area</span>
            <span>Entry</span>
            <span>Context</span>
          </div>
          {indexRows.map(([area, entry, context]) => (
            <div className="archive-grid border-t border-[#e2e2e2] py-2 text-[11px] uppercase" key={`${area}-${entry}`}>
              <span className="text-[#9a9a9a]">{area}</span>
              <span>{entry}</span>
              <span className="text-[#777]">{context}</span>
            </div>
          ))}
          <div className="mt-7 flex gap-2">
            <Link className="ui-button px-4 py-3 uppercase" href="/cv">
              Web CV
            </Link>
            <a className="ui-button px-4 py-3 uppercase" href="/downloads/rui-zhao-cv.pdf">
              Download CV
            </a>
            <a className="ui-button px-4 py-3 uppercase" href="/downloads/rui-zhao-portfolio.pdf">
              Download Portfolio
            </a>
          </div>
        </div>
      </section>

      <section
        className={`home-visual fixed inset-0 z-10 h-[100dvh] w-full transition-opacity duration-700 ease-out ${
          mode === "visual" ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className="home-visual__canvas absolute inset-0 h-full w-full cursor-pointer overflow-hidden"
          ref={sceneRef}
        >
          <canvas className="absolute inset-0 h-full w-full" ref={canvasRef} />
          {focusedLayer ? (
            <div className="pointer-events-auto absolute bottom-14 right-3 z-20 max-w-[220px] md:bottom-16 md:right-4 md:max-w-xs">
              <p className="mb-2 text-[10px] uppercase leading-snug text-[#111]">{focusedLayer.title}</p>
              <Link
                className="ui-button inline-block px-3 py-2 text-[10px] uppercase"
                href={`/design/${focusedLayer.slug}`}
              >
                View in Design Archive
              </Link>
            </div>
          ) : null}
          <p className="pointer-events-none absolute bottom-3 right-3 z-20 text-[9px] uppercase tracking-wide text-[#aaa] md:bottom-4 md:right-4">
            Scroll depth · Click card to view · Click empty to close
          </p>
        </div>

        <div className="home-hero-copy pointer-events-none absolute left-[calc(var(--side-nav-width)+0.75rem)] top-[max(2.25rem,env(safe-area-inset-top))] z-20 md:left-[calc(var(--side-nav-width)+1rem)] md:top-12">
          <h1 className="leading-[0.9]">
            <GlassBrandName>Rui Zhao</GlassBrandName>
          </h1>
          <div className="home-hero-module mt-2 md:mt-3">
            <p className="home-hero-section-title">About me</p>
            <p className="home-hero-body">
              Hi, I&apos;m Rui Zhao, a Ph.D. candidate in Fashion Merchandising at Louisiana State University. With a
              background in fashion design, my research explores how technological innovation is transforming the ways
              fashion products are designed, communicated, and experienced.
            </p>
            <p className="home-hero-body mt-2.5 md:mt-3">
              My research lies at the intersection of digital fashion, consumer behavior, artificial intelligence, and
              textile and dress heritage preservation. I am particularly interested in investigating how emerging
              technologies can advance sustainability, improve transparency, enhance consumer engagement, and foster
              both design innovation and cultural heritage preservation across the fashion industry.
            </p>
          </div>

          <div className="home-hero-module mt-5 md:mt-6">
            <p className="home-hero-section-title">Research Interests</p>
            <p className="home-hero-body">
              Digital Fashion Innovation · Sustainable · Consumer Behavior · Artificial Intelligence · AI-Assisted Design · Textile Heritage
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
