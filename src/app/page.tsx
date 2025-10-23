import { Hero } from "@/components/ui/void-hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero
        title="SepolitaUFM"
        description="Solicita ETH de prueba en Sepolia. Rápido, seguro y pensado para la UFM. Consigue sepolia sin problemas."
        links={[
          { name: "GITHUB", href: "https://github.com/CesarMarro/faucet" },
        ]}
      />

    </div>
  );
}
