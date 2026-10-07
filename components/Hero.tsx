"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Image from "next/image";
import { ArrowUpRight, Database, Server } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  SiReact,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiPrisma,
} from "react-icons/si";

/**
 * The right-hand scene is drawn in code (SVG + absolutely positioned cards)
 * on a fixed 1060×760 canvas that scales to fit its column.
 *
 * Hover the scene → every piece drifts apart (with a "tu-dum" sound).
 * Move the pointer away → every piece springs back into place.
 * (Touch: tap to toggle. Reduced motion: off.)
 *
 * Optional: pass `stackImage="/hero-stack.png"` to replace the drawn
 * stack/planet/rocks with your own rendered artwork (cards stay on top).
 */
type HeroProps = { stackImage?: string };

const W = 1060;
const H = 760;
const ORANGE = "#C8641F";

const TECH = [
  { name: "React", Icon: SiReact },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "MySQL", Icon: SiMysql },
  { name: "Prisma", Icon: SiPrisma },
];

const LAYERS = [
  { title: "Frontend", sub: "React / TypeScript", y: 138 },
  { title: "API", sub: "Express.js", y: 233 },
  { title: "Database", sub: "PostgreSQL / MongoDB", y: 337 },
  { title: "Infrastructure", sub: "Linux / Nginx", y: 438 },
];

const STATS = [
  { value: "02+", label: "Years experience" },
  { value: "22", label: "Indian languages" },
  { value: "2", label: "Major platforms" },
  { value: "MULTIPLE", label: "Production deployments" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ------------------------------ Sound ------------------------------ */

/** One soft low thud: a sine wave with a quick pitch drop. */
function thud(
  ctx: AudioContext,
  when: number,
  freq: number,
  dur: number,
  peak: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq * 2.2, when);
  osc.frequency.exponentialRampToValueAtTime(freq, when + 0.08);
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + dur + 0.05);
}

/**
 * Synthesized "tu-dum" (two low thuds). No audio file needed.
 * Browsers block audio until the user interacts once (click / tap / key),
 * so the AudioContext is unlocked on the first interaction anywhere on the page.
 */
function useTudum() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  useEffect(() => {
    const unlock = () => {
      getCtx();
    };
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    events.forEach((e) =>
      window.addEventListener(e, unlock, { once: true, passive: true }),
    );
    return () => events.forEach((e) => window.removeEventListener(e, unlock));
  }, [getCtx]);

  return useCallback(() => {
    const ctx = getCtx();
    if (!ctx || ctx.state !== "running") return;
    const t = ctx.currentTime;
    thud(ctx, t, 90, 0.28, 0.5); // "tu"  - shorter, higher
    thud(ctx, t + 0.17, 62, 0.6, 0.7); // "dum" - longer, deeper
  }, [getCtx]);
}

/* ------------------------------ Scatter system ------------------------------ */

type Offset = { x: number; y: number; r?: number; d?: number };

/** Where each piece drifts to (canvas px) while the scene is hovered. */
const SCATTER: Record<string, Offset> = {
  // stack: slabs only translate so their icons track them exactly
  slab3: { x: 60, y: 75, d: 0 },
  slab2: { x: -70, y: 15, d: 0.04 },
  slab1: { x: 40, y: -45, d: 0.08 },
  plate: { x: -30, y: -100, r: -8, d: 0.12 },
  planet: { x: 70, y: -60, r: 12 },
  base: { x: 0, y: 55 },
  // rocks
  r1: { x: 70, y: -60, r: 80 },
  r2: { x: 60, y: 50, r: -70 },
  r3: { x: 90, y: -20, r: 120 },
  r4: { x: 80, y: 80, r: 60 },
  r5: { x: 40, y: 70, r: -90 },
  r6: { x: -70, y: 50, r: 100 },
  r7: { x: 50, y: -30, r: 90 },
  // cards
  code: { x: -55, y: -45, r: -8 },
  slim: { x: 45, y: -65, r: 6 },
  cube: { x: -70, y: 30, r: -14 },
  map: { x: -50, y: 40, r: -4 },
  build: { x: 55, y: -30, r: 4 },
};

const SPRING = {
  type: "spring",
  stiffness: 70,
  damping: 13,
  mass: 0.9,
} as const;

const ScatterCtx = createContext(false);

function target(on: boolean, o: Offset) {
  return on ? { x: o.x, y: o.y, rotate: o.r ?? 0 } : { x: 0, y: 0, rotate: 0 };
}

/** SVG group that scatters. */
function SvgPiece({ id, children }: { id: string; children: ReactNode }) {
  const on = useContext(ScatterCtx);
  const o = SCATTER[id];
  return (
    <motion.g
      animate={target(on, o)}
      transition={{ ...SPRING, delay: on ? (o.d ?? 0) : 0 }}
    >
      {children}
    </motion.g>
  );
}

/** HTML wrapper that scatters. */
function HtmlPiece({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const on = useContext(ScatterCtx);
  const o = SCATTER[id];
  return (
    <motion.div
      className={className}
      style={style}
      animate={target(on, o)}
      transition={{ ...SPRING, delay: on ? (o.d ?? 0) : 0 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ SVG building blocks ------------------------------ */

function Rock({
  x,
  y,
  r,
  rot = 0,
}: {
  x: number;
  y: number;
  r: number;
  rot?: number;
}) {
  const pts = [
    [-1, 0.1],
    [-0.4, -0.9],
    [0.5, -1],
    [1, -0.2],
    [0.7, 0.8],
    [-0.3, 1],
  ]
    .map(([a, b]) => `${x + a * r},${y + b * r}`)
    .join(" ");
  return (
    <polygon
      points={pts}
      fill="url(#rockGrad)"
      stroke="#E8863A"
      strokeOpacity={0.35}
      strokeWidth={0.8}
      transform={`rotate(${rot} ${x} ${y})`}
    />
  );
}

/** Isometric slab: top diamond + left face + right face, glowing underside. */
function Slab({
  cx,
  cy,
  hw = 150,
  hh = 34,
  t = 72,
}: {
  cx: number;
  cy: number;
  hw?: number;
  hh?: number;
  t?: number;
}) {
  const L = `${cx - hw},${cy}`;
  const T = `${cx},${cy - hh}`;
  const R = `${cx + hw},${cy}`;
  const B = `${cx},${cy + hh}`;
  const Lb = `${cx - hw},${cy + t}`;
  const Bb = `${cx},${cy + hh + t}`;
  const Rb = `${cx + hw},${cy + t}`;
  const ih = hw - 34;
  const ihh = hh - 11;
  return (
    <g>
      <ellipse
        cx={cx}
        cy={cy + hh + t + 6}
        rx={hw * 0.95}
        ry={24}
        fill="url(#underGlow)"
        filter="url(#blur10)"
      />
      <polygon points={`${L} ${B} ${Bb} ${Lb}`} fill="url(#faceL)" />
      <polygon points={`${B} ${R} ${Rb} ${Bb}`} fill="url(#faceR)" />
      <polygon points={`${L} ${T} ${R} ${B}`} fill="url(#faceT)" />
      <polygon
        points={`${cx - ih},${cy} ${cx},${cy - ihh} ${cx + ih},${cy} ${cx},${cy + ihh}`}
        fill="none"
        stroke="#E8863A"
        strokeOpacity={0.45}
        strokeWidth={1}
      />
      <polyline
        points={`${L} ${T} ${R} ${B} ${L}`}
        fill="none"
        stroke="#E8863A"
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      <polyline
        points={`${Lb} ${Bb} ${Rb}`}
        fill="none"
        stroke="#FF8A2A"
        strokeWidth={2}
        filter="url(#glow)"
      />
      <line
        x1={cx}
        y1={cy + hh}
        x2={cx}
        y2={cy + hh + t}
        stroke="#E8863A"
        strokeOpacity={0.5}
      />
    </g>
  );
}

function Plate({
  cx,
  cy,
  hw = 140,
  hh = 36,
  t = 12,
}: {
  cx: number;
  cy: number;
  hw?: number;
  hh?: number;
  t?: number;
}) {
  const L = `${cx - hw},${cy}`;
  const T = `${cx},${cy - hh}`;
  const R = `${cx + hw},${cy}`;
  const B = `${cx},${cy + hh}`;
  return (
    <g>
      <polygon
        points={`${L} ${B} ${cx},${cy + hh + t} ${cx - hw},${cy + t}`}
        fill="#fff"
        fillOpacity={0.14}
      />
      <polygon
        points={`${B} ${R} ${cx + hw},${cy + t} ${cx},${cy + hh + t}`}
        fill="#fff"
        fillOpacity={0.08}
      />
      <polygon
        points={`${L} ${T} ${R} ${B}`}
        fill="url(#plateGrad)"
        stroke="#fff"
        strokeOpacity={0.55}
        strokeWidth={1}
      />
    </g>
  );
}

function Scene() {
  const scattered = useContext(ScatterCtx);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      className="absolute inset-0"
      aria-hidden
    >
      <defs>
        <radialGradient id="planetGrad" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#4d423b" />
          <stop offset="0.55" stopColor="#1d1814" />
          <stop offset="1" stopColor="#0a0807" />
        </radialGradient>
        <linearGradient id="rimGrad" x1="0.1" y1="0.1" x2="0.9" y2="0.9">
          <stop offset="0.45" stopColor="#FF8A2A" stopOpacity="0" />
          <stop offset="1" stopColor="#FF8A2A" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="rockGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b322c" />
          <stop offset="1" stopColor="#0d0a08" />
        </linearGradient>
        <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a221d" />
          <stop offset="1" stopColor="#070504" />
        </linearGradient>
        <linearGradient id="faceL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d2520" />
          <stop offset="0.75" stopColor="#15100d" />
          <stop offset="1" stopColor="#4a220a" />
        </linearGradient>
        <linearGradient id="faceR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17100c" />
          <stop offset="0.65" stopColor="#26150b" />
          <stop offset="1" stopColor="#9a4a12" />
        </linearGradient>
        <linearGradient id="faceT" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3d332c" />
          <stop offset="1" stopColor="#1a1411" />
        </linearGradient>
        <linearGradient id="plateGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="underGlow">
          <stop offset="0" stopColor="#FF8A2A" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FF8A2A" stopOpacity="0" />
        </radialGradient>
        <filter id="blur10" x="-50%" y="-100%" width="200%" height="300%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Planet + orbit */}
      <SvgPiece id="planet">
        <ellipse
          cx={600}
          cy={190}
          rx={205}
          ry={125}
          fill="none"
          stroke="#E8863A"
          strokeOpacity={0.55}
          strokeWidth={1}
          transform="rotate(-24 600 190)"
        />
        <circle cx={590} cy={165} r={160} fill="url(#planetGrad)" />
        <circle cx={540} cy={120} r={22} fill="#000" fillOpacity={0.25} />
        <circle cx={640} cy={215} r={30} fill="#000" fillOpacity={0.22} />
        <circle cx={560} cy={230} r={14} fill="#000" fillOpacity={0.2} />
        <circle
          cx={590}
          cy={165}
          r={160}
          fill="none"
          stroke="url(#rimGrad)"
          strokeWidth={4}
          filter="url(#glow)"
        />
      </SvgPiece>

      {/* Rings + base rock */}
      <SvgPiece id="base">
        <ellipse
          cx={440}
          cy={560}
          rx={425}
          ry={150}
          fill="none"
          stroke="#E8863A"
          strokeOpacity={0.22}
        />
        <ellipse
          cx={440}
          cy={500}
          rx={345}
          ry={105}
          fill="none"
          stroke="#E8863A"
          strokeOpacity={0.3}
        />
        <path
          d="M130 500 L160 470 L230 445 L330 440 L440 435 L560 440 L690 450 L770 480 L812 525 L800 590 L740 640 L700 700 L640 722 L520 702 L420 727 L330 702 L240 662 L170 612 L130 560 Z"
          fill="url(#baseGrad)"
          stroke="#E8863A"
          strokeOpacity={0.25}
        />
        <path
          d="M133 500 L162 472 L232 447 L332 442 M690 450 L770 480 L812 525 L802 575"
          fill="none"
          stroke="#FF8A2A"
          strokeWidth={1.6}
          filter="url(#glow)"
        />
        <path
          d="M220 560 L270 585 L330 580 M600 600 L660 590 L705 610"
          fill="none"
          stroke="#FF7A1A"
          strokeOpacity={0.6}
          strokeWidth={1}
          filter="url(#glow)"
        />
        <ellipse
          cx={440}
          cy={490}
          rx={290}
          ry={84}
          fill="none"
          stroke="#FF8A2A"
          strokeOpacity={0.55}
        />
      </SvgPiece>

      {/* Stack (back to front) */}
      <SvgPiece id="slab3">
        <Slab cx={440} cy={422} />
      </SvgPiece>
      <SvgPiece id="slab2">
        <Slab cx={440} cy={317} />
      </SvgPiece>
      <SvgPiece id="slab1">
        <Slab cx={440} cy={212} />
      </SvgPiece>
      <SvgPiece id="plate">
        <Plate cx={440} cy={140} />
      </SvgPiece>

      {/* Floating rocks */}
      <SvgPiece id="r1">
        <Rock x={742} y={228} r={13} rot={20} />
      </SvgPiece>
      <SvgPiece id="r2">
        <Rock x={677} y={365} r={18} rot={-15} />
      </SvgPiece>
      <SvgPiece id="r3">
        <Rock x={752} y={330} r={9} />
      </SvgPiece>
      <SvgPiece id="r4">
        <Rock x={716} y={468} r={17} rot={30} />
      </SvgPiece>
      <SvgPiece id="r5">
        <Rock x={718} y={687} r={19} rot={-10} />
      </SvgPiece>
      <SvgPiece id="r6">
        <Rock x={183} y={655} r={9} />
      </SvgPiece>
      <SvgPiece id="r7">
        <Rock x={929} y={78} r={6} />
      </SvgPiece>

      {/* Connector lines + dots fade while pieces are apart */}
      <motion.g
        animate={{ opacity: scattered ? 0.12 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {[
          "M170 170 L258 208",
          "M137 262 L185 285 L258 327",
          "M195 365 L258 420",
          "M175 475 L205 495",
        ].map((d) => (
          <path key={d} d={d} fill="none" stroke="#E8863A" strokeWidth={1} />
        ))}
        {[
          [258, 208],
          [258, 327],
          [258, 420],
          [296, 337],
          [205, 495],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={3}
            fill="#FF8A2A"
            filter="url(#glow)"
          />
        ))}
      </motion.g>
    </svg>
  );
}

/* ------------------------------ Floating HTML pieces ------------------------------ */

/** Gentle idle bobbing; the scatter offset is applied by an inner HtmlPiece. */
function Float({
  style,
  amp = 8,
  dur = 6,
  delay = 0,
  children,
}: {
  style: CSSProperties;
  amp?: number;
  dur?: number;
  delay?: number;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="absolute"
      style={style}
      animate={reduce ? undefined : { y: [0, -amp, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

const darkCard =
  "rounded-lg border border-white/10 bg-gradient-to-br from-[#1f1a16] to-[#0c0908] shadow-[0_24px_40px_-14px_rgba(0,0,0,0.55)]";

function WorldMap() {
  return (
    <svg viewBox="0 0 100 60" className="h-full w-full" aria-hidden>
      <defs>
        <pattern
          id="mapDots"
          width="2.2"
          height="2.2"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.1" cy="1.1" r="0.6" fill="#8d8780" />
        </pattern>
      </defs>
      <g fill="url(#mapDots)">
        <polygon points="8,10 25,6 38,12 34,24 26,34 18,30 12,20" />
        <polygon points="26,36 34,38 36,50 30,58 26,48" />
        <polygon points="46,12 58,10 62,22 60,38 54,50 48,40 46,26" />
        <polygon points="58,8 86,8 92,20 80,32 66,30 60,20" />
        <polygon points="80,40 92,40 94,50 84,52" />
      </g>
      <circle cx="68" cy="26" r="2.2" fill="#FF8A2A" />
      <circle
        cx="68"
        cy="26"
        r="4.5"
        fill="none"
        stroke="#FF8A2A"
        strokeOpacity="0.6"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function FloatingPieces() {
  return (
    <>
      {/* Code card (top-left) */}
      <Float style={{ left: 236, top: 58, width: 172 }} amp={7} dur={6.5}>
        <HtmlPiece id="code">
          <div
            className={`${darkCard} p-3.5 font-mono text-[10px] leading-4 text-[#E6A06A]`}
            style={{
              transform: "perspective(600px) rotateY(16deg) rotateZ(-15deg)",
            }}
            aria-hidden
          >
            <div className="mb-1.5 flex gap-1">
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span className="h-1 w-1 rounded-full bg-white/30" />
            </div>
            <div>
              <span className="text-[#B9B2AA]">const</span> app = express();
            </div>
            <div>app.use(express.json());</div>
            <div>app.listen(5000);</div>
          </div>
        </HtmlPiece>
      </Float>

      {/* Slim dark card in front of the planet */}
      <Float
        style={{ left: 545, top: 100, width: 96, height: 140 }}
        amp={6}
        dur={7.5}
        delay={0.6}
      >
        <HtmlPiece id="slim" className="h-full w-full">
          <div
            className={`${darkCard} h-full w-full p-2.5`}
            style={{
              transform: "perspective(500px) rotateY(-24deg) rotateZ(4deg)",
            }}
            aria-hidden
          >
            <div className="h-1 w-8 rounded bg-[#E8863A]/70" />
            <div className="mt-2 h-px w-full bg-white/10" />
            <div className="mt-1.5 h-px w-3/4 bg-white/10" />
          </div>
        </HtmlPiece>
      </Float>

      {/* Glass cube with rock (left of stack) */}
      <HtmlPiece
        id="cube"
        className="absolute"
        style={{ left: 232, top: 232, width: 74, height: 66 }}
      >
        <div
          className="flex h-full w-full items-center justify-center rounded-xl border border-white/60 bg-white/40 shadow-lg backdrop-blur-sm"
          style={{ transform: "rotate(-4deg)" }}
          aria-hidden
        >
          <svg viewBox="0 0 50 44" className="h-10 w-10">
            <polygon
              points="4,24 14,6 32,4 46,18 38,38 14,40"
              fill="#1f1a16"
              stroke="#E8863A"
              strokeOpacity="0.5"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      </HtmlPiece>

      {/* Map / coordinates card (bottom-left) */}
      <Float
        style={{ left: 208, top: 520, width: 252, height: 190 }}
        amp={7}
        dur={7}
      >
        <HtmlPiece id="map" className="h-full w-full">
          <div
            className={`${darkCard} relative h-full w-full overflow-hidden p-3`}
            style={{
              transform: "perspective(900px) rotateY(20deg) rotateZ(9deg)",
            }}
            aria-hidden
          >
            <div className="mb-1 flex gap-1">
              <span className="h-1 w-1 rounded-full bg-[#E8863A]" />
              <span className="h-px w-10 self-center bg-white/20" />
            </div>
            <div className="absolute inset-x-3 top-6 bottom-6 opacity-90">
              <WorldMap />
            </div>
            <div className="absolute bottom-2.5 left-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#FF8A2A]/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF8A2A]" />
            </div>
            <div className="absolute bottom-3 right-4 font-mono text-[9px] leading-[14px] tracking-wider text-[#D9D3CC]">
              <div>LAT 21.17° N</div>
              <div>LON 72.83° E</div>
            </div>
          </div>
        </HtmlPiece>
      </Float>

      {/* Currently building (right) */}
      <Float
        style={{ left: 798, top: 105, width: 205 }}
        amp={9}
        dur={7}
        delay={0.3}
      >
        <HtmlPiece id="build">
          <aside
            className="rounded-[26px] border border-white/80 bg-white/80 p-5 shadow-[0_30px_60px_-22px_rgba(0,0,0,0.3)] backdrop-blur-md"
            style={{
              transform: "perspective(1100px) rotateY(-12deg) rotateZ(5deg)",
            }}
          >
            <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
              Currently building
            </div>
            <div className="mt-2 text-[19px] font-semibold leading-[1.15] tracking-tight text-black">
              Production web applications
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-black/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8863A]/60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E8863A]" />
              </span>
              Live
            </div>
            <ul className="mt-5 space-y-3 text-xs text-black/80">
              <li className="flex items-center gap-2.5">
                <SiReact className="text-[#35A7D8]" /> React
              </li>
              <li className="flex items-center gap-2.5">
                <SiNodedotjs className="text-[#5FA04E]" /> Node.js
              </li>
              <li className="flex items-center gap-2.5">
                <SiPostgresql className="text-[#3B82C4]" /> PostgreSQL
              </li>
            </ul>
            <div className="mt-6 border-t border-black/10 pt-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
                Experience
              </div>
              <div className="mt-0.5 text-[13px] font-semibold text-black">
                2+ Years
              </div>
            </div>
            <div className="mt-4 border-t border-black/10 pt-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-black/40">
                Location
              </div>
              <div className="mt-0.5 text-[13px] font-semibold text-black">
                Surat, India
              </div>
            </div>
          </aside>
        </HtmlPiece>
      </Float>
    </>
  );
}

/* ------------------------------------ Stage ------------------------------------ */

function Stage({ stackImage }: HeroProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();
  const scattered = hover && !reduce;
  const playTudum = useTudum();

  // Play "tu-dum" whenever the pieces start drifting apart.
  useEffect(() => {
    if (scattered) playTudum();
  }, [scattered, playTudum]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setScale(entry.contentRect.width / W),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <ScatterCtx.Provider value={scattered}>
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{ height: H * scale }}
        onPointerEnter={(e) => e.pointerType !== "touch" && setHover(true)}
        onPointerLeave={(e) => e.pointerType !== "touch" && setHover(false)}
        onPointerDown={(e) => e.pointerType === "touch" && setHover((h) => !h)}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: W, height: H, transform: `scale(${scale})` }}
        >
          {stackImage ? (
            <Image
              src={stackImage}
              alt=""
              fill
              priority
              className="object-contain"
            />
          ) : (
            <Scene />
          )}

          {/* Layer callouts */}
          <ul>
            {LAYERS.map((l) => (
              <li
                key={l.title}
                className="absolute flex items-start gap-[14px]"
                style={{ left: 43, top: l.y - 10 }}
              >
                <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#E8863A]" />
                <div>
                  <div className="text-[14px] font-semibold leading-tight text-black">
                    {l.title}
                  </div>
                  <div className="mt-[3px] text-[11px] leading-tight text-black/65">
                    {l.sub}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <FloatingPieces />

          {/* Stack icons — each travels with the slab it sits on */}
          <HtmlPiece
            id="plate"
            className="absolute"
            style={{ left: 406, top: 106, width: 68, height: 68 }}
          >
            <SiReact
              className="h-full w-full text-[#6AD1F5] drop-shadow-[0_0_10px_rgba(106,209,245,0.7)]"
              aria-hidden
            />
          </HtmlPiece>
          <HtmlPiece
            id="slab1"
            className="absolute"
            style={{ left: 367, top: 244, width: 36, height: 36 }}
          >
            <SiNodedotjs
              className="h-full w-full text-[#EFEAE4] drop-shadow-[0_0_6px_rgba(255,138,42,0.6)]"
              style={{ transform: "skewY(13deg)" }}
              aria-hidden
            />
          </HtmlPiece>
          <HtmlPiece
            id="slab2"
            className="absolute"
            style={{ left: 365, top: 347, width: 40, height: 40 }}
          >
            <Database
              className="h-full w-full text-[#EFEAE4] drop-shadow-[0_0_6px_rgba(255,138,42,0.6)]"
              style={{ transform: "skewY(13deg)" }}
              strokeWidth={1.4}
              aria-hidden
            />
          </HtmlPiece>
          <HtmlPiece
            id="slab3"
            className="absolute"
            style={{ left: 365, top: 452, width: 40, height: 40 }}
          >
            <Server
              className="h-full w-full text-[#EFEAE4] drop-shadow-[0_0_6px_rgba(255,138,42,0.6)]"
              style={{ transform: "skewY(13deg)" }}
              strokeWidth={1.4}
              aria-hidden
            />
          </HtmlPiece>

          {/* Tagline */}
          <div
            className="absolute flex items-start gap-4"
            style={{ left: 918, top: 595 }}
          >
            <span className="relative h-[43px] w-px bg-black/15">
              <span className="absolute left-0 top-[14px] h-[15px] w-[2px] -translate-x-1/2 bg-black" />
            </span>
            <div className="pt-[1px] font-mono text-[9px] uppercase leading-[17px] tracking-[0.16em] text-black/60">
              <div>Real systems</div>
              <div>Real users</div>
              <div>Real impact</div>
            </div>
          </div>
        </div>
      </div>
    </ScatterCtx.Provider>
  );
}

function CtaButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex-wrap items-center gap-3 ${className}`}>
      <button
        onClick={() => scrollToSection("projects")}
        className="group flex items-center gap-5 rounded-full bg-[#0A0A0A] py-2 pl-7 pr-2 text-sm font-medium text-white transition-colors hover:bg-[#C8641F]"
      >
        View My Work
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </button>

      <button
        onClick={() => scrollToSection("contact")}
        className="flex items-center gap-3 rounded-full border border-black/10 bg-white/30 px-7 py-3.5 text-sm text-black/80 transition-colors hover:border-black/40"
      >
        Let&apos;s Talk <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------- Hero ------------------------------------ */

export default function Hero({ stackImage }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#F2EFEA] text-black"
    >
      {/* Ambient warmth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(207,128,71,0.16), transparent 70%)",
          }}
        />
      </div>

      {/* Left timeline rail */}
      <div
        aria-hidden
        className="absolute bottom-10 left-[45px] top-10 hidden lg:block"
      >
        <div className="absolute inset-y-0 w-px bg-black/15" />
        <div className="absolute -left-[13px] -top-1 h-7 w-7 rounded-full border border-black/15" />
        <div className="absolute -left-[3px] top-[84%] h-[7px] w-[7px] rounded-full bg-black" />
        <div className="absolute -left-[7px] bottom-0 h-3.5 w-3.5 rounded-full border border-black/20 bg-[#F2EFEA]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1680px] flex-1 grid-cols-1 items-center gap-10 px-4 sm:px-10 pb-10 pt-20 sm:pt-24 lg:grid-cols-[minmax(0,540px)_minmax(0,1fr)] lg:gap-6 lg:pl-[98px] lg:pr-[50px]">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-20 flex flex-col items-start w-full max-w-full"
        >
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.2em] text-black/70">
            FULL-STACK DEVELOPER
            <span
              className="h-px w-20 sm:w-28"
              style={{
                background: `linear-gradient(90deg, #333 0%, ${ORANGE} 100%)`,
              }}
            />
          </div>

          <h1 className="mt-8 text-[clamp(2.35rem,5.4vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-0.045em] break-words">
            <span className="bg-gradient-to-r from-[#5A2A10] via-[#1F0F07] to-[#0A0A0A] bg-clip-text text-transparent">
              I build digital
            </span>
            <br />
            products that
            <br />
            actually{" "}
            <span className="bg-gradient-to-r from-[#D98A4A] to-[#C8641F] bg-clip-text text-transparent">
              ship.
            </span>
          </h1>

          {/* Paragraph removed: hidden on mobile/small devices (and it was never shown on desktop) */}

          {/* Buttons: desktop only (original position) */}
          <CtaButtons className="mt-10 hidden lg:flex" />

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-5">
            {TECH.map(({ name, Icon }) => (
              <li
                key={name}
                className="flex flex-col items-center gap-2 text-black/55"
              >
                <Icon className="h-6 w-6" />
                <span className="text-[11px]">{name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 hidden font-mono text-[10px] tracking-widest text-black/60 lg:block">
            SCROLL TO EXPLORE
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-w-0"
        >
          <Stage stackImage={stackImage} />

          {/* Buttons: mobile / small devices, below the stacked image */}
          <CtaButtons className="mt-6 flex lg:hidden" />
        </motion.div>
      </div>

      {/* Bottom stats bar */}
      <div className="mx-auto w-full max-w-[1680px] px-5 pb-8 sm:px-10 lg:pl-[98px] lg:pr-[50px]">
        <div className="grid grid-cols-2 gap-y-6 border-t border-black/10 pt-6 lg:grid-cols-[1fr_1fr_1fr_1.4fr_auto]">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={i > 0 ? "lg:border-l lg:border-black/10 lg:pl-16" : ""}
            >
              <div className="font-mono text-lg font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-black/50">
                {s.label}
              </div>
            </div>
          ))}
          <div className="hidden items-end justify-end font-mono text-[10px] tracking-widest text-black/70 lg:flex">
            {"</>"}&nbsp;&nbsp;AKASH PANDEY
          </div>
        </div>
      </div>
    </section>
  );
}