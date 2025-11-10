import React from "react";
import { SafeAreaView, ScrollView } from "../componentes/layout/ScreenContainers";
import "./screen-animations.css";

export default function MercadoScreen() {
  return (
    <SafeAreaView className="animate-fade-in">
      <ScrollView className="gap-6">
        <header className="mt-4 space-y-2 text-center">
          <h1 className="text-3xl font-[Nexa-Heavy] text-[#1b4332]">
            Mercado
          </h1>
          <p className="text-base font-[Nexa-ExtraLight] text-[#1b4332]/80">
            Negocie insumos e produtos diretamente com outros agricultores.
          </p>
        </header>
        <section className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-[#66bb6a]/60 bg-[#ffffff] p-8 text-center text-[#1b4332]/70 shadow-[0_12px_32px_rgba(27,67,50,0.08)]">
          Em breve, vitrines de ofertas e demandas estarão disponíveis aqui.
        </section>
      </ScrollView>
    </SafeAreaView>
  );
}

