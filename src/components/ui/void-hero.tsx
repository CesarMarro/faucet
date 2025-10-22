"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Geometry, Base, Subtraction } from "@react-three/csg";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Bloom, N8AO, SMAA, EffectComposer } from "@react-three/postprocessing";
import { useRef } from "react";
import { Mesh } from "three";
import { KernelSize } from "postprocessing";
import { Button } from "@/components/ui/button";

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
      {/* Luces movidas mucho más a la izquierda para acompañar el cubo */}
      <directionalLight position={[-10, 7, -6]} intensity={0.4} color="#e6f3ff" />
      <directionalLight position={[-6, -4, 8]} intensity={0.5} color="#fff5e6" />
      <ambientLight intensity={0.65} color="#404040" />
      <pointLight position={[-10, 3, 2]} intensity={0.45} color="#ccf0ff" distance={36} />
      <pointLight position={[-14, 2, -8]} intensity={0.3} color="#ffeecc" distance={34} />
      <directionalLight position={[-6, -10, 0]} intensity={0.22} color="#f0f0f0" />
    </>
  );
}

function Scene() {
  return (
    <Canvas className="w-full h-full" camera={{ position: [5, 5, 5], fov: 50 }}>
      <Environment />
      {/* Mueve el objeto 3D aún más hacia la izquierda */}
      <group position={[-7.5, -4, 1]}>
        <Shape />
      </group>
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
    <nav className="absolute top-4 left-4 right-4 md:top-10 md:left-10 md:right-10 z-30">
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
    <div className="h-svh w-screen relative bg-[#0A0A0A]">
      <Navbar links={links} />
      <div className="absolute inset-0">
        <Scene />
      </div>
      {/* Panel de formulario estilo liquid glass al lado derecho (ocupa la mitad en desktop) */}
      <div id="request" className="absolute right-4 top-1/2 z-30 w-[min(92vw,560px)] -translate-y-1/2 md:right-10 md:w-1/2">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 md:p-6 backdrop-blur-2xl shadow-[0_8px_40px_rgba(255,255,255,0.08)] ring-1 ring-white/10">
          <h1 className="text-2xl md:text-3xl font-light tracking-tight mb-2 text-white">
            {title}
          </h1>
          <p className="font-mono text-xs md:text-sm leading-relaxed font-light tracking-tight text-white/70">
            {description}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="0x… tu dirección de wallet"
              className="h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none ring-0 placeholder:text-white/60 backdrop-blur-xl focus:border-white/25"
            />
            <Button className="h-12 rounded-xl bg-white/15 text-white hover:bg-white/25">
              Pedir Sepolia ETH
            </Button>
          </div>
          <div className="mt-3 flex flex-col gap-1 text-[11px] text-white/70 md:flex-row md:items-center md:justify-between">
            <span>Máximo 0.01 Sepolia por billetera cada 24h</span>
            <span className="text-white/60">Rate limit activo</span>
          </div>
        </div>
      </div>

      {/* Texto descriptivo al lado izquierdo */}
      <div className="absolute left-4 bottom-6 z-20 max-w-xs md:left-10 md:bottom-10">
        <p className="text-xs leading-relaxed text-white/70">
          Faucet de Sepolia para developers. Obtén ETH de prueba para desplegar, testear y depurar smart contracts. Optimizado para velocidad y confiabilidad.
        </p>
      </div>
    </div>
  );
};
