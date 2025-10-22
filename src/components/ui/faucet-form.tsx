"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";

interface FaucetFormProps {
  className?: string;
}

export function FaucetForm({ className }: FaucetFormProps) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setMessage("Por favor ingresa una dirección");
      return;
    }

    if (!ethers.isAddress(address)) {
      setMessage("Dirección Ethereum inválida");
      return;
    }

    setLoading(true);
    setMessage("");
    setTxHash("");

    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage("¡ETH enviado exitosamente!");
        setTxHash(data.txHash);
        setAddress("");
      } else {
        setMessage(data.error || "Error al enviar ETH");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            placeholder="0x… tu dirección de wallet"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={loading}
            className="h-12 rounded-xl border border-white/15 bg-white/10 px-4 text-sm text-white outline-none ring-0 placeholder:text-white/60 backdrop-blur-xl focus:border-white/25 disabled:opacity-50"
          />
          <Button 
            type="submit"
            disabled={loading || !address}
            className="h-12 rounded-xl bg-white/15 text-white hover:bg-white/25 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Pedir Sepolia ETH"}
          </Button>
        </div>
      </form>
      
      {message && (
        <div className={`mt-3 text-sm ${message.includes("exitosamente") ? "text-green-400" : "text-red-400"}`}>
          {message}
        </div>
      )}
      
      {txHash && (
        <div className="mt-2 text-xs text-white/70">
          <span>TX: </span>
          <a 
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </a>
        </div>
      )}
    </div>
  );
}
