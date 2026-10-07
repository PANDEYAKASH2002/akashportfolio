"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";

// Individual Floating System Node
function SystemNode({
  position,
  color = "#B15F2C",
  shape = "box",
  scale = 1
}: {
  position: [number, number, number];
  color?: string;
  shape?: "box" | "sphere" | "cylinder";
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.5 + position[0]) * 0.2;
    meshRef.current.rotation.y = Math.cos(t * 0.5 + position[1]) * 0.3;
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh
          ref={meshRef}
          scale={hovered ? scale * 1.25 : scale}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {shape === "box" && <boxGeometry args={[0.7, 0.7, 0.7]} />}
          {shape === "sphere" && <sphereGeometry args={[0.45, 24, 24]} />}
          {shape === "cylinder" && <cylinderGeometry args={[0.4, 0.4, 0.8, 20]} />}
          
          <meshStandardMaterial
            color={hovered ? "#CF8047" : color}
            metalness={0.7}
            roughness={0.2}
            emissive={hovered ? "#B15F2C" : "#1A0D06"}
            emissiveIntensity={hovered ? 0.8 : 0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Glowing Energy Connection Lines between System Nodes
function ConnectionLines() {
  const points = useMemo(() => {
    return [
      // Client -> Gateway
      [new THREE.Vector3(-2.2, 1.2, 0), new THREE.Vector3(0, 1.8, 0.5)],
      // Gateway -> Node Server Core
      [new THREE.Vector3(0, 1.8, 0.5), new THREE.Vector3(0, 0, 0)],
      // Core -> RBAC Security
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1.8, -1.2, 0.8)],
      // Core -> PostgreSQL Database
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(2.0, -0.8, 0.3)],
      // Core -> PayU & Integrations
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.9, 1.4, -0.5)],
      // RBAC -> DB
      [new THREE.Vector3(-1.8, -1.2, 0.8), new THREE.Vector3(2.0, -0.8, 0.3)],
    ];
  }, []);

  return (
    <group>
      {points.map((pair, idx) => (
        <Line
          key={idx}
          points={pair}
          color="#B15F2C"
          lineWidth={1.5}
          dashed={true}
          dashScale={3}
          dashSize={0.4}
          gapSize={0.2}
          transparent
          opacity={0.65}
        />
      ))}
    </group>
  );
}

// Interactive Particle Ambient Cloud
function ParticleStream() {
  const count = 120;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      const speed = 0.2 + Math.random() * 0.4;
      temp.push({ x, y, z, speed, theta });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((particle, i) => {
      const angle = particle.theta + t * particle.speed * 0.15;
      const r = Math.sqrt(particle.x * particle.x + particle.z * particle.z);
      const px = Math.cos(angle) * r;
      const pz = Math.sin(angle) * r;
      const py = particle.y + Math.sin(t + i) * 0.15;

      dummy.position.set(px, py, pz);
      dummy.scale.setScalar(0.04 + Math.sin(t * 2 + i) * 0.015);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#CF8047" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Interactive Central Computing Hub
function CoreSystemHub() {
  const coreRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = t * 0.4;
      innerRingRef.current.rotation.y = t * 0.3;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -t * 0.25;
      outerRingRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group ref={coreRef} position={[0, 0, 0]}>
      {/* Central Server Block */}
      <mesh>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#141414"
          metalness={0.9}
          roughness={0.1}
          emissive="#B15F2C"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Internal Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#CF8047" />
      </mesh>

      {/* Inner Orbital Torus */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[1.3, 0.02, 16, 64]} />
        <meshBasicMaterial color="#B15F2C" transparent opacity={0.7} />
      </mesh>

      {/* Outer Orbital Torus */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.7, 0.015, 16, 64]} />
        <meshBasicMaterial color="#CF8047" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Scene Root with mouse interaction
function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const { x, y } = state.pointer;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.35, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.25, 0.05);
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFFFFF" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#B15F2C" />
      <pointLight position={[0, 3, 2]} intensity={1.2} color="#CF8047" />

      {/* Central Engine */}
      <CoreSystemHub />

      {/* Connected Architecture Nodes */}
      <SystemNode position={[-2.2, 1.2, 0]} color="#38BDF8" shape="box" scale={0.9} />
      <SystemNode position={[0, 1.8, 0.5]} color="#10B981" shape="cylinder" scale={0.85} />
      <SystemNode position={[-1.8, -1.2, 0.8]} color="#EAB308" shape="sphere" scale={0.8} />
      <SystemNode position={[2.0, -0.8, 0.3]} color="#3B82F6" shape="cylinder" scale={0.95} />
      <SystemNode position={[1.9, 1.4, -0.5]} color="#B15F2C" shape="box" scale={0.85} />

      {/* Live Synced Connection Paths */}
      <ConnectionLines />

      {/* Data Particle Field */}
      <ParticleStream />
    </group>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full min-h-[360px] sm:min-h-[460px] lg:min-h-[540px] relative rounded-[28px] overflow-hidden bg-[#080808] border border-[#222222] shadow-2xl">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <SceneContent />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 2 - 0.3}
          rotateSpeed={0.4}
        />
      </Canvas>

      {/* 3D Viewport Technical Header & Live Telemetry Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111]/80 backdrop-blur-md border border-[#262626] text-[10px] font-mono text-[#CF8047]">
          <span className="w-2 h-2 rounded-full bg-[#B15F2C] animate-ping" />
          <span>WEBGL 3D SOFTWARE ARCHITECTURE</span>
        </div>
        <div className="text-[9px] font-mono text-[#888888] bg-[#111111]/80 px-2.5 py-1 rounded-full border border-[#262626] hidden sm:block">
          NODE.JS • REACT • POSTGRESQL • LINUX
        </div>
      </div>

      {/* Floating System HUD Node Labels */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded bg-[#111111]/70 backdrop-blur-md border border-[#38BDF8]/40 text-[#38BDF8]">
            REACT CLIENT
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111111]/70 backdrop-blur-md border border-[#10B981]/40 text-[#10B981]">
            NGINX / VPS
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono">
          <span className="px-2.5 py-1 rounded bg-[#111111]/70 backdrop-blur-md border border-[#EAB308]/40 text-[#EAB308]">
            JWT / 4-TIER RBAC
          </span>
          <span className="px-2.5 py-1 rounded bg-[#111111]/70 backdrop-blur-md border border-[#3B82F6]/40 text-[#3B82F6]">
            POSTGRESQL + PRISMA
          </span>
        </div>
      </div>

      {/* Bottom 3D Scene Controls Hint */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[9px] font-mono text-[#777777] pointer-events-none">
        <span>DRAG TO ROTATE 3D SYSTEM UNIVERSE</span>
        <span className="text-[#CF8047]">6 ACTIVE SUBSYSTEMS</span>
      </div>
    </div>
  );
}
