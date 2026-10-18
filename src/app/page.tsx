// src/app/page.tsx
import type { Metadata } from "next";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero/hero";
import { Process } from "@/components/process";
import { RevealObserver } from "@/components/reveal-observer";
import { Services } from "@/components/services/services";
import { Work } from "@/components/work/work";

export const metadata: Metadata = {
  title: "Sayed Hasan · Video Editor for YouTube, Documentaries & Brands",
};

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Work />
        <Services />
        <About />
        <Process />
        <Contact />
      </main>
      <RevealObserver />
    </>
  );
}
