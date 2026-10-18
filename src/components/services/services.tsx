// src/components/services/services.tsx
import { Dot, SectionHeading } from "../section-heading";
import { ServicesInteractive } from "./services-interactive";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y relative">
      <div className="shell">
        <SectionHeading
          id="services-title"
          number="02"
          label="Services"
          lines={[
            "Four kinds",
            <>
              <em>of edit</em>
              <Dot />
            </>,
          ]}
          lede="Each format has its own rhythm. Pick one to see its timeline."
        />

        <ServicesInteractive />
      </div>
    </section>
  );
}
