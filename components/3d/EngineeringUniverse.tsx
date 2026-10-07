"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Html, Line, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { ArrowUpRight, Sparkles } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/* -------------------------------------------------------------------------- */

type Category =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Security"
  | "Integrations"
  | "DevOps";

interface UniverseNode {
  id: string;
  name: string;
  category: Category;
  color: string;
  connections: string[];
  description: string;
  productionRole: string;
  ring: 0 | 1;
  slot: number;
}

const CATEGORIES: Category[] = [
  "Frontend",
  "Backend",
  "Database",
  "Security",
  "Integrations",
  "DevOps",
];

const UNIVERSE_NODES: UniverseNode[] = [
  {
    id: "react",
    name: "React.js",
    category: "Frontend",
    color: "#38BDF8",
    connections: ["typescript", "redux", "express", "leaflet"],
    description:
      "Component-driven single page interfaces with optimized virtual DOM lifecycle.",
    productionRole: "Core Client Platform",
    ring: 0,
    slot: 0,
  },
  {
    id: "node",
    name: "Node.js",
    category: "Backend",
    color: "#22C55E",
    connections: ["express", "nginx"],
    description:
      "Event-driven asynchronous runtime delivering high-throughput concurrent I/O.",
    productionRole: "Server Runtime",
    ring: 0,
    slot: 1,
  },
  {
    id: "express",
    name: "Express.js",
    category: "Backend",
    color: "#CF8047",
    connections: ["react", "node", "jwt", "rbac", "prisma", "payu", "leaflet"],
    description:
      "Modular REST API routing, controller services, centralized error handlers.",
    productionRole: "Application Gateway",
    ring: 0,
    slot: 2,
  },
  {
    id: "postgres",
    name: "PostgreSQL",
    category: "Database",
    color: "#3B82F6",
    connections: ["prisma"],
    description:
      "ACID-compliant relational database with foreign keys, indexes, and transactional safety.",
    productionRole: "Primary Relational Storage",
    ring: 0,
    slot: 3,
  },
  {
    id: "payu",
    name: "PayU Gateway",
    category: "Integrations",
    color: "#B15F2C",
    connections: ["express"],
    description:
      "E-commerce checkout transactions with server-side SHA512 hash verification.",
    productionRole: "Payment Processing",
    ring: 0,
    slot: 4,
  },
  {
    id: "mongo",
    name: "MongoDB",
    category: "Database",
    color: "#10B981",
    connections: ["express"],
    description:
      "Document storage and aggregation pipelines for flexible temporal data models.",
    productionRole: "Document Store",
    ring: 0,
    slot: 5,
  },
  {
    id: "nginx",
    name: "Nginx & Linux",
    category: "DevOps",
    color: "#A855F7",
    connections: ["node", "express"],
    description:
      "Reverse proxy load routing, SSL termination, and static asset distribution on Contabo VPS.",
    productionRole: "Production Web Server",
    ring: 0,
    slot: 6,
  },
  {
    id: "leaflet",
    name: "Leaflet.js",
    category: "Integrations",
    color: "#84CC16",
    connections: ["react", "express"],
    description:
      "Interactive real-time geospatial rendering with custom polylines and live staff pins.",
    productionRole: "GPS Telemetry Mapping",
    ring: 0,
    slot: 7,
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    color: "#3178C6",
    connections: ["react", "express", "prisma"],
    description:
      "Strict static typing, interfaces, and end-to-end data contracts across client & server.",
    productionRole: "Type Integrity",
    ring: 0,
    slot: 8,
  },
  {
    id: "redux",
    name: "Redux Toolkit",
    category: "Frontend",
    color: "#764ABC",
    connections: ["react"],
    description:
      "Centralized immutable store slices, asynchronous thunks, and cache invalidation.",
    productionRole: "Global State Management",
    ring: 1,
    slot: 0,
  },
  {
    id: "jwt",
    name: "JWT & Security",
    category: "Security",
    color: "#F59E0B",
    connections: ["express", "rbac"],
    description:
      "Cryptographic token signing, stateless auth, and protected API endpoint guards.",
    productionRole: "Session & Token Security",
    ring: 1,
    slot: 1,
  },
  {
    id: "rbac",
    name: "4-Tier RBAC",
    category: "Security",
    color: "#EAB308",
    connections: ["jwt", "express"],
    description:
      "Multi-role organizational boundaries for Admin, HR, Manager, and Employee tiers.",
    productionRole: "Authorization Matrix",
    ring: 1,
    slot: 2,
  },
  {
    id: "prisma",
    name: "Prisma ORM",
    category: "Database",
    color: "#06B6D4",
    connections: ["express", "postgres"],
    description:
      "Declarative data modeling, automated schema migrations, and type-safe query generation.",
    productionRole: "ORM Layer",
    ring: 1,
    slot: 3,
  },
];

const NODE_BY_ID = new Map(UNIVERSE_NODES.map((n) => [n.id, n]));

const NEIGHBORS: Map<string, Set<string>> = (() => {
  const m = new Map<string, Set<string>>();
  UNIVERSE_NODES.forEach((n) => m.set(n.id, new Set()));
  UNIVERSE_NODES.forEach((n) =>
    n.connections.forEach((c) => {
      m.get(n.id)?.add(c);
      m.get(c)?.add(n.id);
    }),
  );
  return m;
})();

/* -------------------------------------------------------------------------- */
/*  Orbit layout                                                              */
/* -------------------------------------------------------------------------- */

const TAU = Math.PI * 2;

const RINGS = [
  { radius: 3.25, tilt: [-0.95, 0, 0.1] as const, speed: 0.07, offset: 0.35 },
  { radius: 2.55, tilt: [-1.25, 0, 0.5] as const, speed: -0.1, offset: 1.1 },
];
const RING_COUNTS = RINGS.map(
  (_, r) => UNIVERSE_NODES.filter((n) => n.ring === r).length,
);

const DECOR_RINGS = [
  { radius: 3.9, tilt: [-0.7, 0, -0.15] as const, speed: 0.09 },
  { radius: 4.4, tilt: [-0.35, 0, 0.25] as const, speed: -0.06 },
  { radius: 2.9, tilt: [-1.1, 0, -0.6] as const, speed: 0.12 },
];
const SATELLITES = [
  { ring: 0, phase: 0.5, size: 0.075, color: "#8f969c", glow: false },
  { ring: 0, phase: 3.3, size: 0.05, color: "#ff8a3d", glow: true },
  { ring: 1, phase: 1.2, size: 0.09, color: "#a3a9ae", glow: false },
  { ring: 1, phase: 4.4, size: 0.05, color: "#ff8a3d", glow: true },
  { ring: 2, phase: 2.1, size: 0.06, color: "#8f969c", glow: false },
  { ring: 2, phase: 5.0, size: 0.045, color: "#ff8a3d", glow: true },
];

const TILE = 0.78;
const CUBE = 1.9;
const MAX_HIGHLIGHT_SEGMENTS = 10;

function circlePoints(radius: number, n = 160) {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * TAU;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
}

/* -------------------------------------------------------------------------- */
/*  Logo tiles, drawn on canvas                                               */
/* -------------------------------------------------------------------------- */

type Ctx = CanvasRenderingContext2D;
type IconDef = { bg: [string, string]; draw: (c: Ctx) => void };

function rr(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function hexagon(c: Ctx, r: number) {
  c.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 3;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (k === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.closePath();
}

function label(
  c: Ctx,
  text: string,
  size: number,
  color: string,
  y = 0,
  weight = 800,
) {
  c.fillStyle = color;
  c.font = `${weight} ${size}px "Helvetica Neue", Arial, sans-serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, 0, y);
}

const ICONS: Record<string, IconDef> = {
  react: {
    bg: ["#2f7fc4", "#16355f"],
    draw: (c) => {
      c.strokeStyle = "#61DAFB";
      c.lineWidth = 9;
      for (let k = 0; k < 3; k++) {
        c.save();
        c.rotate((k * Math.PI) / 3);
        c.beginPath();
        c.ellipse(0, 0, 84, 32, 0, 0, TAU);
        c.stroke();
        c.restore();
      }
      c.fillStyle = "#61DAFB";
      c.beginPath();
      c.arc(0, 0, 13, 0, TAU);
      c.fill();
    },
  },
  typescript: {
    bg: ["#3f8be0", "#1f4f94"],
    draw: (c) => label(c, "TS", 118, "#ffffff", 6),
  },
  redux: {
    bg: ["#8b5cd0", "#4a2a86"],
    draw: (c) => {
      c.strokeStyle = "#fff";
      c.lineWidth = 12;
      for (let k = 0; k < 3; k++) {
        c.save();
        c.rotate((k * TAU) / 3);
        c.beginPath();
        c.arc(0, -36, 50, Math.PI * 0.2, Math.PI * 1.35);
        c.stroke();
        c.restore();
      }
    },
  },
  express: {
    bg: ["#2c2c2e", "#0a0a0b"],
    draw: (c) => label(c, "ex", 118, "#f2f2f2", -6, 500),
  },
  node: {
    bg: ["#4fa853", "#1d5a2a"],
    draw: (c) => {
      c.strokeStyle = "#fff";
      c.lineWidth = 11;
      hexagon(c, 82);
      c.stroke();
      label(c, "JS", 64, "#fff", 4);
    },
  },
  jwt: {
    bg: ["#f7a822", "#a84e08"],
    draw: (c) => {
      c.fillStyle = "#fff";
      c.beginPath();
      c.moveTo(0, -86);
      c.lineTo(70, -56);
      c.lineTo(70, 8);
      c.bezierCurveTo(70, 52, 34, 76, 0, 92);
      c.bezierCurveTo(-34, 76, -70, 52, -70, 8);
      c.lineTo(-70, -56);
      c.closePath();
      c.fill();
      c.strokeStyle = "#a84e08";
      c.lineWidth = 15;
      c.beginPath();
      c.moveTo(-30, 4);
      c.lineTo(-6, 30);
      c.lineTo(34, -22);
      c.stroke();
    },
  },
  rbac: {
    bg: ["#e8b60f", "#946008"],
    draw: (c) => {
      const widths = [48, 96, 144, 192];
      widths.forEach((w, i) => {
        c.fillStyle = `rgba(255,255,255,${0.55 + i * 0.15})`;
        rr(c, -w / 2, -80 + i * 44, w, 32, 10);
        c.fill();
      });
    },
  },
  prisma: {
    bg: ["#22345c", "#0a1226"],
    draw: (c) => {
      c.fillStyle = "#fff";
      c.beginPath();
      c.moveTo(14, -88);
      c.lineTo(82, 70);
      c.lineTo(8, 90);
      c.lineTo(8, -40);
      c.closePath();
      c.fill();
      c.globalAlpha = 0.65;
      c.beginPath();
      c.moveTo(-6, -64);
      c.lineTo(-6, 76);
      c.lineTo(-76, 56);
      c.closePath();
      c.fill();
      c.globalAlpha = 1;
    },
  },
  postgres: {
    bg: ["#8a66e8", "#3b2587"],
    draw: (c) => {
      c.strokeStyle = "#fff";
      c.lineWidth = 11;
      c.beginPath();
      c.ellipse(0, -52, 68, 24, 0, 0, TAU);
      c.stroke();
      c.beginPath();
      c.moveTo(-68, -52);
      c.lineTo(-68, 52);
      c.moveTo(68, -52);
      c.lineTo(68, 52);
      c.stroke();
      c.beginPath();
      c.ellipse(0, 0, 68, 24, 0, 0, Math.PI);
      c.stroke();
      c.beginPath();
      c.ellipse(0, 52, 68, 24, 0, 0, Math.PI);
      c.stroke();
    },
  },
  mongo: {
    bg: ["#237a45", "#0a2e1c"],
    draw: (c) => {
      c.fillStyle = "#4ade80";
      c.beginPath();
      c.moveTo(0, -94);
      c.bezierCurveTo(56, -40, 58, 34, 0, 92);
      c.bezierCurveTo(-58, 34, -56, -40, 0, -94);
      c.closePath();
      c.fill();
      c.strokeStyle = "#0a2e1c";
      c.lineWidth = 7;
      c.beginPath();
      c.moveTo(0, 96);
      c.lineTo(0, -40);
      c.stroke();
    },
  },
  payu: {
    bg: ["#ffcd2e", "#ef8a00"],
    draw: (c) => label(c, "PayU", 84, "#1b1b1b", 4, 900),
  },
  leaflet: {
    bg: ["#4a8df6", "#1c47c4"],
    draw: (c) => {
      c.fillStyle = "#fff";
      c.beginPath();
      c.arc(0, -24, 54, (150 * Math.PI) / 180, (30 * Math.PI) / 180, false);
      c.lineTo(0, 92);
      c.closePath();
      c.fill();
      c.fillStyle = "#1c47c4";
      c.beginPath();
      c.arc(0, -24, 20, 0, TAU);
      c.fill();
    },
  },
  nginx: {
    bg: ["#30343b", "#0c0e11"],
    draw: (c) => {
      c.fillStyle = "#009639";
      hexagon(c, 84);
      c.fill();
      label(c, "N", 92, "#fff", 4);
    },
  },
};

function iconCanvas(id: string, size = 256) {
  const def = ICONS[id];
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const c = cv.getContext("2d")!;
  c.scale(size / 256, size / 256);

  const g = c.createLinearGradient(0, 0, 256, 256);
  g.addColorStop(0, def.bg[0]);
  g.addColorStop(1, def.bg[1]);
  rr(c, 0, 0, 256, 256, 52);
  c.fillStyle = g;
  c.fill();

  c.save();
  rr(c, 0, 0, 256, 256, 52);
  c.clip();
  const gloss = c.createLinearGradient(0, 0, 0, 150);
  gloss.addColorStop(0, "rgba(255,255,255,0.22)");
  gloss.addColorStop(1, "rgba(255,255,255,0)");
  c.fillStyle = gloss;
  c.fillRect(0, 0, 256, 150);
  c.restore();

  c.save();
  c.translate(128, 128);
  c.lineCap = "round";
  c.lineJoin = "round";
  def.draw(c);
  c.restore();
  return cv;
}

function makeTexture(cv: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function faceCanvas() {
  const W = 768;
  const H = 512;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;

  rr(c, 8, 8, W - 16, H - 16, 52);
  c.fillStyle = "rgba(8,8,10,0.86)";
  c.fill();
  c.lineWidth = 4;
  c.strokeStyle = "rgba(255,138,61,0.6)";
  c.stroke();

  c.textAlign = "left";
  c.textBaseline = "alphabetic";
  c.fillStyle = "#ffffff";
  c.font = '800 96px "Helvetica Neue", Arial, sans-serif';
  c.fillText("Full Stack", 64, 206);
  c.fillStyle = "#cdbba8";
  c.font = '500 34px "Helvetica Neue", Arial, sans-serif';
  c.fillText("React \u2022 Node \u2022 PostgreSQL", 64, 268);

  c.strokeStyle = "rgba(255,255,255,0.14)";
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(64, 316);
  c.lineTo(W - 64, 316);
  c.stroke();

  const grad = c.createLinearGradient(64, 340, 220, 440);
  grad.addColorStop(0, "#ffb27a");
  grad.addColorStop(1, "#ff6a1a");
  c.fillStyle = grad;
  c.font = 'italic 900 104px "Helvetica Neue", Arial, sans-serif';
  c.fillText("AP", 64, 440);
  return cv;
}

function glowCanvas() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 256;
  const c = cv.getContext("2d")!;
  const g = c.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,138,61,0.65)");
  g.addColorStop(0.4, "rgba(255,138,61,0.22)");
  g.addColorStop(1, "rgba(255,138,61,0)");
  c.fillStyle = g;
  c.fillRect(0, 0, 256, 256);
  return cv;
}

/* -------------------------------------------------------------------------- */
/*  3D pieces                                                                 */
/* -------------------------------------------------------------------------- */

function CoreCube({
  cubeRef,
  coreRef,
}: {
  cubeRef: React.RefObject<THREE.Group | null>;
  coreRef: React.RefObject<THREE.Mesh | null>;
}) {
  const textures = useMemo(
    () => ({
      face: makeTexture(faceCanvas()),
      glow: makeTexture(glowCanvas()),
    }),
    [],
  );
  useEffect(
    () => () => {
      textures.face.dispose();
      textures.glow.dispose();
    },
    [textures],
  );

  const edges = useMemo(() => {
    const h = CUBE / 2;
    const corners: [number, number, number][] = [];
    for (const x of [-h, h])
      for (const y of [-h, h]) for (const z of [-h, h]) corners.push([x, y, z]);
    const out: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < corners.length; i++) {
      for (let j = i + 1; j < corners.length; j++) {
        const diff = corners[i].filter((v, k) => v !== corners[j][k]).length;
        if (diff === 1)
          out.push([
            new THREE.Vector3(...corners[i]),
            new THREE.Vector3(...corners[j]),
          ]);
      }
    }
    return out;
  }, []);

  return (
    <>
      <sprite scale={[8.5, 8.5, 1]} position={[0, 0, -1.4]} renderOrder={-1}>
        <spriteMaterial
          map={textures.glow}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </sprite>

      <group ref={cubeRef}>
        <mesh>
          <boxGeometry args={[CUBE, CUBE, CUBE]} />
          <meshPhysicalMaterial
            color="#0b0b0f"
            roughness={0.12}
            metalness={0.45}
            clearcoat={1}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.8}
          />
        </mesh>

        <mesh ref={coreRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#ff6a1a"
            emissive="#ff7a2b"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
        <pointLight color="#ff8a3d" intensity={5} distance={9} />

        {edges.map(([a, b], i) => (
          <React.Fragment key={i}>
            <Line
              points={[a, b]}
              color="#ff8a3d"
              lineWidth={7}
              transparent
              opacity={0.2}
            />
            <Line points={[a, b]} color="#ffa968" lineWidth={2.2} />
          </React.Fragment>
        ))}

        <mesh position={[0, 0, CUBE / 2 + 0.012]}>
          <planeGeometry args={[1.5, 1.0]} />
          <meshBasicMaterial
            map={textures.face}
            transparent
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}

function Platform() {
  return (
    <group position={[0, -2.95, 0]}>
      <mesh rotation-x={-Math.PI / 2}>
        <circleGeometry args={[4.5, 72]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
      {[4.5, 3.4, 2.3].map((r, i) => (
        <Line
          key={r}
          points={circlePoints(r)}
          color="#cbbfae"
          lineWidth={1}
          transparent
          opacity={0.75 - i * 0.15}
        />
      ))}
    </group>
  );
}

function OrbitRings() {
  const rings = useMemo(
    () => ({
      main: RINGS.map((r) => circlePoints(r.radius)),
      decor: DECOR_RINGS.map((r) => circlePoints(r.radius)),
    }),
    [],
  );
  return (
    <>
      {RINGS.map((r, i) => (
        <Line
          key={`m${i}`}
          points={rings.main[i]}
          rotation={[...r.tilt]}
          color={i === 0 ? "#b9ab98" : "#CF8047"}
          lineWidth={1}
          transparent
          opacity={i === 0 ? 0.8 : 0.45}
        />
      ))}
      {DECOR_RINGS.map((r, i) => (
        <Line
          key={`d${i}`}
          points={rings.decor[i]}
          rotation={[...r.tilt]}
          color="#c9bdab"
          lineWidth={0.8}
          transparent
          opacity={0.55}
        />
      ))}
    </>
  );
}

function Satellites({ reducedMotion }: { reducedMotion: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const quats = useMemo(
    () =>
      DECOR_RINGS.map((r) =>
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.tilt)),
      ),
    [],
  );
  const v = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    SATELLITES.forEach((s, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const ring = DECOR_RINGS[s.ring];
      const a = s.phase + t * ring.speed * 2;
      v.set(Math.cos(a) * ring.radius, 0, Math.sin(a) * ring.radius);
      v.applyQuaternion(quats[s.ring]);
      mesh.position.copy(v);
    });
  });

  return (
    <>
      {SATELLITES.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
        >
          <sphereGeometry args={[s.size, 16, 16]} />
          {s.glow ? (
            <meshBasicMaterial color={s.color} toneMapped={false} />
          ) : (
            <meshStandardMaterial
              color={s.color}
              metalness={0.6}
              roughness={0.3}
            />
          )}
        </mesh>
      ))}
    </>
  );
}

function TileBody({
  node,
  texture,
  active,
}: {
  node: UniverseNode;
  texture: THREE.Texture;
  active: boolean;
}) {
  const body = ICONS[node.id].bg[1];
  return (
    <>
      <RoundedBox args={[TILE, TILE, TILE * 0.62]} radius={0.13} smoothness={4}>
        <meshPhysicalMaterial
          color={body}
          roughness={0.4}
          metalness={0.15}
          clearcoat={0.7}
          clearcoatRoughness={0.25}
          emissive={ICONS[node.id].bg[0]}
          emissiveIntensity={active ? 0.5 : 0.06}
        />
      </RoundedBox>
      <mesh position={[0, 0, TILE * 0.31 + 0.004]}>
        <planeGeometry args={[TILE * 0.86, TILE * 0.86]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </>
  );
}

/**
 * Isolated tile component so the <Html> label mounts/unmounts on its own,
 * outside the parent's render cycle. This avoids React 18's
 * "Attempted to synchronously unmount a root while React was already rendering"
 * warning.
 */
function TechTile({
  node,
  index,
  texture,
  active,
  onHover,
  onSelect,
  onOut,
  tileRefs,
  labelRefs,
}: {
  node: UniverseNode;
  index: number;
  texture: THREE.Texture;
  active: boolean;
  onHover: (id: string) => (e: ThreeEvent<PointerEvent>) => void;
  onSelect: (id: string) => (e: ThreeEvent<MouseEvent>) => void;
  onOut: () => void;
  tileRefs: React.MutableRefObject<(THREE.Group | null)[]>;
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}) {
  const [labelsReady, setLabelsReady] = useState(false);

  // Defer mounting the <Html> label until after the first render commits,
  // so its internal React root is created outside the parent's render phase.
  useEffect(() => {
    const id = window.setTimeout(() => setLabelsReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <group
      ref={(g) => {
        tileRefs.current[index] = g;
      }}
      onPointerOver={onHover(node.id)}
      onPointerOut={onOut}
      onClick={onSelect(node.id)}
    >
      <TileBody node={node} texture={texture} active={active} />

      {labelsReady && (
        <Html
          center
          zIndexRange={[15, 0]}
          style={{ pointerEvents: "none", userSelect: "none" }}
          position={[0, -TILE * 0.85, 0]}
        >
          <div
            ref={(el) => {
              labelRefs.current[index] = el;
            }}
            className="select-none whitespace-nowrap text-center"
          >
            <div className="text-[11px] font-semibold leading-tight text-[#1c1917]">
              {node.name}
            </div>
            <div className="text-[9px] leading-tight text-[#8b7f73]">
              {node.category}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function Universe({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  reducedMotion,
}: {
  selectedId: string;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  reducedMotion: boolean;
}) {
  const camera = useThree((s) => s.camera);

  const rootRef = useRef<THREE.Group>(null);
  const cubeRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const tileRefs = useRef<(THREE.Group | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const baseAttr = useRef<THREE.BufferAttribute>(null);
  const hiAttr = useRef<THREE.BufferAttribute>(null);
  const hiGeom = useRef<THREE.BufferGeometry>(null);

  const scales = useRef<number[]>(UNIVERSE_NODES.map(() => 1));
  const orbitT = useRef(0);
  const timeScale = useRef(1);

  const textures = useMemo(() => {
    const out: Record<string, THREE.CanvasTexture> = {};
    UNIVERSE_NODES.forEach((n) => (out[n.id] = makeTexture(iconCanvas(n.id))));
    return out;
  }, []);
  useEffect(
    () => () => Object.values(textures).forEach((t) => t.dispose()),
    [textures],
  );
  useEffect(
    () => () => {
      document.body.style.cursor = "auto";
    },
    [],
  );

  const ringQuats = useMemo(
    () =>
      RINGS.map((r) =>
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...r.tilt)),
      ),
    [],
  );
  const lean = useMemo(
    () =>
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.22, 0.38, 0.04)),
    [],
  );
  const scratch = useMemo(
    () => ({
      p: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      dummy: new THREE.Object3D(),
      positions: new Float32Array(UNIVERSE_NODES.length * 3),
    }),
    [],
  );

  const baseArray = useMemo(
    () => new Float32Array(UNIVERSE_NODES.length * 2 * 3),
    [],
  );
  const hiArray = useMemo(
    () => new Float32Array(MAX_HIGHLIGHT_SEGMENTS * 2 * 3),
    [],
  );

  useFrame((state, delta) => {
    const root = rootRef.current;
    if (!root) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;

    const target = reducedMotion ? 0 : hoveredId ? 0.12 : 1;
    timeScale.current += (target - timeScale.current) * Math.min(1, dt * 4);
    orbitT.current += dt * timeScale.current;
    const T = orbitT.current;

    if (!reducedMotion) root.rotation.y = Math.sin(t * 0.25) * 0.1;

    if (cubeRef.current && !reducedMotion) {
      cubeRef.current.rotation.y = Math.sin(t * 0.4) * 0.28;
      cubeRef.current.rotation.x = 0.1 + Math.sin(t * 0.33) * 0.05;
    }
    if (coreRef.current) {
      const pulse = 1 + (reducedMotion ? 0 : Math.sin(t * 2) * 0.04);
      coreRef.current.scale.setScalar(pulse);
    }

    const focusId = hoveredId ?? selectedId;
    const related = hoveredId ? NEIGHBORS.get(hoveredId) : null;
    const { p, q, dummy, positions } = scratch;

    q.copy(root.quaternion).invert().multiply(camera.quaternion).multiply(lean);

    UNIVERSE_NODES.forEach((n, i) => {
      const ring = RINGS[n.ring];
      const angle =
        (n.slot / RING_COUNTS[n.ring]) * TAU + ring.offset + T * ring.speed;
      p.set(Math.cos(angle) * ring.radius, 0, Math.sin(angle) * ring.radius);
      p.applyQuaternion(ringQuats[n.ring]);
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;

      const g = tileRefs.current[i];
      if (g) {
        g.position.copy(p);
        g.quaternion.copy(q);
        const dimmed = hoveredId && n.id !== hoveredId && !related?.has(n.id);
        const goal =
          n.id === hoveredId
            ? 1.22
            : n.id === selectedId
              ? 1.1
              : dimmed
                ? 0.88
                : 1;
        scales.current[i] += (goal - scales.current[i]) * Math.min(1, dt * 10);
        g.scale.setScalar(scales.current[i]);

        const el = labelRefs.current[i];
        if (el) {
          const depth = THREE.MathUtils.clamp((p.z + 3) / 6, 0, 1);
          el.style.opacity = String((0.4 + 0.6 * depth) * (dimmed ? 0.35 : 1));
        }
      }

      baseArray[i * 6 + 3] = p.x;
      baseArray[i * 6 + 4] = p.y;
      baseArray[i * 6 + 5] = p.z;
    });
    if (baseAttr.current) baseAttr.current.needsUpdate = true;

    const fi = UNIVERSE_NODES.findIndex((n) => n.id === focusId);
    let segs = 0;
    if (fi >= 0) {
      const focus = UNIVERSE_NODES[fi];
      const write = (
        ax: number,
        ay: number,
        az: number,
        bx: number,
        by: number,
        bz: number,
      ) => {
        if (segs >= MAX_HIGHLIGHT_SEGMENTS) return;
        const o = segs * 6;
        hiArray[o] = ax;
        hiArray[o + 1] = ay;
        hiArray[o + 2] = az;
        hiArray[o + 3] = bx;
        hiArray[o + 4] = by;
        hiArray[o + 5] = bz;
        segs++;
      };
      const fx = positions[fi * 3];
      const fy = positions[fi * 3 + 1];
      const fz = positions[fi * 3 + 2];
      write(0, 0, 0, fx, fy, fz);
      focus.connections.forEach((cid) => {
        const ci = UNIVERSE_NODES.findIndex((n) => n.id === cid);
        if (ci >= 0)
          write(
            fx,
            fy,
            fz,
            positions[ci * 3],
            positions[ci * 3 + 1],
            positions[ci * 3 + 2],
          );
      });
    }
    if (hiAttr.current) hiAttr.current.needsUpdate = true;
    hiGeom.current?.setDrawRange(0, segs * 2);

    const packets = packetsRef.current;
    if (packets) {
      UNIVERSE_NODES.forEach((_, i) => {
        const f = reducedMotion ? 0.5 : (t * 0.3 + i * 0.19) % 1;
        dummy.position.set(
          positions[i * 3] * f,
          positions[i * 3 + 1] * f,
          positions[i * 3 + 2] * f,
        );
        dummy.scale.setScalar(0.25 + Math.sin(f * Math.PI));
        dummy.updateMatrix();
        packets.setMatrixAt(i, dummy.matrix);
      });
      packets.instanceMatrix.needsUpdate = true;
    }
  });

  const handleOver = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHover(id);
  };
  const handleOut = () => {
    document.body.style.cursor = "auto";
    onHover(null);
  };
  const handleSelect = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(id);
  };

  return (
    <group ref={rootRef}>
      <Platform />
      <OrbitRings />
      <CoreCube cubeRef={cubeRef} coreRef={coreRef} />
      <Satellites reducedMotion={reducedMotion} />

      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            ref={baseAttr}
            attach="attributes-position"
            args={[baseArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff8a3d" transparent opacity={0.28} />
      </lineSegments>

      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={hiGeom}>
          <bufferAttribute
            ref={hiAttr}
            attach="attributes-position"
            args={[hiArray, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ff7a2b" transparent opacity={0.95} />
      </lineSegments>

      <instancedMesh
        ref={packetsRef}
        args={[undefined, undefined, UNIVERSE_NODES.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshBasicMaterial color="#ff8a3d" toneMapped={false} />
      </instancedMesh>

      {UNIVERSE_NODES.map((n, i) => (
        <TechTile
          key={n.id}
          node={n}
          index={i}
          texture={textures[n.id]}
          active={n.id === hoveredId || n.id === selectedId}
          onHover={handleOver}
          onSelect={handleSelect}
          onOut={handleOut}
          tileRefs={tileRefs}
          labelRefs={labelRefs}
        />
      ))}
    </group>
  );
}

function Scene(props: React.ComponentProps<typeof Universe>) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(size.height, 1);

  const offsetX = aspect > 1.7 ? 1.5 : 0;
  const dist =
    aspect < 0.9 ? 17 : aspect < 1.3 ? 14 : aspect < 1.8 ? 11.6 : 10.4;

  useEffect(() => {
    camera.position.set(offsetX, 0.261 * dist, 0.965 * dist);
    camera.lookAt(offsetX, 0, 0);
  }, [camera, offsetX, dist]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 7]} intensity={1.5} />
      <directionalLight position={[-5, 2, 3]} intensity={0.5} />

      <group position={[offsetX, 0, 0]}>
        <Universe {...props} />
      </group>

      <OrbitControls
        target={[offsetX, 0, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        rotateSpeed={0.5}
        minPolarAngle={1.0}
        maxPolarAngle={1.75}
        minAzimuthAngle={-0.8}
        maxAzimuthAngle={0.8}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function EngineeringUniverse() {
  const [selectedId, setSelectedId] = useState<string>("react");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inView, setInView] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const wrapRef = useRef<HTMLDivElement>(null);

  const node = NODE_BY_ID.get(hoveredId ?? selectedId) ?? UNIVERSE_NODES[0];

  useEffect(() => {
    const out: Record<string, string> = {};
    UNIVERSE_NODES.forEach(
      (n) => (out[n.id] = iconCanvas(n.id, 96).toDataURL()),
    );
    setThumbs(out);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const selectCategory = (cat: Category) => {
    const first = UNIVERSE_NODES.find((n) => n.category === cat);
    if (first) setSelectedId(first.id);
  };
  const selectNext = () => {
    const i = UNIVERSE_NODES.findIndex((n) => n.id === node.id);
    setSelectedId(UNIVERSE_NODES[(i + 1) % UNIVERSE_NODES.length].id);
  };

  return (
    <div
      ref={wrapRef}
      className="relative flex w-full flex-col overflow-hidden rounded-[28px] border border-[#e2d6c5] shadow-2xl lg:h-[620px]"
      style={{
        background:
          "radial-gradient(ellipse at 62% 42%, #fffaf3 0%, #f4ede3 52%, #e8dccb 100%)",
      }}
    >
      <div
        role="img"
        aria-label="Interactive 3D diagram: a Full Stack core surrounded by orbiting technology tiles. Use the panel below to browse each technology."
        className="relative h-[380px] sm:h-[460px] lg:absolute lg:inset-0 lg:h-auto"
      >
        <Canvas
          camera={{ position: [0, 2.6, 9.6], fov: 40 }}
          dpr={[1, 2]}
          frameloop={inView ? "always" : "never"}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Scene
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={setSelectedId}
            onHover={setHoveredId}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-[#e0d3c0] bg-white/70 px-3 py-1 font-mono text-[10px] text-[#8a5a34] backdrop-blur-md">
        <Sparkles className="h-3 w-3 text-[#B15F2C]" aria-hidden />
        <span>INTERACTIVE 3D STACK &middot; DRAG TO ROTATE</span>
      </div>

      <div className="relative z-20 m-3 rounded-2xl border border-[#2a2a2a] bg-[#101010] p-3.5 text-white shadow-2xl lg:absolute lg:bottom-5 lg:left-5 lg:m-0 lg:w-[360px]">
        <div
          role="tablist"
          aria-label="Technology categories"
          className="mb-3 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]"
        >
          {CATEGORIES.map((cat) => {
            const on = node.category === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={on}
                onClick={() => selectCategory(cat)}
                className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CF8047] ${
                  on
                    ? "bg-[#B15F2C] text-white"
                    : "text-[#8a8a8a] hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-3">
          {thumbs[node.id] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbs[node.id]}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-xl"
            />
          ) : (
            <span
              className="h-12 w-12 shrink-0 rounded-xl"
              style={{ backgroundColor: node.color }}
            />
          )}
          <div className="min-w-0 flex-1" aria-live="polite">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-base font-semibold leading-tight">
                {node.name}
              </h3>
              <span className="rounded border border-emerald-800/40 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                {node.productionRole}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-[#a8a8a8]">
              {node.description}
            </p>
          </div>
          <button
            type="button"
            onClick={selectNext}
            aria-label="Show next technology"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#333] text-[#CF8047] transition-colors hover:border-[#B15F2C] hover:bg-[#B15F2C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CF8047]"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {node.connections.map((cid) => {
            const c = NODE_BY_ID.get(cid);
            return c ? (
              <button
                key={cid}
                onClick={() => setSelectedId(cid)}
                className="rounded-md border border-[#2e2e2e] bg-[#1a1a1a] px-2 py-0.5 font-mono text-[10px] text-[#dddddd] transition-colors hover:bg-[#B15F2C] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CF8047]"
              >
                {c.name}
              </button>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
