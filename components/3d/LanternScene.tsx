"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { Radio } from "lucide-react";

function AnimatedGpsMarker() {
  const markerRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Curve for the GPS Route
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, -1.2, 0),
      new THREE.Vector3(-1.4, 0.4, 0.4),
      new THREE.Vector3(0.2, -0.6, -0.2),
      new THREE.Vector3(1.6, 0.8, 0.3),
      new THREE.Vector3(2.6, -0.2, 0),
    ]);
  }, []);

  const routePoints = useMemo(() => {
    return curve.getPoints(50);
  }, [curve]);

  useFrame((state) => {
    const t = (state.clock.elapsedTime * 0.15) % 1;
    const pos = curve.getPointAt(t);
    if (markerRef.current) {
      markerRef.current.position.copy(pos);
    }
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* 3D Polyline Route */}
      <Line
        points={routePoints}
        color="#B15F2C"
        lineWidth={3}
        dashed={false}
      />

      {/* Moving Personnel GPS Marker */}
      <group ref={markerRef}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color="#CF8047"
            emissive="#B15F2C"
            emissiveIntensity={1}
          />
        </mesh>

        {/* Pulsing Beacon Ring */}
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.38, 24]} />
          <meshBasicMaterial color="#CF8047" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Static Waypoints */}
      {[-2.8, 0.2, 2.6].map((x, i) => (
        <group key={i} position={[x, i === 0 ? -1.2 : i === 1 ? -0.6 : -0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
            <meshStandardMaterial color="#888888" metalness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function GroundGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.2) % 1;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[14, 14, "#333333", "#1A1A1A"]}
      position={[0, -1.8, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function LanternScene() {
  return (
    <div className="w-full h-[320px] sm:h-[400px] rounded-[24px] bg-[#0A0A0A] border border-[#222222] relative overflow-hidden shadow-xl">
      <Canvas
        camera={{ position: [0, 1.5, 4.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} />
        <pointLight position={[0, 1, 0]} intensity={0.9} color="#CF8047" />

        <GroundGrid />
        <AnimatedGpsMarker />
      </Canvas>

      {/* Technical Header Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141414]/90 backdrop-blur-md border border-[#262626] text-[9px] font-mono text-[#CF8047]">
          <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
          <span>LANTERN360 // 3D GPS TELEMETRY & ROUTE MAPPING</span>
        </div>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
          STREAM ACTIVE
        </span>
      </div>

      {/* Floating 3D Waypoint Labels Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex justify-between items-center text-[8px] font-mono text-[#888888]">
        <span className="bg-[#080808]/80 px-2 py-0.5 rounded border border-[#333333]">WP-01 (ORIGIN)</span>
        <span className="bg-[#080808]/80 px-2 py-0.5 rounded border border-[#333333]">WP-02 (TRANSIT)</span>
        <span className="bg-[#080808]/80 px-2 py-0.5 rounded border border-[#333333]">WP-03 (DESTINATION)</span>
      </div>

      {/* Technical Footer */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[8px] font-mono text-[#777777] pointer-events-none">
        <span>COORDINATE INGESTION: 21.1702° N, 72.8311° E</span>
        <span className="text-[#CF8047]">LEAFLET.JS + REST API</span>
      </div>
    </div>
  );
}
