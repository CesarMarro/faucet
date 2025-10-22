import { Hero } from "@/components/ui/void-hero";
import { Button } from "@/components/ui/button";
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
