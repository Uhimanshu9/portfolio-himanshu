import Link from "next/link";
import { notFound } from "next/navigation";
import { internshipProjects } from "@/lib/internship-projects";

export function generateStaticParams() {
  return internshipProjects.map(({ slug }) => ({ slug }));
}

export default async function InternshipProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = internshipProjects.find((item) => item.slug === slug);

  if (!project) notFound();

  return <main className="min-h-screen bg-bg px-6 py-10 text-text-primary md:px-10 md:py-14"><div className="mx-auto max-w-4xl"><Link href="/#journal" className="text-[10px] uppercase tracking-[.22em] text-muted transition-colors hover:text-text-primary">← Back to internship projects</Link><p className="mt-16 text-[10px] uppercase tracking-[.22em] text-muted">{project.status}</p><h1 className="mt-5 text-5xl leading-[.9] tracking-[-.04em] md:text-8xl">{project.title}</h1><div className="mt-10 rounded-[28px] border border-stroke bg-surface p-6 md:p-8"><p className="text-[10px] uppercase tracking-[.2em] text-muted">Impact</p><p className="mt-3 font-display text-3xl italic leading-tight md:text-4xl">{project.metric}</p></div><div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_.9fr]"><div><h2 className="text-[10px] uppercase tracking-[.22em] text-muted">Overview</h2><p className="mt-4 text-base leading-8 text-text-primary/80 md:text-lg">{project.description}</p></div><div><h2 className="text-[10px] uppercase tracking-[.22em] text-muted">Key details</h2><ul className="mt-4 space-y-4 text-sm leading-6 text-text-primary/75">{project.highlights.map((highlight) => <li key={highlight} className="border-l border-stroke pl-4">{highlight}</li>)}</ul></div></div></div></main>;
}
