// src/components/process.tsx
import { Dot, SectionHeading } from "./section-heading";
import { ProcessTimeline } from "./process-timeline";

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y relative overflow-x-clip">
      <div className="shell">
        <SectionHeading
          id="process-title"
          number="04"
          label="The process"
          lines={[
            "From brief",
            <>
              to <em>final frame</em>
              <Dot />
            </>,
          ]}
          lede="Five stages, one timeline."
        />

        <ProcessTimeline />
      </div>
    </section>
  );
}
