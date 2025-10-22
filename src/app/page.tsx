import { Hero } from "@/components/ui/void-hero";
import { FaucetForm } from "@/components/ui/faucet-form";
import { Droplets, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero
        title="Sepolia Faucet — Cyber Minimal"
        description="Solicita ETH de prueba en Sepolia. Rápido, seguro y pensado para developers. Construye, itera y entrega sin fricción."
        links={[
          { name: "HOME", href: "/" },
          { name: "DOCS", href: "#docs" },
          { name: "GITHUB", href: "https://github.com" },
          { name: "REQUEST", href: "#request" },
        ]}
      />

      {/* Liquid glass request section below the hero */}
      <section id="request" className="mx-auto -mt-10 w-full max-w-4xl px-6 md:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl shadow-[0_8px_40px_rgba(255,255,255,0.08)] ring-1 ring-white/10">
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-white">Solicita ETH de Prueba en Sepolia</h2>
          <p className="mt-2 text-sm text-white/70">
            Ingresa tu dirección para recibir 0.01 ETH de prueba y continuar construyendo en Sepolia.
          </p>
          <FaucetForm className="mt-6" />
          <div className="mt-3 flex flex-col gap-1 text-[11px] text-white/70 sm:flex-row sm:items-center sm:justify-between">
            <span>Máximo 0.01 Sepolia por billetera cada 24h</span>
            <span className="text-white/60">Rate limit activo</span>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 w-full max-w-4xl px-6 md:px-8">
        <p className="mx-auto w-full text-center text-xs text-zinc-500 dark:text-zinc-400">
          Creadores: César Marroquín · Daniel Hidalgo · Rodrigo Reyes
        </p>
      </div>

      <section className="mx-auto mt-16 w-full max-w-5xl px-6 pb-20 md:px-8" id="docs">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-white/10">
            <img
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop"
              alt="Blockchain network"
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-white/10">
            <img
              src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop"
              alt="Developer workstation"
              className="h-64 w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
