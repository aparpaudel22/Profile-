"use client";

import { useState } from "react";
import {
  profile,
  projects,
  certificates,
  hobbies,
} from "./data";
import WebBackground from "../components/WebBackground";
import CornerWeb from "../components/CornerWeb";
import Reveal from "../components/Reveal";
import Typewriter from "../components/Typewriter";
import ScrollProgress from "../components/ScrollProgress";
import ProjectCard from "../components/ProjectCard";
import SwingGame from "../components/SwingGame";
import MusicPlayer from "../components/MusicPlayer";

const roles = [
  "Frontend Developer",
  "Applied ML Explorer",
  "Security-minded Builder",
  "Computer Engineering Student",
];

const categoryOrder = ["Frontend", "Backend", "AI/ML", "Game", "Other"];

const terminalLines = [
  "$ whoami            → apar_paudel",
  "$ stack --list      → react · next.js · python · pytorch",
  "$ scan --threats    → 0 found. curiosity: 100%",
  "$ status            → building something new...",
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [photoOk, setPhotoOk] = useState(true);

  const projectCategories = [
    "All",
    ...categoryOrder.filter((c) => projects.some((p) => p.categories.includes(c))),
    ...new Set(
      projects.flatMap((p) => p.categories).filter((c) => !categoryOrder.includes(c)),
    ),
  ];

  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(activeCategory));

  const socialLinks = [
    { label: "EMAIL", value: profile.email, href: profile.email ? `mailto:${profile.email}` : "" },
    { label: "GITHUB", value: profile.github, href: profile.github },
    { label: "LINKEDIN", value: profile.linkedin, href: profile.linkedin },
    { label: "FACEBOOK", value: profile.facebook, href: profile.facebook },
    { label: "INSTAGRAM", value: profile.instagram, href: profile.instagram },
  ];

  const close = () => setMenuOpen(false);

  return (
    <>
      <WebBackground />
      <ScrollProgress />

      <header className="site-header">
        <a className="brand" href="#home">
          <span>/</span>apar-paudel.com.np<span className="brand-dot">.</span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a href="#about" onClick={close}>About</a>
          <a href="#experience" onClick={close}>Experience</a>
          <a href="#projects" onClick={close}>Projects</a>
          <a href="#certificates" onClick={close}>Certificates</a>
          <a href="#play" onClick={close}>Play</a>
          <a href="#contact" onClick={close}>Contact</a>
          <a className="nav-cv" href={profile.cv} download="myCV.pdf">My CV ↓</a>
        </nav>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <CornerWeb className="web-tl" />
          <CornerWeb className="web-br" />

          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span className="status-dot" />
                SYSTEM ONLINE · COMPUTER ENGINEERING · POKHARA, NEPAL
              </p>

              <h1 className="glitch" data-text={profile.name}>{profile.name}</h1>

              <p className="hero-role">
                <span className="prompt">&gt;</span> <Typewriter words={roles} />
              </p>

              <p className="hero-description">
                Undergraduate Computer Engineering student at {profile.college}.
                I enjoy making useful interfaces, learning through projects, and
                exploring how technology works beneath the surface.
              </p>

              <div className="hero-actions">
                <a className="button button-solid" href="#projects">Explore my work <span>↘</span></a>
                <a className="button button-outline" href={profile.cv} download="myCV.pdf">Download CV <span>↓</span></a>
              </div>

              <div className="terminal">
                <div className="terminal-bar"><i /><i /><i /><span>apar@portfolio:~</span></div>
                <div className="terminal-body">
                  {terminalLines.map((line, i) => (
                    <p key={line} style={{ animationDelay: `${0.8 + i * 0.7}s` }}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="hero-portrait">
              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />
              <div className="portrait-frame">
                {photoOk && (
                  <img
                    src={profile.photo}
                    alt={`Portrait of ${profile.name}`}
                    onError={() => setPhotoOk(false)}
                  />
                )}
                {!photoOk && <span className="photo-placeholder">YOUR PHOTO</span>}
                <span className="scan-line" />
              </div>
              <span className="portrait-caption">{profile.location}</span>
              <span className="portrait-index">28°12′N / 83°59′E</span>
            </div>
          </div>

          <div className="hero-bottom">
            <span>COMPUTER ENGINEERING STUDENT</span>
            <a href="#about">SCROLL TO EXPLORE ↓</a>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {[0, 1].map((n) => (
              <div className="ticker-group" key={n}>
                <b>✳</b><span>FRONTEND ENGINEERING</span>
                <b>✳</b><span>APPLIED MACHINE LEARNING</span>
                <b>✳</b><span>SECURITY-MINDED DESIGN</span>
                <b>✳</b><span>NEURAL NETWORKS</span>
                <b>✳</b><span>THREAT AWARENESS</span>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT */}
        <section className="section" id="about">
          <Reveal className="section-label"><span>ABOUT</span><span>A LITTLE CONTEXT</span></Reveal>
          <div className="two-column about-grid">
            <Reveal>
              <p className="eyebrow">The person behind the pixels</p>
              <h2>Learning by making.<br /><em>Growing with each build.</em></h2>
            </Reveal>
            <Reveal className="about-copy" delay={150}>
              <p className="about-lead">
                I’m an undergraduate Computer Engineering student at {profile.college}.
                My projects have taken me from building web interfaces to exploring
                machine learning and working with real data.
              </p>
              <p>
                I like work that balances a clear user experience with thoughtful
                engineering. Outside the editor, I sing, play musical instruments,
                and make time to explore new ideas.
              </p>
              <div className="detail-list">
                <div><span>STUDYING</span><strong>Computer Engineering</strong></div>
                <div><span>COLLEGE</span><strong>{profile.college}</strong></div>
                <div><span>BASED IN</span><strong>{profile.location}</strong></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="section experience-section" id="experience">
          <Reveal className="section-label"><span>EXPERIENCE</span><span>LEARNED BY DOING</span></Reveal>
          <Reveal as="article" className="experience-card" delay={100}>
            <span className="experience-number">01</span>
            <div>
              <p className="eyebrow">Internship</p>
              <h3>Frontend Developer Intern</h3>
              <p>CodeIT Nepal</p>
            </div>
            <span className="experience-tag">FRONTEND DEVELOPMENT</span>
          </Reveal>
        </section>

        {/* PROJECTS */}
        <section className="section projects-section" id="projects">
          <Reveal className="section-label"><span>PROJECTS</span><span>ORDERED BY SCOPE AND TECHNICAL DEPTH</span></Reveal>
          <Reveal className="section-intro">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2>Ideas made<br /><em>concrete.</em></h2>
            </div>
            <p>
              A selection across machine learning, full-stack development, and
              frontend work. Filter by area to explore.
            </p>
          </Reveal>

          <div className="project-filters" aria-label="Filter projects">
            {projectCategories.map((category) => {
              const count = category === "All"
                ? projects.length
                : projects.filter((p) => p.categories.includes(category)).length;
              return (
                <button
                  className={activeCategory === category ? "filter-button active" : "filter-button"}
                  key={category}
                  type="button"
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category} <span>{count}</span>
                </button>
              );
            })}
          </div>

          <div className="project-grid" key={activeCategory}>
            {visibleProjects.map((project, i) => (
              <div className="project-wrap" style={{ animationDelay: `${i * 90}ms` }} key={project.title}>
                <ProjectCard project={project} number={projects.indexOf(project) + 1} />
              </div>
            ))}
          </div>
        </section>

        {/* TOOLKIT */}
        <section className="learning-section" id="learning">
          <div className="section learning-inner">
            <Reveal className="section-label"><span>TOOLKIT</span><span>FOUNDATIONS & NEXT STEPS</span></Reveal>
            <div className="two-column learning-grid">
              <Reveal>
                <p className="eyebrow">Things I’ve explored</p>
                <h2>Useful tools.<br /><em>Open questions.</em></h2>
                <p className="learning-copy">
                  I learn best by building. These are some of the tools and areas
                  I’ve worked with so far.
                </p>
              </Reveal>
              <Reveal className="skill-groups" delay={150}>
                <div className="skill-group">
                  <h3>Frontend</h3>
                  <p>HTML · CSS · JavaScript · React · Next.js · Responsive interfaces</p>
                </div>
                <div className="skill-group">
                  <h3>AI / ML</h3>
                  <p>Python · Pandas · NLTK · PyTorch · Transformers · scikit-learn</p>
                </div>
                <div className="skill-group">
                  <h3>Other tools</h3>
                  <p>MySQL · Git · Google Colab · Trackio · API integration</p>
                </div>
                <div className="skill-group next-up">
                  <h3>Learning...</h3>
                  <p className="blink-text">_</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section className="section certificates-section" id="certificates">
          <Reveal className="section-label"><span>CERTIFICATES</span><span>VERIFIED</span></Reveal>
          <div className="certificate-list">
            {certificates.map((c, i) => (
              <Reveal as="article" className="certificate-item" key={c.title} delay={i * 120}>
                <span className="certificate-mark">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  {c.file ? (
                    <a href={c.file} target="_blank" rel="noreferrer" className="certificate-link">
                      <h3>{c.title} ↗</h3>
                    </a>
                  ) : (
                    <h3>{c.title}</h3>
                  )}
                  <span>{c.issuer} · {c.date}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOBBIES */}
        <section className="section hobbies-section" id="hobbies">
          <Reveal className="section-label"><span>OUTSIDE THE EDITOR</span><span>THINGS THAT KEEP ME CURIOUS</span></Reveal>
          <div className="two-column hobbies-grid">
            <Reveal>
              <p className="eyebrow">Hobbies & interests</p>
              <h2>Different rhythms.<br /><em>Same curiosity.</em></h2>
            </Reveal>
            <div className="hobby-list">
              {hobbies.map((hobby, i) => (
                <Reveal className="hobby-item" key={hobby} delay={i * 100}>
                  <span>0{i + 1}</span>
                  {hobby}
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ENTERTAINMENT */}
        <section className="section entertainment-section" id="play">
          <Reveal className="section-label"><span>ENTERTAINMENT</span><span>TAKE A SHORT BREAK</span></Reveal>
          <Reveal className="section-intro">
            <div>
              <p className="eyebrow">A little corner of the internet</p>
              <h2>Play something.<br /><em>Listen awhile.</em></h2>
            </div>
          </Reveal>
          <div className="entertainment-grid">
            <Reveal><SwingGame /></Reveal>
            <Reveal delay={150}><MusicPlayer /></Reveal>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-section" id="contact">
          <CornerWeb className="web-contact" />
          <div className="contact-inner">
            <Reveal>
              <p className="eyebrow">CONTACT</p>
              <h2>Have a good idea?<br /><em>Let’s talk.</em></h2>
              <p className="contact-copy">
                I’m open to learning, thoughtful collaborations, and conversations
                about building useful things.
              </p>
            </Reveal>

            <Reveal className="contact-links" delay={150}>
              {socialLinks.map((item) => (
                <div className="contact-row" key={item.label}>
                  <span>{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.label === "EMAIL" ? undefined : "_blank"}
                      rel={item.label === "EMAIL" ? undefined : "noreferrer"}
                    >
                      {item.label === "EMAIL" ? item.value : "Open profile"} ↗
                    </a>
                  ) : (
                    <span className="not-added">Add your {item.label.toLowerCase()} in data.js</span>
                  )}
                </div>
              ))}
              <div className="contact-row">
                <span>CV</span>
                <a href={profile.cv} download="myCV.pdf">Download my CV ↓</a>
              </div>
            </Reveal>
          </div>

          <footer className="site-footer">
            <a className="brand" href="#home"><span>/</span> apar-paudel.com.np<span className="brand-dot">.</span></a>
            <span>©2026 Apar Paudel | 🕸️Every thread tells a story. </span>
            <a href="#home">↑</a>
          </footer>
        </section>
      </main>
    </>
  );
}