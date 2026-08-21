"use client";

import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import Hls from "hls.js";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { internshipProjects } from "@/lib/internship-projects";

const videoSource = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";
const roles = ["AI Engineer", "Agent Builder", "Systems Researcher", "Open Source Builder", "Freelancer"];

const projects = [
  {
    title: "ClaimIQ",
    tag: "RAG / Insurance",
    metric: "15% higher query accuracy",
    description: "A clause-level insurance document intelligence system with retrieval, highlighting, and filtering.",
    tech: "React.js · FastAPI · Gemini · MongoDB",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=85",
    url: "https://github.com/Uhimanshu9/ClaimIQ",
    span: "md:col-span-7",
    tall: true,
  },
  {
    title: "CodeWhisper",
    tag: "Agentic Development",
    metric: "40% fewer LLM tokens",
    description: "An autonomous coding assistant for project creation, task execution, and code generation with persistent memory.",
    tech: "Python · LangChain · LangGraph · Qdrant",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=85",
    url: "https://github.com/Uhimanshu9/CodeWhisper",
    span: "md:col-span-5",
    tall: false,
  },
  {
    title: "CShell",
    tag: "Systems / POSIX",
    metric: "Global Rank 141",
    description: "A Unix shell implemented in Python with parsing, processes, pipes, redirection, and built-in commands.",
    tech: "Python · Linux · POSIX APIs",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=85",
    url: "https://github.com/Uhimanshu9/CShell",
    span: "md:col-span-5",
    tall: false,
  },
  {
    title: "VoltAnalytics",
    tag: "EV Data Platform",
    metric: "25× API speedup",
    description: "Vehicle health analysis and a high-performance data API for EV telemetry, DynamoDB, and S3 workloads.",
    tech: "FastAPI · AWS · DynamoDB · S3",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1400&q=85",
    url: "https://github.com/Uhimanshu9/VoltAnalytics-BE",
    span: "md:col-span-7",
    tall: true,
  },
];

const skillGroups = [
  { label: "AI / LLM systems", skills: "RAG, embeddings, evaluation, fine-tuning" },
  { label: "Agentic systems", skills: "Multi-agent systems, LangGraph, MCP, A2A, tool calling" },
  { label: "Backend & systems", skills: "Python, C++, JavaScript, Node.js, FastAPI, REST, Linux, POSIX" },
  { label: "Data & storage", skills: "MongoDB, Redis, Neo4j, Qdrant, FAISS, vector databases" },
  { label: "Cloud & DevOps", skills: "AWS, Docker, Jenkins, Langfuse, Git" },
];

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;
    let completionTimer: number | undefined;
    // Chrome can pause animation frames while restoring a page through browser
    // history. Ensure the full-screen intro never blocks the restored page.
    const fallbackTimer = window.setTimeout(onComplete, 3500);
    const tick = (now: number) => {
      const progress = Math.min((now - started) / 2100, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else completionTimer = window.setTimeout(onComplete, 400);
    };
    frame = requestAnimationFrame(tick);
    const wordTimer = window.setInterval(() => setWordIndex((index) => (index + 1) % 3), 900);
    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(wordTimer);
      if (completionTimer) window.clearTimeout(completionTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [onComplete]);

  return <motion.div className="loading-screen fixed inset-0 z-[9999]" exit={{ opacity: 0 }} transition={{ duration: .7, ease: "easeInOut" }}>
    <motion.div className="absolute left-6 top-6 text-[10px] uppercase tracking-[.3em] text-muted md:left-10 md:top-10" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .8, delay: .2 }}>Himanshu Dahiya</motion.div>
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden"><AnimatePresence mode="wait"><motion.div key={wordIndex} className="loading-word font-display text-5xl italic text-text-primary/80 md:text-7xl" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: .38 }}>{["Build", "Reason", "Ship"][wordIndex]}</motion.div></AnimatePresence></div>
    <div className="absolute bottom-7 right-6 font-display text-7xl leading-none tabular-nums text-text-primary md:bottom-10 md:right-10 md:text-9xl">{String(count).padStart(3, "0")}</div>
    <div className="absolute bottom-0 left-0 h-[3px] w-full bg-stroke/50"><div className="loading-bar accent-gradient h-full" style={{ transform: `scaleX(${count / 100})` }} /></div>
  </motion.div>;
}

function BackgroundVideo({ className = "", videoRef: suppliedRef }: { className?: string; videoRef?: RefObject<HTMLVideoElement | null> }) {
  const localRef = useRef<HTMLVideoElement>(null);
  const videoRef = suppliedRef ?? localRef;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hls: Hls | undefined;
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(videoSource);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = videoSource;
    return () => { hls?.destroy(); };
  }, [videoRef]);
  return <video ref={videoRef} className={`pointer-events-none absolute object-cover ${className}`} autoPlay muted loop playsInline aria-hidden="true" />;
}

type TrailPoint = { x: number; y: number; born: number; strength: number };

function MorphReveal({ videoRef, nameRef, entranceReady }: { videoRef: RefObject<HTMLVideoElement | null>; nameRef: RefObject<HTMLHeadingElement | null>; entranceReady: boolean }) {
  const systemCanvasRef = useRef<HTMLCanvasElement>(null);
  const nameCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const systemCanvas = systemCanvasRef.current;
    const nameCanvas = nameCanvasRef.current;
    const hero = systemCanvas?.parentElement;
    if (!systemCanvas || !nameCanvas || !hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduced.matches || !precisePointer.matches) return;

    const system = systemCanvas.getContext("2d");
    const name = nameCanvas.getContext("2d");
    if (!system || !name) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let inside = false;
    let lastFrame = performance.now();
    let entranceStart = 0;
    let entranceDone = false;
    let lastPointerMoveAt = 0;
    let lastSample: TrailPoint | null = null;
    const trail: TrailPoint[] = [];

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (const canvas of [systemCanvas, nameCanvas]) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    const addPoint = (x: number, y: number, now: number, strength = 1) => {
      const previous = trail.at(-1);
      if (previous) {
        const distance = Math.hypot(x - previous.x, y - previous.y);
        if (distance < 8) return;
        const steps = Math.min(Math.floor(distance / 8), 8);
        for (let step = 1; step < steps; step++) {
          const progress = step / steps;
          trail.push({ x: previous.x + (x - previous.x) * progress, y: previous.y + (y - previous.y) * progress, born: now, strength });
        }
      }
      trail.push({ x, y, born: now, strength });
      if (trail.length > 60) trail.splice(0, trail.length - 60);
      lastSample = trail.at(-1) ?? null;
    };

    const pointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      inside = true;
      lastPointerMoveAt = performance.now();
      addPoint(event.clientX - rect.left, event.clientY - rect.top, performance.now());
    };
    const pointerLeave = () => { inside = false; lastSample = null; };

    const blobPath = (ctx: CanvasRenderingContext2D, point: TrailPoint, index: number, now: number, scale: number) => {
      const age = (now - point.born) / 1000;
      const isCursorHead = index === trail.length - 1 && inside;
      const idleProgress = isCursorHead ? Math.min(1, Math.max(0, (now - lastPointerMoveAt - 90) / 260)) : 0;
      const headRadius = 125 - idleProgress * (125 - 96 / 2.54 * 3);
      const baseRadius = (isCursorHead ? headRadius : 70) * scale * point.strength;
      const vertices: Array<[number, number]> = [];
      for (let vertex = 0; vertex < 24; vertex++) {
        const angle = (vertex / 24) * Math.PI * 2;
        const deformation = isCursorHead ? 1 - idleProgress : 1;
        const noise = (Math.sin(angle * 3 + now * .0017 + index * .41) * .105 + Math.cos(angle * 5 - now * .0011 + index * .23) * .06) * deformation;
        const radius = baseRadius * (1 + noise);
        vertices.push([point.x + Math.cos(angle) * radius, point.y + Math.sin(angle) * radius]);
      }
      ctx.moveTo((vertices[0][0] + vertices[23][0]) / 2, (vertices[0][1] + vertices[23][1]) / 2);
      for (let vertex = 0; vertex < 24; vertex++) {
        const current = vertices[vertex];
        const next = vertices[(vertex + 1) % 24];
        ctx.quadraticCurveTo(current[0], current[1], (current[0] + next[0]) / 2, (current[1] + next[1]) / 2);
      }
      ctx.closePath();
      return age;
    };

    const buildMask = (ctx: CanvasRenderingContext2D, now: number) => {
      ctx.beginPath();
      trail.forEach((point, index) => {
        const age = (now - point.born) / 1000;
        const life = Math.max(0, 1 - age / 1.25);
        const isCursorHead = index === trail.length - 1 && inside;
        const tailScale = isCursorHead ? 1 : .22 + .78 * life * Math.min(1, (index + 5) / 18);
        blobPath(ctx, point, index, now, tailScale);
      });
      ctx.clip();
    };

    const drawVideoCover = (ctx: CanvasRenderingContext2D) => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !video.videoWidth) return;
      const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      ctx.save();
      ctx.filter = "saturate(1.45) hue-rotate(18deg) brightness(.82) contrast(1.12)";
      ctx.drawImage(video, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      ctx.restore();
    };

    const drawTechnicalLayer = (ctx: CanvasRenderingContext2D, now: number) => {
      const wash = ctx.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, "rgba(22, 106, 255, .34)");
      wash.addColorStop(.55, "rgba(48, 71, 255, .24)");
      wash.addColorStop(1, "rgba(137, 56, 255, .38)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = .65;
      ctx.strokeStyle = "rgba(136, 192, 255, .12)";
      for (let x = 0; x < width; x += 34) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); }
      for (let y = 0; y < height; y += 34) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); }

      const nodes = Array.from({ length: 30 }, (_, index) => ({
        x: ((index * 193) % 997) / 997 * width,
        y: ((index * 317 + 71) % 887) / 887 * height,
      }));
      nodes.forEach((node, index) => {
        const pulse = .5 + .5 * Math.sin(now * .0018 + index);
        ctx.fillStyle = `rgba(160, 211, 255, ${.22 + pulse * .32})`;
        ctx.beginPath(); ctx.arc(node.x, node.y, 1.2 + pulse * 1.3, 0, Math.PI * 2); ctx.fill();
        const next = nodes[(index + 7) % nodes.length];
        if (Math.hypot(next.x - node.x, next.y - node.y) < width * .38) {
          ctx.strokeStyle = "rgba(138, 176, 255, .18)";
          ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(next.x, next.y); ctx.stroke();
          const route = (now * .00008 + index * .19) % 1;
          ctx.fillStyle = "rgba(208, 226, 255, .65)";
          ctx.beginPath(); ctx.arc(node.x + (next.x - node.x) * route, node.y + (next.y - node.y) * route, 1.15, 0, Math.PI * 2); ctx.fill();
        }
      });

      ctx.font = "500 8px Inter, sans-serif";
      ctx.letterSpacing = "1.6px";
      ctx.fillStyle = "rgba(194, 214, 255, .25)";
      ["AGENTIC AI", "LANGGRAPH", "RAG", "FASTAPI", "MCP", "EVALUATION"].forEach((label, index) => {
        ctx.fillText(label, width * (.11 + (index % 3) * .34), height * (.25 + Math.floor(index / 3) * .42));
      });
    };

    const drawName = (ctx: CanvasRenderingContext2D, now: number) => {
      const heading = nameRef.current;
      if (!heading) return;
      const heroRect = hero.getBoundingClientRect();
      const headingStyle = getComputedStyle(heading);
      const surname = heading.querySelector("span");
      const firstNameNode = heading.firstChild;
      if (!surname || !firstNameNode) return;
      const firstNameRange = document.createRange();
      firstNameRange.selectNodeContents(firstNameNode);
      const firstNameRect = firstNameRange.getBoundingClientRect();
      const surnameRect = surname.getBoundingClientRect();
      const surnameStyle = getComputedStyle(surname);
      const fontSize = parseFloat(headingStyle.fontSize);
      const lineTop = Math.min(firstNameRect.top, surnameRect.top) - heroRect.top;
      const lineBottom = Math.max(firstNameRect.bottom, surnameRect.bottom) - heroRect.top;
      const startX = Math.min(firstNameRect.left, surnameRect.left) - heroRect.left;
      const endX = Math.max(firstNameRect.right, surnameRect.right) - heroRect.left;
      ctx.textBaseline = "alphabetic";
      ctx.letterSpacing = headingStyle.letterSpacing;
      const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
      gradient.addColorStop(0, "#43b8ff"); gradient.addColorStop(.52, "#6478ff"); gradient.addColorStop(1, "#b45cff");
      ctx.fillStyle = gradient;
      ctx.font = `${headingStyle.fontWeight} ${fontSize}px ${headingStyle.fontFamily}`;
      ctx.fillText("Himanshu", firstNameRect.left - heroRect.left, firstNameRect.top - heroRect.top + fontSize);
      ctx.font = `${surnameStyle.fontStyle} ${surnameStyle.fontWeight} ${fontSize}px ${surnameStyle.fontFamily}`;
      ctx.letterSpacing = surnameStyle.letterSpacing;
      ctx.fillText("Dahiya", surnameRect.left - heroRect.left, surnameRect.top - heroRect.top + fontSize);
      ctx.globalAlpha = .2;
      ctx.strokeStyle = "#c4ddff";
      ctx.lineWidth = .55;
      const shift = (now * .018) % 18;
      for (let gx = startX - 20 + shift; gx < endX + 20; gx += 18) { ctx.beginPath(); ctx.moveTo(gx, lineTop); ctx.lineTo(gx, lineBottom); ctx.stroke(); }
      for (let gy = lineTop + shift; gy < lineBottom; gy += 18) { ctx.beginPath(); ctx.moveTo(startX, gy); ctx.lineTo(endX, gy); ctx.stroke(); }
      ctx.globalAlpha = 1;
    };

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible || document.hidden || width === 0) return;
      const dt = Math.min((now - lastFrame) / 16.67, 2);
      lastFrame = now;

      if (entranceReady && !entranceDone && entranceStart === 0) entranceStart = now + 700;
      if (entranceStart && now >= entranceStart && !entranceDone) {
        const progress = (now - entranceStart) / 1250;
        const heading = nameRef.current?.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        if (heading && progress <= 1) addPoint(heading.left - heroRect.left + heading.width * (.08 + progress * .84), heading.top - heroRect.top + heading.height * (.46 + Math.sin(progress * Math.PI) * .12), now, .78);
        else if (progress > 1) entranceDone = true;
      }

      for (let index = trail.length - 1; index >= 0; index--) {
        trail[index].strength -= (inside && index === trail.length - 1 ? .0018 : .012) * dt;
        if (now - trail[index].born > 1350 || trail[index].strength <= .02) trail.splice(index, 1);
      }
      if (inside && lastSample) {
        lastSample.strength = Math.min(1, lastSample.strength + .08 * dt);
        lastSample.born = now;
      }

      for (const [canvas, ctx] of [[systemCanvas, system], [nameCanvas, name]] as const) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        if (!trail.length) continue;
        ctx.save();
        buildMask(ctx, now);
        if (canvas === systemCanvas) { drawVideoCover(ctx); drawTechnicalLayer(ctx, now); }
        else drawName(ctx, now);
        ctx.restore();
      }
    };

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .01 });
    observer.observe(hero);
    resize();
    hero.addEventListener("pointermove", pointerMove, { passive: true });
    hero.addEventListener("pointerleave", pointerLeave);
    window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      hero.removeEventListener("pointermove", pointerMove);
      hero.removeEventListener("pointerleave", pointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, [entranceReady, nameRef, videoRef]);

  return <>
    <canvas ref={systemCanvasRef} className="morph-system-canvas" aria-hidden="true" />
    <canvas ref={nameCanvasRef} className="morph-name-canvas" aria-hidden="true" />
  </>;
}

function Logo() {
  return <a href="#home" className="nav-logo relative flex h-9 w-9 items-center justify-center rounded-full" aria-label="Himanshu Dahiya home"><span className="logo-ring accent-gradient absolute inset-0 rounded-full" /><span className="logo-core relative z-10 flex h-[31px] w-[31px] items-center justify-center rounded-full bg-bg font-display text-[13px] italic text-text-primary">HD</span></a>;
}

function Navbar({ activeSection }: { activeSection: string }) {
  const links = [{ label: "Home", href: "#home", id: "home" }, { label: "Internship Projects", href: "#journal", id: "journal" }, { label: "Personal Projects", href: "#work", id: "work" }, { label: "Resume", href: "#resume", id: "resume" }];
  return <nav className="site-nav fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 md:pt-6" aria-label="Primary navigation"><div className="nav-shell inline-flex items-center rounded-full border border-white/10 bg-surface/75 px-2 py-2 backdrop-blur-md"><Logo /><span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />{links.map((link) => <a key={link.id} href={link.href} className={`rounded-full px-3 py-1.5 text-[11px] transition-colors sm:px-4 sm:py-2 sm:text-xs ${activeSection === link.id ? "bg-stroke/70 text-text-primary" : "text-muted hover:bg-stroke/50 hover:text-text-primary"}`}>{link.label}</a>)}<span className="mx-1 hidden h-5 w-px bg-stroke sm:block" /><a href="#contact" className="gradient-border ml-0 rounded-full p-[1px] text-[11px] sm:text-xs"><span className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 sm:px-4 sm:py-2">Say hi <span aria-hidden="true">↗</span></span></a></div></nav>;
}

function SectionHeader({ eyebrow, title, italic, subtext, cta }: { eyebrow: string; title: string; italic: string; subtext: string; cta?: string }) {
  return <motion.div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: [.25, .1, .25, 1] }}><div><div className="mb-5 flex items-center gap-3"><span className="section-rule" /><span className="section-eyebrow text-[10px] uppercase text-muted">{eyebrow}</span></div><h2 className="section-heading m-0 max-w-2xl text-5xl leading-[.9] text-text-primary sm:text-6xl md:text-7xl">{title} <span className="font-display italic">{italic}</span></h2><p className="mt-5 max-w-md text-sm leading-6 text-muted md:text-[15px]">{subtext}</p></div>{cta && <a className="arrow-button hidden items-center gap-3 whitespace-nowrap text-xs uppercase tracking-[.2em] text-muted md:inline-flex" href="#contact">{cta}<span className="text-base">↗</span></a>}</motion.div>;
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return <a href={project.url} target="_blank" rel="noreferrer" className={`work-card group relative block rounded-[28px] border border-stroke bg-surface ${project.span} ${project.tall ? "tall" : ""}`}><img className="absolute inset-0 h-full w-full object-cover" src={project.image} alt="" loading="lazy" /><div className="halftone pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" /><div className="work-shade absolute inset-0 flex items-center justify-center bg-bg/75 opacity-0"><span className="hover-pill gradient-border rounded-full p-[1px]"><span className="flex items-center gap-2 rounded-full bg-text-primary px-5 py-3 text-xs text-bg">Open repository <span aria-hidden="true">↗</span></span></span></div><div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-4"><span className="rounded-full border border-white/20 bg-bg/60 px-3 py-2 text-[9px] uppercase tracking-[.16em] text-white/80 backdrop-blur-sm">{project.metric}</span><span className="font-display text-3xl text-white/80">0{index + 1}</span></div><div className="absolute bottom-5 left-5 right-5 text-white"><div className="mb-2 text-[10px] uppercase tracking-[.18em] text-white/60">{project.tag}</div><h3 className="font-display text-4xl italic leading-none">{project.title}</h3><p className="mt-2 max-w-md text-xs leading-5 text-white/70">{project.description}</p><div className="mt-3 text-[9px] uppercase tracking-[.16em] text-white/50">{project.tech}</div></div></a>;
}

function NoteRow({ note }: { note: (typeof internshipProjects)[number] }) {
  return <a href={`/internship-projects/${note.slug}`} className="journal-row group flex items-center gap-4 rounded-[30px] border border-stroke bg-surface/30 p-3 transition-colors hover:border-white/30 hover:bg-surface sm:gap-6 sm:rounded-full"><div className="note-index flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-stroke font-display text-2xl italic text-text-primary sm:h-16 sm:w-16">↗</div><div className="min-w-0 flex-1"><div className="mb-1 text-[9px] uppercase tracking-[.22em] text-muted">{note.status}</div><h3 className="text-sm text-text-primary sm:text-base">{note.title}</h3><p className="mt-1 text-xs leading-5 text-muted md:hidden">{note.metric}</p></div><div className="hidden max-w-sm text-right md:block"><div className="translate-y-1 text-[10px] uppercase tracking-[.15em] text-muted opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">Impact</div><div className="mt-1 translate-y-1 text-xs leading-5 text-text-primary/80 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">{note.metric}</div><div className="text-xs text-muted transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0">Hover to see impact</div></div><span className="pr-2 text-base text-text-primary transition-transform group-hover:translate-x-1">↗</span></a>;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const marqueeRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const finishLoading = useCallback(() => setIsLoading(false), []);

  useEffect(() => { const timer = window.setInterval(() => setRoleIndex((index) => (index + 1) % roles.length), 2200); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const sections = ["home", "work", "journal", "resume", "contact"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => { const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]; if (visible) setActiveSection(visible.target.id); }, { rootMargin: "-30% 0px -55%", threshold: [0, .25, .5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (!marqueeRef.current) return; const tween = gsap.to(marqueeRef.current, { xPercent: -50, duration: 40, ease: "none", repeat: -1 }); return () => { tween.kill(); }; }, []);
  useEffect(() => { document.body.style.overflow = isLoading ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isLoading]);

  return <>
    <AnimatePresence>{isLoading && <LoadingScreen onComplete={finishLoading} />}</AnimatePresence>
    <Navbar activeSection={activeSection} />
    <main>
      <section className="hero-section grain relative flex min-h-screen items-center justify-center overflow-hidden" id="home"><div className="hero-fallback absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=80)" }} /><BackgroundVideo videoRef={heroVideoRef} className="hero-video z-[1] opacity-65" /><div className="absolute inset-0 z-[2] bg-black/45" /><div className="hero-grid pointer-events-none absolute inset-0 z-[2]" /><div className="absolute inset-x-0 bottom-0 z-[3] h-48 bg-gradient-to-t from-bg to-transparent" /><MorphReveal videoRef={heroVideoRef} nameRef={heroNameRef} entranceReady={!isLoading} /><div className="hero-content relative z-10 flex w-full flex-col items-center px-6 text-center"><p className="blur-in mb-8 text-[10px] uppercase tracking-[.3em] text-muted md:text-xs">AI engineer · Bangalore · India</p><h1 ref={heroNameRef} className="name-reveal m-0 max-w-5xl text-7xl leading-[.82] tracking-[-.04em] text-text-primary sm:text-8xl md:text-[9.5rem]">Himanshu <span className="font-display italic">Dahiya</span></h1><p className="blur-in mt-7 text-sm text-muted md:text-base"><span key={roleIndex} className="animate-role-fade-in inline-block font-display text-2xl italic text-text-primary md:text-3xl">{roles[roleIndex]}</span></p><p className="blur-in mt-6 max-w-xl rounded-2xl border border-white/15 bg-black/35 px-5 py-4 text-sm leading-6 text-white/85 shadow-2xl backdrop-blur-md md:mt-8 md:px-7 md:py-5 md:text-base">Designing reliable agentic systems, high-performance APIs, and intelligent tools that turn complex workflows into clear outcomes.</p><div className="blur-in mt-10 flex flex-wrap justify-center gap-3 md:mt-12"><a href="#work" className="hero-cta hero-primary rounded-full px-7 py-3.5 text-sm">Explore work</a><a href="https://github.com/Uhimanshu9" target="_blank" rel="noreferrer" className="hero-cta gradient-border rounded-full p-[1px] text-sm"><span className="flex rounded-full bg-bg px-7 py-3.5">GitHub <span className="ml-2">↗</span></span></a></div><div className="mt-14 grid w-full max-w-2xl grid-cols-3 gap-3 text-left md:mt-20"><div className="metric-card"><div className="font-display text-3xl text-text-primary md:text-4xl">15<span className="accent-text">+</span></div><div className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted">Projects Built</div></div><div className="metric-card"><div className="font-display text-3xl text-text-primary md:text-4xl">100<span className="accent-text">%</span></div><div className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted">Custom Solutions</div></div><div className="metric-card"><div className="font-display text-3xl text-text-primary md:text-4xl">E2E</div><div className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted">Idea to Deployment</div></div></div></div><div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[.25em] text-muted"><span>Scroll</span><span className="scroll-line relative h-10 w-px bg-stroke"><span className="animate-scroll-down absolute left-0 top-0 h-1/2 w-full bg-text-primary" /></span></div></section>

      <section className="bg-bg py-20 md:py-28" id="journal"><div className="section-wrap"><SectionHeader eyebrow="Internship projects so far" title="Production" italic="application" subtext="Click a project to explore its approach, outcomes, and current status. Hover to preview its impact." /><div className="flex flex-col gap-3">{internshipProjects.map((note) => <NoteRow key={note.slug} note={note} />)}</div></div></section>

      <section className="bg-bg py-20 md:py-28" id="work"><div className="section-wrap"><SectionHeader eyebrow="Selected work" title="Builts" italic="(personal projects)" subtext="A selection of systems spanning retrieval, agentic development, Unix internals, and production data infrastructure." cta="See GitHub" /><div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">{projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}</div></div></section>

      <section className="bg-bg py-20 md:py-28" id="resume"><div className="section-wrap"><div className="mb-10 flex items-center gap-3"><span className="section-rule" /><span className="section-eyebrow text-[10px] uppercase text-muted">Experience & toolkit</span></div><div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:gap-20"><div><h2 className="section-heading text-5xl leading-[.9] md:text-7xl">Experience</h2><div className="mt-10 border-t border-stroke"><div className="timeline-row border-b border-stroke py-6"><div className="flex items-start justify-between gap-5"><h3 className="text-lg text-text-primary">Scopely — AI Engineer Intern</h3><span className="text-[10px] uppercase tracking-[.14em] text-muted">Present</span></div><p className="mt-3 text-sm leading-6 text-muted">Built LOVA, a multi-agent LiveOps validation platform, reducing QA from 8 person-days per week to 30 minutes and validating 50K+ production configuration fields with explainable audit evidence.</p></div><div className="timeline-row border-b border-stroke py-6"><div className="flex items-start justify-between gap-5"><h3 className="text-lg text-text-primary">Transvolt Mobility — Data Science Intern</h3><span className="text-[10px] uppercase tracking-[.14em] text-muted">2025</span></div><p className="mt-3 text-sm leading-6 text-muted">Developed EV health analytics and an authenticated FastAPI layer over DynamoDB and S3 for 20L+ records, achieving a 25× speedup from 25 seconds to 1 millisecond.</p></div><div className="timeline-row py-6"><div className="flex items-start justify-between gap-5"><h3 className="text-lg text-text-primary">Research — TEE-based FaaS security</h3><span className="text-[10px] uppercase tracking-[.14em] text-muted">2025 — Present</span></div><p className="mt-3 text-sm leading-6 text-muted">Co-author on DoW attack mitigation with TEEs at Bennett University; the work was accepted at IEEE IC3I 2025 with 100% mitigation and 12.9% latency overhead.</p></div></div></div><div><h3 className="text-[10px] uppercase tracking-[.28em] text-muted">Technical skills</h3><div className="mt-5 flex flex-col gap-5">{skillGroups.map((group) => <div key={group.label} className="skill-group"><div className="text-sm font-medium text-text-primary">{group.label}</div><div className="mt-1 text-sm leading-6 text-muted">{group.skills}</div></div>)}</div><div className="mt-12 grid grid-cols-2 gap-3"><div className="metric-card"><div className="font-display text-3xl">8.8<span className="accent-text">/10</span></div><div className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted">B.Tech CGPA</div></div><div className="metric-card"><div className="font-display text-3xl">2026</div><div className="mt-1 text-[9px] uppercase tracking-[.16em] text-muted">Graduation</div></div></div><p className="mt-8 text-sm leading-6 text-muted">B.Tech in Computer Science, AI Specialization · Bennett University · Greater Noida, Delhi-NCR.</p></div></div></div></section>

      <footer className="contact-section grain relative overflow-hidden bg-bg pb-8 pt-20 md:pb-12 md:pt-28" id="contact"><div className="absolute inset-0 z-0 overflow-hidden"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2200&q=75')] bg-cover bg-center opacity-30" /><BackgroundVideo className="contact-video left-1/2 top-1/2 z-[1] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-y-[-1] object-cover" /><div className="absolute inset-0 z-[2] bg-black/70" /></div><div className="relative z-10"><div className="marquee-window mb-20 overflow-hidden border-y border-white/10 py-5 md:mb-28 md:py-8"><div ref={marqueeRef} className="marquee-track flex w-max items-center gap-8 pl-8 font-display text-6xl italic md:text-9xl"><span className="marquee-word">Build with intent</span><span className="text-text-primary/70">•</span><span className="marquee-word">Build with intent</span><span className="text-text-primary/70">•</span><span className="marquee-word">Build with intent</span><span className="text-text-primary/70">•</span><span className="marquee-word">Build with intent</span><span className="text-text-primary/70">•</span></div></div><div className="section-wrap flex flex-col items-center text-center"><p className="section-eyebrow text-[10px] uppercase text-muted">Have a problem worth solving?</p><h2 className="mt-5 max-w-3xl text-6xl leading-[.85] tracking-[-.04em] sm:text-7xl md:text-9xl">Let&apos;s build <span className="font-display italic">something</span> useful.</h2><div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-14"><a href="mailto:dev.himanshu.ai@gmail.com" className="gradient-border rounded-full p-[1px] text-sm"><span className="flex items-center gap-4 rounded-full bg-bg px-7 py-4">dev.himanshu.ai@gmail.com <span>↗</span></span></a><a href="https://github.com/Uhimanshu9" target="_blank" rel="noreferrer" className="rounded-full border border-stroke px-7 py-4 text-sm text-muted transition-colors hover:text-text-primary">github.com/Uhimanshu9</a></div></div><div className="section-wrap mt-24 flex flex-col gap-7 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[.18em] text-muted md:mt-32 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-5 md:gap-7"><a className="footer-link" href="https://www.linkedin.com/in/himanshu-dev-ai/" target="_blank" rel="noreferrer">LinkedIn</a><a className="footer-link" href="https://github.com/Uhimanshu9" target="_blank" rel="noreferrer">GitHub</a><a className="footer-link" href="tel:+919352019485">+91 93520 19485</a></div><div className="flex items-center gap-3"><span className="availability-dot" />Open to building useful systems</div><span>© 2026 Himanshu Dahiya</span></div></div></footer>
    </main>
  </>;
}

export default function Home() { return <App />; }
