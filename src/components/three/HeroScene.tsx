import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { logoDefs, type LogoDef } from "./logos";

/* ─────────────────────────────────────────────────────────────
   Interactive hero scene: a particle wave field that ripples
   around the cursor, framed by floating 3D badges showing real
   tech logos (React, JavaScript, Next.js, Python, PHP, Node.js).
   Rendering pauses when the hero leaves the viewport or the
   user prefers reduced motion.
   ───────────────────────────────────────────────────────────── */

/** Static wave height at time t for one particle (x, z), plus cursor ripple. */
function waveY(x: number, z: number, t: number, mx: number, mz: number) {
  let y =
    Math.sin(x * 0.32 + t * 0.9) * 0.32 +
    Math.sin(z * 0.5 + t * 0.62) * 0.24 +
    Math.sin((x + z) * 0.18 + t * 0.45) * 0.3;
  const dx = x - mx;
  const dz = z - mz;
  y += Math.exp(-(dx * dx + dz * dz) / 14) * 1.5;
  return y;
}

function ParticleWave({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const compact = typeof window !== "undefined" && window.innerWidth < 640;
  const COLS = compact ? 84 : 124;
  const ROWS = compact ? 38 : 54;
  const X_SPREAD = 16;
  const Z_NEAR = 4;
  const Z_FAR = -9;

  const { positions, base } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = THREE.MathUtils.mapLinear(col, 0, COLS - 1, -X_SPREAD, X_SPREAD);
        const z = THREE.MathUtils.mapLinear(row, 0, ROWS - 1, Z_NEAR, Z_FAR);
        positions[i * 3] = x;
        positions[i * 3 + 1] = waveY(x, z, 0, 99, 99); // static frame at t=0
        positions[i * 3 + 2] = z;
        base[i * 2] = x;
        base[i * 2 + 1] = z;
        i++;
      }
    }
    return { positions, base };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colors = useMemo(() => {
    const count = COLS * ROWS;
    const colors = new Float32Array(count * 3);
    const from = new THREE.Color(dark ? "#7c5cff" : "#6a3dff");
    const to = new THREE.Color(dark ? "#22d3ee" : "#0891b2");
    const c = new THREE.Color();
    let i = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        c.copy(from).lerp(to, col / (COLS - 1));
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
        i++;
      }
    }
    return colors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark]);

  /** Soft round particle sprite, generated once. */
  const sprite = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.35, "rgba(255,255,255,0.65)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame((state) => {
    if (reduced || !ref.current) return;
    const t = state.clock.elapsedTime;
    const mx = state.pointer.x * 14;
    const mz = -state.pointer.y * 6 + 1;
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COLS * ROWS; i++) {
      arr[i * 3 + 1] = waveY(base[i * 2], base[i * 2 + 1], t, mx, mz);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref} key={dark ? "dark" : "light"}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.058}
        map={sprite}
        vertexColors
        transparent
        opacity={dark ? 0.85 : 0.6}
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Floating tech-logo badges ─────────────────────────────── */

/** Renders one logo's SVG path into a transparent canvas texture. */
function makeLogoTexture(def: LogoDef, dark: boolean): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const path = new Path2D(def.path);
  // simple-icons use a 24×24 viewBox — scale to ~64% of the card with padding
  const fill = size * 0.64;
  const s = fill / 24;
  const off = (size - fill) / 2;
  ctx.translate(off, off);
  ctx.scale(s, s);

  // Next.js ships a white mark — flip to black so it reads on light cards
  let color = def.color;
  if (color === "#ffffff" && !dark) color = "#0a0a0f";

  if (def.color2) {
    const g = ctx.createLinearGradient(0, 0, 0, 24);
    g.addColorStop(0, def.color);
    g.addColorStop(1, def.color2);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fill(path);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function LogoBadge({
  def,
  position,
  size = 1.4,
  dark,
  reduced,
  speed = 1,
}: {
  def: LogoDef;
  position: [number, number, number];
  size?: number;
  dark: boolean;
  reduced: boolean;
  speed?: number;
}) {
  const spin = useRef<THREE.Group>(null);
  const texture = useMemo(() => makeLogoTexture(def, dark), [def, dark]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (reduced || !spin.current) return;
    spin.current.rotation.y = Math.sin(performance.now() * 0.0002 * speed) * 0.45;
    spin.current.rotation.x = Math.sin(performance.now() * 0.00016 * speed + 1.3) * 0.22;
  });

  const depth = 0.13;

  return (
    <Float speed={reduced ? 0 : 1.2 * speed} rotationIntensity={0.25} floatIntensity={1}>
      <group position={position} ref={spin}>
        <RoundedBox args={[size, size, depth]} radius={0.09} smoothness={4}>
          <meshStandardMaterial
            color={dark ? "#10101a" : "#ffffff"}
            metalness={0.35}
            roughness={0.4}
            emissive={dark ? "#1a1030" : "#0a0a12"}
            emissiveIntensity={dark ? 0.5 : 0.06}
          />
        </RoundedBox>
        {/* logo face */}
        <mesh position={[0, 0, depth / 2 + 0.002]}>
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/* Left / right columns flanking the headline — pushed wide of the text
   column, staggered vertically to "ladder" alongside it. On narrow
   (mobile) screens they sit off-screen, leaving the hero clean. */
const badgeLayout: { idx: number; position: [number, number, number]; size: number; speed: number }[] = [
  { idx: 0, position: [-6.5, 1.9, -2.8], size: 1.5, speed: 1 }, // React
  { idx: 5, position: [-7.1, -0.2, -4.3], size: 1.35, speed: 0.85 }, // Node.js
  { idx: 1, position: [-5.7, -1.7, -1.9], size: 1.15, speed: 1.15 }, // JavaScript
  { idx: 2, position: [6.6, 2.2, -3], size: 1.45, speed: 0.95 }, // Next.js
  { idx: 3, position: [7.2, 0, -4.4], size: 1.35, speed: 1.1 }, // Python
  { idx: 4, position: [5.8, -1.8, -2], size: 1.15, speed: 1.25 }, // PHP
];

function FloatingLogos({ dark, reduced }: { dark: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);

  /* On wide screens, spread the badges outward so they keep clearing
     the headline instead of drifting under it. */
  const spread = Math.min(1.3, Math.max(1, aspect / 1.78));

  useFrame((state) => {
    if (!group.current || reduced) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.1,
      0.045,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.06,
      0.045,
    );
  });

  return (
    <group ref={group}>
      {badgeLayout.map(({ idx, position, size, speed }) => (
        <LogoBadge
          key={logoDefs[idx].name}
          def={logoDefs[idx]}
          position={[position[0] * spread, position[1], position[2]]}
          size={size}
          speed={speed}
          dark={dark}
          reduced={reduced}
        />
      ))}
    </group>
  );
}

/** Re-render one frame when props change while the loop is paused. */
function InvalidateOnChange({ deps }: { deps: unknown[] }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalidate, ...deps]);
  return null;
}

/** CSS-only glow fallback when WebGL is unavailable. */
function FallbackGlow({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden>
      <div className="animate-drift absolute left-[12%] top-[16%] h-[380px] w-[380px] rounded-full bg-accent/30 blur-[110px]" />
      <div
        className="animate-drift absolute right-[10%] top-[30%] h-[340px] w-[340px] rounded-full bg-accent-2/20 blur-[110px]"
        style={{ animationDelay: "-6s" }}
      />
      {!dark && <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg" />}
    </div>
  );
}

export default function HeroScene({
  dark,
  active,
  reduced,
  logos = true,
}: {
  dark: boolean;
  active: boolean;
  reduced: boolean;
  logos?: boolean;
}) {
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebglOk(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebglOk(false);
    }
  }, []);

  if (!webglOk) return <FallbackGlow dark={dark} />;

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 4.3, 11.5], fov: 52 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "demand"}
    >
      <InvalidateOnChange deps={[dark, active]} />
      <ambientLight intensity={dark ? 0.5 : 0.85} />
      <directionalLight position={[6, 8, 4]} intensity={dark ? 1.4 : 1.6} color="#b7a6ff" />
      <pointLight position={[-8, 2, 2]} intensity={dark ? 30 : 14} color="#7c5cff" distance={32} />
      <pointLight position={[8, -2, 4]} intensity={dark ? 22 : 10} color="#22d3ee" distance={32} />
      <ParticleWave dark={dark} reduced={reduced} />
      {logos && <FloatingLogos dark={dark} reduced={reduced} />}
    </Canvas>
  );
}
