import { PageShell } from "@/components/PageShell";
import { SectionLabel } from "@/components/SectionLabel";
import { education } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education",
  description: "Education background for Rui Zhao: Ph.D., MFA, and BFA."
};

export default function EducationPage() {
  return (
    <PageShell
      active="education"
      eyebrow="Education"
      intro="Academic training across fashion merchandising, art design, dress design, textile heritage, and digital fashion research."
      title="Education"
    >
      <section className="max-w-5xl">
        <SectionLabel>Degrees</SectionLabel>
        {education.map((item) => (
          <article className="grid border-t border-[#e2e2e2] py-5 md:grid-cols-[180px_1fr]" key={item.degree}>
            <div className="text-[10px] uppercase text-[#999]">
              <p>{item.date}</p>
              <p>{item.status}</p>
            </div>
            <div>
              <h2 className="text-[18px] uppercase leading-none">{item.degree}</h2>
              <p className="mt-2 text-[12px] uppercase text-[#666]">{item.institution}</p>
              <p className="mt-5 max-w-3xl text-[13px] leading-snug">{item.detail}</p>
              <p className="mt-2 text-[12px] text-[#666]">{item.people}</p>
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
