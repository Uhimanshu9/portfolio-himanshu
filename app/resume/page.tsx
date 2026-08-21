import type { Metadata } from "next";

const resumeUrl = "/Himanshu-Dahiya-Resume.pdf";

export const metadata: Metadata = {
  title: "Resume — Himanshu Dahiya",
  description: "View or download Himanshu Dahiya's resume.",
};

export default function ResumePage() {
  return (
    <main className="resume-page min-h-screen bg-bg text-text-primary">
      <header className="resume-toolbar">
        <a href="/" className="resume-back" aria-label="Back to portfolio">
          <span aria-hidden="true">←</span> Portfolio
        </a>
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[.26em] text-muted">Curriculum vitae</p>
          <h1 className="mt-1 font-display text-2xl italic">Himanshu Dahiya</h1>
        </div>
        <div className="flex items-center gap-2">
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="resume-secondary-action">
            Open <span aria-hidden="true">↗</span>
          </a>
          <a href={resumeUrl} download="Himanshu-Dahiya-Resume.pdf" className="resume-download">
            Download PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <section className="resume-viewer" aria-label="Resume preview">
        <iframe src={`${resumeUrl}#view=FitH&toolbar=0`} title="Himanshu Dahiya resume" className="h-full w-full border-0" />
      </section>
    </main>
  );
}
