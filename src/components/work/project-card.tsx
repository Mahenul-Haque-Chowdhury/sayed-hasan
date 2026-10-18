// src/components/work/project-card.tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import { isPlayable, type Project, type ProjectFormat } from "@/content/projects";
import { PosterArt } from "./poster-art";
import { ProjectMedia } from "./project-media";

/** Frame aspect per format. Vertical placeholders show a fan of phones in a 5:4 frame. */
const frameRatio: Record<ProjectFormat, string> = {
  "16:9": "16 / 9",
  "2.39:1": "2.39 / 1",
  "4:5": "4 / 5",
  "9:16": "5 / 4",
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const playable = isPlayable(project);
  const wide = project.format === "2.39:1";
  // Alternate which side the picture sits on, for rhythm down the stack.
  const mediaFirst = index % 2 === 1;
  const ratio = playable && project.format === "9:16" ? "9 / 16" : frameRatio[project.format];

  const frame = (
    <div
      className="relative flex min-h-0 items-center justify-center p-3 sm:p-4 lg:size-container lg:h-full lg:p-6"
      style={{ "--ar": ratio } as CSSProperties}
    >
      <MediaFrame project={project} playable={playable} />
    </div>
  );

  const label = (
    <p className="eyebrow text-ivory-dim">
      <span className="text-ember">{String(index + 1).padStart(2, "0")}</span>{" "}
      <span className="ml-2">{project.category}</span>
      {project.channel && (
        <>
          <span aria-hidden="true" className="mx-2 text-ivory-faint">
            ·
          </span>
          <span className="text-ivory">{project.channel}</span>
        </>
      )}
    </p>
  );

  const title = (
    <h3 id={`${project.id}-title`} className="display heading-card">
      {project.title}
    </h3>
  );

  const description = <p className="max-w-[34ch] text-ivory-dim lg:text-lg">{project.description}</p>;

  return (
    <article
      aria-labelledby={`${project.id}-title`}
      className="radius-ui relative h-full overflow-hidden border border-line bg-ink-2"
    >
      {wide ? (
        <div className="flex h-full flex-col">
          <div className="order-2 flex flex-col gap-4 px-5 pb-6 pt-3 lg:order-1 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-10 lg:pb-2 lg:pt-10">
            <div className="flex flex-col gap-4">
              {label}
              {title}
            </div>
            {description}
          </div>
          <div className="order-1 min-h-0 flex-1 lg:order-2">{frame}</div>
        </div>
      ) : (
        <div className="flex h-full flex-col lg:grid lg:grid-cols-12">
          <div
            className={`order-2 flex flex-col gap-4 p-5 pt-3 lg:col-span-5 lg:p-10 ${
              mediaFirst ? "lg:order-2" : "lg:order-1"
            }`}
          >
            {label}
            {title}
            {description}
          </div>
          <div className={`order-1 min-h-0 lg:col-span-7 ${mediaFirst ? "lg:order-1" : "lg:order-2"}`}>{frame}</div>
        </div>
      )}
    </article>
  );
}

function MediaFrame({ project, playable }: { project: Project; playable: boolean }) {
  const still = project.thumbnail ? (
    <Image
      src={project.thumbnail}
      alt=""
      fill
      sizes="(min-width: 1024px) 55vw, 100vw"
      className="object-cover"
    />
  ) : (
    <PosterArt style={project.poster ?? "faceless"} />
  );

  return (
    <div
      data-reveal="wipe"
      className="radius-ui relative w-full overflow-hidden bg-ink-3 aspect-(--ar) lg:w-[min(100cqw,calc(100cqh*var(--ar)))]"
    >
      {playable && project.videoUrl ? (
        <ProjectMedia id={project.id} title={project.title} videoUrl={project.videoUrl}>
          {still}
          <FrameOverlay duration={project.duration} />
        </ProjectMedia>
      ) : (
        <div
          role="img"
          aria-label={`${project.title}: designed placeholder artwork. Project preview coming soon.`}
          className="absolute inset-0"
        >
          {still}
          <FrameOverlay label="Project preview coming soon" duration={project.format} />
        </div>
      )}
    </div>
  );
}

/** Crop marks plus small burn-ins: an optional status label and the runtime. */
function FrameOverlay({ label, duration }: { label?: string; duration: string | null }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_10_9/0.55),transparent_35%)]" />
      <div className="crop-marks absolute inset-3" />
      {label && (
        <span className="eyebrow radius-ui absolute left-4 top-4 flex items-center gap-2 bg-ink/85 px-2.5 py-1.5 text-[0.625rem] text-ivory">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          {label}
        </span>
      )}
      {duration && (
        <span className="eyebrow tabular absolute bottom-4 right-4 text-[0.6875rem] text-ivory">{duration}</span>
      )}
    </div>
  );
}
