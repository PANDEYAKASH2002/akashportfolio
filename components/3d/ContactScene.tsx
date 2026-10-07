"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const TEXT = "AKASH";
const ROW_STEP = 10; // canvas px between scanlines (lower = more, finer lines)
const SEG_LEN = 8; // canvas px per line segment (each segment scatters on its own)
const LINE_THICK = 2.2; // canvas px line thickness
const MAX_VOICES = 10;

// C major pentatonic, C4 -> A5. Any sweep across the name sounds musical.
const SCALE = [
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0,
];

/* -------------------------------------------------------------------------- */
/*  Piano synth (Web Audio, no assets)                                        */
/* -------------------------------------------------------------------------- */

class PianoSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private voices = 0;
  muted = false;

  /** Must be called from a user gesture (browser autoplay policy). */
  unlock() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      const comp = this.ctx.createDynamicsCompressor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private getNoise(ctx: AudioContext) {
    if (!this.noise) {
      const len = Math.floor(ctx.sampleRate * 0.04);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.noise = buf;
    }
    return this.noise;
  }

  play(freq: number, velocity = 0.6) {
    const ctx = this.ctx;
    if (this.muted || !ctx || !this.master || this.voices >= MAX_VOICES) return;

    const now = ctx.currentTime;
    // Higher notes ring shorter, like a real piano.
    const dur = 2.4 - Math.min(freq / 880, 1) * 1.1;

    const out = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.setValueAtTime(Math.min(freq * 9, 9000), now);
    lp.frequency.exponentialRampToValueAtTime(freq * 2.4, now + dur * 0.6);
    out.connect(lp);
    lp.connect(this.master);

    const amps = [1, 0.55, 0.3, 0.16, 0.09, 0.05];
    const B = 0.0003; // slight inharmonicity = "wooden" piano character
    let first: OscillatorNode | null = null;

    amps.forEach((amp, i) => {
      const n = i + 1;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * n * Math.sqrt(1 + B * n * n);

      const g = ctx.createGain();
      const peak = velocity * amp * 0.2;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur / (1 + i * 0.45));

      osc.connect(g);
      g.connect(out);
      osc.start(now);
      osc.stop(now + dur + 0.05);
      if (!first) first = osc;
    });

    // Hammer "thunk"
    const src = ctx.createBufferSource();
    src.buffer = this.getNoise(ctx);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = Math.min(freq * 4, 4000);
    const hg = ctx.createGain();
    hg.gain.setValueAtTime(0.06 * velocity, now);
    hg.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
    src.connect(bp);
    bp.connect(hg);
    hg.connect(out);
    src.start(now);

    this.voices++;
    if (first) {
      (first as OscillatorNode).onended = () => {
        this.voices = Math.max(0, this.voices - 1);
        out.disconnect();
      };
    }
  }

  dispose() {
    if (this.ctx && this.ctx.state !== "closed") void this.ctx.close();
    this.ctx = null;
    this.master = null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Text -> points                                                            */
/* -------------------------------------------------------------------------- */

type Sample = {
  points: Float32Array;
  count: number;
  segLen: number;
  thick: number;
  rowStep: number;
};

/** Rasterises the text on an offscreen canvas, then cuts it into horizontal
 *  scanline segments. Positions are normalised so the text is 1 unit wide,
 *  centred on the origin. */
function sampleText(text: string): Sample {
  const W = 1100;
  const H = 360;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  const family = `"Arial Black", "Helvetica Neue", Impact, system-ui, sans-serif`;

  // Fit font size so the word always fits the canvas, whatever font resolves.
  g.font = `900 230px ${family}`;
  const fit = Math.min(1, (W - 60) / g.measureText(text).width);
  const fontSize = 230 * fit;
  g.font = `900 ${fontSize}px ${family}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff";
  const tw = g.measureText(text).width;
  g.fillText(text, W / 2, H / 2);

  const { data } = g.getImageData(0, 0, W, H);
  const alphaAt = (x: number, y: number) =>
    data[(Math.floor(y) * W + Math.floor(x)) * 4 + 3];

  // Vertical glyph bounds, so the lines divide the letters evenly top to bottom.
  let minY = H;
  let maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x += 4) {
      if (alphaAt(x, y) > 128) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        break;
      }
    }
  }
  const rows = Math.max(1, Math.round((maxY - minY) / ROW_STEP));
  const step = (maxY - minY) / rows;
  const midY = (minY + maxY) / 2;

  const pts: number[] = [];
  for (let r = 0; r < rows; r++) {
    const y = minY + (r + 0.5) * step;
    for (let x = SEG_LEN / 2; x < W; x += SEG_LEN) {
      if (alphaAt(x, y) > 128) pts.push((x - W / 2) / tw, -(y - midY) / tw);
    }
  }
  return {
    points: new Float32Array(pts),
    count: pts.length / 2,
    segLen: (SEG_LEN * 1.04) / tw, // tiny overlap hides seams between segments
    thick: LINE_THICK / tw,
    rowStep: step / tw,
  };
}

/* -------------------------------------------------------------------------- */
/*  Scanline shader                                                           */
/* -------------------------------------------------------------------------- */

const vertexShader = /* glsl */ `
  attribute float aDisp;
  varying float vDisp;
  varying float vX;
  varying float vY;
  void main() {
    mat4 im = mat4(1.0);
    #ifdef USE_INSTANCING
      im = instanceMatrix;
    #endif
    vDisp = aDisp;
    vX = im[3].x + 0.5;
    vY = im[3].y;
    gl_Position = projectionMatrix * modelViewMatrix * im * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uRowStep;
  varying float vDisp;
  varying float vX;
  varying float vY;

  float hash(float n) { return fract(sin(n * 12.9898) * 43758.5453); }

  void main() {
    // Each scanline gets its own brightness, like a slightly uneven CRT.
    float row = floor(vY / uRowStep + 0.5);
    float level = 0.62 + 0.38 * hash(row);

    // A soft highlight sweeps across the name every few seconds.
    float beam = exp(-pow((vX - fract(uTime * 0.12)) * 7.0, 2.0));

    vec3 col = vec3(0.86, 0.88, 0.93) * level + vec3(0.35) * beam;

    // Pushed segments warm up to the accent colour, then cool back down.
    float heat = clamp(vDisp * 9.0, 0.0, 1.0);
    col = mix(col, vec3(0.93, 0.58, 0.33), heat);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* -------------------------------------------------------------------------- */
/*  Particles                                                                 */
/* -------------------------------------------------------------------------- */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function ScanlineName({
  sample,
  onPlay,
}: {
  sample: Sample;
  onPlay: (noteIndex: number, velocity: number) => void;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { count, points, segLen, thick, rowStep } = sample;
  const scale = viewport.width * 0.86;

  const sim = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const home = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      home[i * 3] = pos[i * 3] = points[i * 2];
      home[i * 3 + 1] = pos[i * 3 + 1] = points[i * 2 + 1];
      seed[i] = Math.random();
    }
    return { pos, vel, home, seed };
  }, [count, points]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uRowStep: { value: rowStep } }),
    [rowStep],
  );
  const dispArr = useMemo(() => new Float32Array(count), [count]);
  const dispRef = useRef<THREE.InstancedBufferAttribute>(null);
  const pointer = useRef({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    active: false,
    burst: false,
  });
  const lastNote = useRef({ t: 0, idx: -1 });

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    const { pos, vel, home, seed } = sim;

    const R = 0.085; // hover radius (text is 1 unit wide)
    const R2 = R * R;
    const BURST_R = 0.28;
    const damp = Math.exp(-5 * dt);
    const spring = 18;
    let touched = 0;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = pos[i3];
      let y = pos[i3 + 1];
      let z = pos[i3 + 2];
      let vx = vel[i3];
      let vy = vel[i3 + 1];
      let vz = vel[i3 + 2];
      const s = seed[i];

      if (p.active) {
        const dx = x - p.x;
        const dy = y - p.y;
        const d2 = dx * dx + dy * dy;

        if (d2 < R2) {
          const d = Math.sqrt(d2) + 1e-5;
          const f = 1 - d / R;
          const push = f * f * 14 * dt;
          vx += (dx / d) * push + (-dy / d) * f * (s - 0.5) * 6 * dt;
          vy += (dy / d) * push + (dx / d) * f * (s - 0.5) * 6 * dt;
          vz += (s - 0.5) * f * 9 * dt;
          touched++;
        }

        if (p.burst && d2 < BURST_R * BURST_R) {
          const d = Math.sqrt(d2) + 1e-5;
          const f = 1 - d / BURST_R;
          vx += (dx / d) * f * (1.1 + s);
          vy += (dy / d) * f * (1.1 + s);
          vz += (s - 0.5) * f * 2.2;
        }
      }

      // Spring back home. The idle drift is shared per row (same phase for every
      // segment in a line), so rows shimmer sideways without breaking apart.
      const wob = Math.sin(t * 1.4 + home[i3 + 1] * 120) * 0.0014;
      vx += (home[i3] + wob - x) * spring * dt;
      vy += (home[i3 + 1] - y) * spring * dt;
      vz += (0 - z) * spring * dt;

      vx *= damp;
      vy *= damp;
      vz *= damp;
      x += vx * dt;
      y += vy * dt;
      z += vz * dt;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      vel[i3] = vx;
      vel[i3 + 1] = vy;
      vel[i3 + 2] = vz;

      const hx = x - home[i3];
      const hy = y - home[i3 + 1];
      const disp = Math.sqrt(hx * hx + hy * hy + z * z);

      dispArr[i] = disp;
      dummy.position.set(x, y, z);
      // Segments tumble as they are pushed away and settle flat again at home.
      dummy.rotation.set(0, 0, (s - 0.5) * Math.min(disp * 28, 3));
      dummy.scale.set(
        segLen * (1 + Math.min(disp * 4, 1.2)),
        thick * (1 + Math.min(disp * 6, 0.9)),
        thick,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (dispRef.current) dispRef.current.needsUpdate = true;
    p.burst = false;

    // Notes: only while lines are actually being pushed and the pointer moves.
    const now = t * 1000;
    const moved = Math.hypot(p.x - p.px, p.y - p.py);
    if (
      p.active &&
      touched > 6 &&
      moved > 0.003 &&
      now - lastNote.current.t > 110
    ) {
      const idx = Math.floor(clamp(p.x + 0.5, 0, 0.999) * SCALE.length);
      if (idx !== lastNote.current.idx || now - lastNote.current.t > 260) {
        onPlay(idx, clamp(0.35 + moved * 16, 0.35, 1));
        lastNote.current = { t: now, idx };
      }
    }
    p.px = p.x;
    p.py = p.y;

    // Gentle parallax tilt.
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      state.pointer.x * 0.18,
      4,
      dt,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      -state.pointer.y * 0.12,
      4,
      dt,
    );
    uniforms.uTime.value = t;
  });

  const toLocal = (e: ThreeEvent<PointerEvent>) => {
    pointer.current.x = e.point.x / scale;
    pointer.current.y = (e.point.y - 0.1) / scale;
    pointer.current.active = true;
  };

  const handleDown = (e: ThreeEvent<PointerEvent>) => {
    toLocal(e);
    pointer.current.burst = true;
    // Arpeggiated chord from the note under the pointer.
    const base = Math.floor(
      clamp(pointer.current.x + 0.5, 0, 0.999) * SCALE.length,
    );
    [0, 2, 4].forEach((step, k) =>
      window.setTimeout(
        () => onPlay(Math.min(base + step, SCALE.length - 1), 0.9),
        k * 70,
      ),
    );
  };

  return (
    <>
      <group ref={groupRef} position={[0, 0.1, 0]} scale={scale}>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, count]}
          frustumCulled={false}
        >
          <boxGeometry args={[1, 1, 1]}>
            <instancedBufferAttribute
              ref={dispRef}
              attach="attributes-aDisp"
              args={[dispArr, 1]}
            />
          </boxGeometry>
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </instancedMesh>
      </group>

      {/* Invisible plane that feeds pointer positions into the simulation */}
      <mesh
        onPointerMove={toLocal}
        onPointerDown={handleDown}
        onPointerOut={() => (pointer.current.active = false)}
      >
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function ScanlineScene({ onPlay }: { onPlay: (i: number, v: number) => void }) {
  const [sample, setSample] = useState<Sample | null>(null);

  useEffect(() => {
    let alive = true;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => alive && setSample(sampleText(TEXT)));
    return () => {
      alive = false;
    };
  }, []);

  if (!sample) return null;
  return <ScanlineName sample={sample} onPlay={onPlay} />;
}

/* -------------------------------------------------------------------------- */
/*  Public component                                                          */
/* -------------------------------------------------------------------------- */

export default function ContactScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<PianoSynth | null>(null);
  const [inView, setInView] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  // Audio engine lifecycle + unlock on the first gesture anywhere on the page.
  useEffect(() => {
    const synth = new PianoSynth();
    synthRef.current = synth;
    const unlock = () => {
      synth.unlock();
      setUnlocked(true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      synth.dispose();
      synthRef.current = null;
    };
  }, []);

  // Pause rendering when the card is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      {
        threshold: 0.05,
      },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handlePlay = useCallback((noteIndex: number, velocity: number) => {
    synthRef.current?.play(SCALE[noteIndex], velocity);
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const synth = synthRef.current;
    if (!synth) return;
    synth.unlock();
    synth.muted = soundOn;
    setSoundOn(!soundOn);
    setUnlocked(true);
  };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label="AKASH drawn in scanlines. Move your pointer over it to scatter the lines and play piano notes."
      // Capture phase so audio unlocks before the canvas handles the same click.
      onPointerDownCapture={() => {
        synthRef.current?.unlock();
        setUnlocked(true);
      }}
      className="w-full h-[260px] sm:h-[340px] rounded-[28px] bg-[#0A0A0A] border border-[#222222] relative overflow-hidden shadow-2xl cursor-crosshair"
      style={{ touchAction: "pan-y" }}
    >
      {/* Faint smoke behind the lettering */}
      <div className="pointer-events-none absolute -left-10 top-6 h-40 w-64 rounded-full bg-[#8fa3c7]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 bottom-10 h-36 w-72 rounded-full bg-[#8fa3c7]/10 blur-3xl" />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        frameloop={inView ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <ScanlineScene onPlay={handlePlay} />
      </Canvas>

      <div className="absolute inset-x-0 bottom-4 flex justify-center pointer-events-none">
        <div className="px-3.5 py-1 rounded-full bg-[#080808]/90 backdrop-blur-md border border-[#B15F2C] text-[9px] font-mono text-white shadow-xl">
          <span className="text-emerald-400 mr-1.5">●</span> AVAILABLE FOR
          HIGH-IMPACT ROLES
        </div>
      </div>

      <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[9px] font-mono text-[#888888] pointer-events-none">
        <span>
          {unlocked ? "HOVER TO PLAY" : "TAP ONCE FOR SOUND, THEN HOVER"}
        </span>
        <span className="text-[#CF8047]">AKASH PANDEY // 2025</span>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? "Mute piano sound" : "Unmute piano sound"}
        className="absolute bottom-3 right-3 rounded-full border border-[#333333] bg-[#080808]/90 px-2.5 py-1 text-[9px] font-mono text-[#CF8047] transition-colors hover:border-[#B15F2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#CF8047]"
      >
        {soundOn ? "SOUND ON" : "SOUND OFF"}
      </button>
    </div>
  );
}
