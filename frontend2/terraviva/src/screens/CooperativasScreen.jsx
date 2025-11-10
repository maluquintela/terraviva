import React from "react";
import { SafeAreaView, ScrollView } from "../componentes/layout/ScreenContainers";
import "./screen-animations.css";

export default function CooperativasScreen() {
  return (
    <SafeAreaView className="animate-fade-in">
      <ScrollView className="gap-6">
        <header className="mt-4 space-y-2 text-center">
          <h1 className="text-3xl font-[Nexa-Heavy] text-[#1b4332]">
            Cooperativas
          </h1>
          <p className="text-base font-[Nexa-ExtraLight] text-[#1b4332]/80">
            Conecte-se às cooperativas e fortaleça sua rede de apoio.
          </p>
        </header>
        <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-3xl bg-[#f7f5f5] p-8 text-center text-[#1b4332]/75 shadow-[inset_0_12px_22px_rgba(0,0,0,0.04)]">
          <p>
            Chats em grupo e atualizações das cooperativas aparecerão aqui em
            breve.
          </p>
        </section>
      </ScrollView>
    </SafeAreaView>
  );
}

