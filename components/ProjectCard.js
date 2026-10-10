"use client";

export default function ProjectCard({ project, number }) {
  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <article className="project-card" onMouseMove={handleMove}>
      <div className="project-art">
        <span className="project-number">{String(number).padStart(2, "0")}</span>
        <span className="project-category">
          {project.categories.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </span>
        <span className="project-symbol">{project.symbol}</span>
      </div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-meta">
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
        {project.repo && (
          <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">
            View source on GitHub ↗
          </a>
        )}
      </div>
    </article>
  );
}