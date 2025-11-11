import React from "react";
import { SafeAreaView, ScrollView } from "../componentes/layout/ScreenContainers";
import "./screen-animations.css";

export default function NoticiasScreen() {
  return (
    <SafeAreaView className="animate-fade-in">
      <ScrollView className="gap-6">
        <header className="mt-4 space-y-2 text-center">
          <h1 className="text-3xl font-[Nexa-Heavy] text-[#1b4332]">
            Notícias
          </h1>
          <p className="text-base font-[Nexa-ExtraLight] text-[#1b4332]/80">
            Explore as últimas novidades sobre agricultura e meio ambiente.
          </p>
        </header>
        <section className="flex flex-1 items-center justify-center rounded-3xl border border-dashed border-[#66bb6a]/60 bg-[#f7f5f5] p-8 text-center text-[#1b4332]/70">
          Em breve você verá as notícias selecionadas para a sua região.
        </section>
      </ScrollView>
    </SafeAreaView>
  );
}

