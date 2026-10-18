// src/components/work/work.tsx
import { projects } from "@/content/projects";
import { Dot, SectionHeading } from "../section-heading";
import { ProjectCard } from "./project-card";
import { StackCard, StackContainer } from "./stack";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-y relative">
      <div className="shell">
        <SectionHeading
          id="work-title"
          number="01"
          label="Selected work"
          lines={[
            "Selected",
            <>
              <em>work</em>
              <Dot />
            </>,
          ]}
          lede="Six recent edits, from long-form documentaries to creator commentary."
        />

        <StackContainer count={projects.length}>
          {projects.map((project, i) => (
            <StackCard key={project.id} index={i} count={projects.length}>
              <ProjectCard project={project} index={i} />
            </StackCard>
          ))}
        </StackContainer>
      </div>
    </section>
  );
}
