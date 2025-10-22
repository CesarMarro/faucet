"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Geometry, Base, Subtraction } from "@react-three/csg";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Bloom, N8AO, SMAA, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import { Mesh } from "three";
import { KernelSize } from "postprocessing";
import { FaucetForm } from "@/components/ui/faucet-form";

function Shape() {
  const meshRef = useRef<Mesh>(null);
  const innerSphereRef = useRef<Mesh>(null);

  useFrame((_, delta: number) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.z += delta * 0.2;
    }
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.x += delta * 0.3;
      innerSphereRef.current.rotation.y += delta * 0.5;
      innerSphereRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <meshPhysicalMaterial
          roughness={0}
          metalness={0.95}
          clearcoat={1}
          clearcoatRoughness={0.1}
          color="#000000"
        />

        <Geometry>
          <Base>
            <primitive object={new RoundedBoxGeometry(2, 2, 2, 7, 0.2)} />
          </Base>

          <Subtraction>
            <sphereGeometry args={[1.25, 64, 64]} />
          </Subtraction>
        </Geometry>
      </mesh>

      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshPhysicalMaterial color="#ffffff" emissive={"white"} emissiveIntensity={1} />
      </mesh>
    </>
  );
}

function Environment() {
  return (
    <>
      {/* Luces originales */}
      <directionalLight position={[-5, 5, -5]} intensity={0.2} color="#e6f3ff" />
      <directionalLight position={[0, -5, 10]} intensity={0.4} color="#fff5e6" />
      <ambientLight intensity={0.8} color="#404040" />
      <pointLight position={[8, 3, 8]} intensity={0.2} color="#ffeecc" distance={20} />
      <pointLight position={[-8, 3, -8]} intensity={0.2} color="#ccf0ff" distance={20} />
      <directionalLight position={[0, -10, 0]} intensity={0.2} color="#f0f0f0" />
    </>
  );
}

function Scene() {
  return (
    <Canvas className="w-full h-full" camera={{ position: [5, 5, 5], fov: 50 }}>
      <Environment />
      {/* Objeto 3D centrado (implementación original) */}
      <Shape />
      <EffectComposer multisampling={0}>
        <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
        <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
        <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}

function Navbar({ links }: { links: Array<{ name: string; href: string }> }) {
  return (
    <nav className="absolute top-4 left-4 right-4 md:top-10 md:left-10 md:right-10 z-50 pointer-events-auto">
      <ul className="hidden md:flex gap-8 lg:gap-12">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-sm font-light tracking-[0.2em] mix-blend-difference text-white hover:opacity-70 transition-opacity duration-300"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>

      <ul className="md:hidden flex flex-col gap-3 items-end">
        {links.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              className="text-xs font-light tracking-[0.15em] mix-blend-difference text-white hover:opacity-70 transition-opacity duration-300"
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface HeroProps {
  title: string;
  description: string;
  links: Array<{ name: string; href: string }>;
}

export const Hero: React.FC<HeroProps> = ({ title, description, links }) => {
  return (
    <div className="w-screen relative bg-[#0A0A0A] min-h-[100svh] md:min-h-[110svh]">
      <Navbar links={links} />
      {/* Créditos arriba a la derecha */}
      <div className="absolute top-3 right-4 z-40 text-[11px] md:top-4 md:right-6 text-white/70">
        César Marroquín · Daniel Hidalgo · Rodrigo Reyes
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <Scene />
      </div>
      {/* Overlay: formulario pegado a la izquierda, texto pegado a la derecha. Centro libre. */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-4 md:px-10 py-16 pointer-events-none">
        {/* Formulario (izquierda) */}
        <div className="w-full max-w-[540px] pointer-events-auto">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 md:p-6 backdrop-blur-2xl shadow-[0_8px_40px_rgba(255,255,255,0.08)] ring-1 ring-white/10 w-full">
              <FaucetForm />
              <div className="mt-3 flex flex-col gap-1 text-[11px] text-white/70 md:flex-row md:items-center md:justify-between">
                <span>Máximo 0.01 Sepolia por billetera cada 24h</span>
                <span className="text-white/60">Rate limit activo</span>
              </div>
            </div>
        </div>
        {/* Texto (derecha) */}
        <div className="max-w-xl text-right pr-2 md:pr-4 pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-4 text-white">
              {title}
          </h1>
          <p className="font-mono text-sm md:text-base leading-relaxed font-light tracking-tight text-white/70">
              {description}
          </p>
        </div>
      </div>
    </div>
  );
};
