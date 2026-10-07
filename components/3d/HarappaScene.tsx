"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import * as THREE from "three";
import { ShoppingBag } from "lucide-react";

/* ---------------- Particle flow between stages ---------------- */
function FlowParticles({
  start,
  end,
  color,
  count = 14,
  speed = 0.6,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  count?: number;
  speed?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const offsets = useMemo(
    () => Array.from({ length: count }, () => Math.random()),
    [count],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const p = (((t * speed + offsets[i]) % 1) + 1) % 1;
      child.position.x = THREE.MathUtils.lerp(start[0], end[0], p);
      child.position.y =
        THREE.MathUtils.lerp(start[1], end[1], p) +
        Math.sin(p * Math.PI) * 0.15;
      child.position.z = THREE.MathUtils.lerp(start[2], end[2], p);
      const scale = 0.5 + Math.sin(p * Math.PI) * 0.8;
      child.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Connector line between stages ---------------- */
function Connector({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  return (
    <Line
      points={[start, end]}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.35}
      dashed
      dashSize={0.08}
      gapSize={0.06}
    />
  );
}

/* ---------------- Stage 01: Product SKU ---------------- */
function ProductStage() {
  const cubeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cubeRef.current) {
      cubeRef.current.rotation.x = t * 0.4;
      cubeRef.current.rotation.y = t * 0.55;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.6;
      ringRef.current.rotation.x = Math.PI / 2.2;
    }
  });

  return (
    <group position={[-2.2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        {/* Pedestal */}
        <mesh position={[0, -0.62, 0]}>
          <cylinderGeometry args={[0.55, 0.65, 0.08, 32]} />
          <meshStandardMaterial
            color="#141414"
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Glow ring */}
        <mesh ref={ringRef} position={[0, -0.55, 0]}>
          <torusGeometry args={[0.5, 0.012, 8, 48]} />
          <meshBasicMaterial color="#B15F2C" transparent opacity={0.8} />
        </mesh>

        {/* Product cube */}
        <mesh ref={cubeRef}>
          <boxGeometry args={[0.85, 0.85, 0.85]} />
          <meshStandardMaterial
            color="#1A1A1A"
            metalness={0.9}
            roughness={0.15}
            emissive="#B15F2C"
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ---------------- Stage 02: PayU Gateway ---------------- */
function GatewayStage() {
  const cardRef = useRef<THREE.Mesh>(null);
  const chipRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    }
    if (chipRef.current) {
      chipRef.current.rotation.y = Math.sin(t * 0.5) * 0.25;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={0.15} floatIntensity={0.5}>
        <group ref={cardRef}>
          {/* Card body */}
          <mesh>
            <boxGeometry args={[1.35, 0.85, 0.08]} />
            <meshStandardMaterial
              color="#B15F2C"
              metalness={0.7}
              roughness={0.25}
              emissive="#8F481E"
              emissiveIntensity={0.45}
            />
          </mesh>

          {/* Chip */}
          <mesh position={[-0.42, 0.2, 0.05]}>
            <boxGeometry args={[0.22, 0.16, 0.02]} />
            <meshStandardMaterial
              color="#E8C07A"
              metalness={1}
              roughness={0.15}
            />
          </mesh>

          {/* Magnetic stripe */}
          <mesh position={[0, -0.28, 0.045]}>
            <boxGeometry args={[1.2, 0.08, 0.01]} />
            <meshStandardMaterial
              color="#0A0A0A"
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
        </group>

        {/* Lock badge floating above */}
        <mesh position={[0, 0.65, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.06]} />
          <meshStandardMaterial
            color="#22C55E"
            emissive="#22C55E"
            emissiveIntensity={0.8}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ---------------- Stage 03: PostgreSQL Stack ---------------- */
function DatabaseStage() {
  const groupRef = useRef<THREE.Group>(null);
  const ledgerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.25;
    }
    if (ledgerRef.current) {
      ledgerRef.current.rotation.z = t * 0.8;
    }
  });

  const layers = [
    { y: 0.5, color: "#60A5FA" },
    { y: 0.22, color: "#3B82F6" },
    { y: -0.06, color: "#2563EB" },
    { y: -0.34, color: "#1D4ED8" },
  ];

  return (
    <group position={[2.2, 0, 0]}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <group ref={groupRef}>
          {layers.map((l, i) => (
            <mesh key={i} position={[0, l.y, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.24, 32]} />
              <meshStandardMaterial
                color={l.color}
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>
          ))}

          {/* Top disc accent */}
          <mesh position={[0, 0.63, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
            <meshStandardMaterial
              color="#93C5FD"
              metalness={1}
              roughness={0.05}
              emissive="#3B82F6"
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Rotating ledger ring around stack */}
          <mesh ref={ledgerRef} position={[0, 0.08, 0]}>
            <torusGeometry args={[0.62, 0.008, 8, 64]} />
            <meshBasicMaterial color="#38BDF8" transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

/* ---------------- Full pipeline scene ---------------- */
function EcommercePipeline() {
  return (
    <group position={[0, 0, 0]}>
      {/* Stage connectors */}
      <Connector start={[-1.55, 0, 0]} end={[-0.75, 0, 0]} color="#B15F2C" />
      <Connector start={[0.75, 0, 0]} end={[1.55, 0, 0]} color="#3B82F6" />

      {/* Animated data flow */}
      <FlowParticles
        start={[-1.55, 0, 0]}
        end={[-0.75, 0, 0]}
        color="#CF8047"
        count={10}
        speed={0.7}
      />
      <FlowParticles
        start={[0.75, 0, 0]}
        end={[1.55, 0, 0]}
        color="#38BDF8"
        count={10}
        speed={0.7}
      />

      <ProductStage />
      <GatewayStage />
      <DatabaseStage />
    </group>
  );
}

export default function HarappaScene() {
  return (
    <div className="w-full h-[320px] sm:h-[400px] rounded-[24px] bg-gradient-to-b from-[#0A0A0A] via-[#080808] to-[#050505] border border-[#222222] relative overflow-hidden shadow-xl">
      {/* Subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#B15F2C 1px, transparent 1px), linear-gradient(90deg, #B15F2C 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0.4, 4.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 5, 4]} intensity={1.4} />
        <directionalLight
          position={[-4, 2, -3]}
          intensity={0.4}
          color="#3B82F6"
        />
        <pointLight position={[-3, -2, 2]} intensity={0.9} color="#B15F2C" />
        <pointLight position={[3, 2, 2]} intensity={0.9} color="#3B82F6" />

        <EcommercePipeline />
      </Canvas>

      {/* Technical Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141414]/90 backdrop-blur-md border border-[#262626] text-[9px] font-mono text-[#CF8047] min-w-0">
          <ShoppingBag className="w-3 h-3 text-[#B15F2C] shrink-0" />
          <span className="truncate">
            HARAPPA // 3D MULTI-PANEL TRANSACTION &amp; DATA PIPELINE
          </span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
          IDEMPOTENT
        </span>
      </div>

      {/* Stage Labels Overlay */}
      <div className="absolute inset-x-4 sm:inset-x-6 bottom-10 flex justify-between items-center text-[9px] font-mono text-white pointer-events-none gap-2">
        <span className="px-2 py-0.5 rounded bg-[#111111]/80 border border-[#B15F2C]/40 whitespace-nowrap">
          01. PRODUCT SKU
        </span>
        <span className="px-2 py-0.5 rounded bg-[#111111]/80 border border-[#CF8047]/40 text-[#CF8047] whitespace-nowrap">
          02. PAYU SHA512
        </span>
        <span className="px-2 py-0.5 rounded bg-[#111111]/80 border border-[#3B82F6]/40 text-[#38BDF8] whitespace-nowrap">
          03. POSTGRES DB
        </span>
      </div>

      {/* Technical Footer */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[8px] font-mono text-[#777777] pointer-events-none gap-2">
        <span className="truncate">ENCRYPTED CHECKOUT → PRISMA WRITE</span>
        <span className="text-[#CF8047] shrink-0 hidden sm:inline">
          POSTGRESQL RELATIONAL SCHEMA
        </span>
      </div>
    </div>
  );
}
