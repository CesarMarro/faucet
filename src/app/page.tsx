import { Hero } from "@/components/ui/void-hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero
        title="Sepolia Faucet"
        description="Solicita ETH de prueba en Sepolia. Rápido, seguro y pensado para developers. Construye, itera y entrega sin fricción."
        links={[
          { name: "GITHUB", href: "https://github.com/CesarMarro/faucet" },
        ]}
      />

    </div>
  );
}
