import Link from "next/link";
import { SiteNav } from "./SiteNav";

export function PageShell({
  active,
  eyebrow,
  title,
  intro,
  children
}: {
  active?: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav active={active} />
      <main className="site-main min-h-screen bg-[#fafafa] px-3 pb-20 pt-32 md:px-4 md:pt-40">
        <section className="mb-16 grid min-w-0 gap-8 md:grid-cols-[minmax(160px,0.55fr)_minmax(0,1.8fr)]">
          <p className="text-[10px] uppercase text-[#9a9a9a]">{eyebrow}</p>
          <div className="min-w-0 max-w-4xl">
            <h1 className="max-w-5xl break-words text-[clamp(32px,10vw,72px)] font-normal uppercase leading-[0.9] md:text-[clamp(38px,7.22vw,105px)]">
              {title}
            </h1>
            {intro ? <p className="mt-8 max-w-2xl text-[15px] leading-snug md:text-[17px]">{intro}</p> : null}
          </div>
        </section>
        {children}
      </main>
      <footer className="page-shell-footer fixed bottom-3 z-20 flex gap-3 text-[10px] uppercase text-[#777]">
        <Link href="/cv">CV</Link>
        <Link href="/publications">Publications</Link>
        <Link href="/education">Education</Link>
      </footer>
    </>
  );
}
