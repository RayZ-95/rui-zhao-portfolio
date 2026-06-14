import { ArchiveRow } from "@/components/ArchiveRow";
import { PageShell } from "@/components/PageShell";
import { SectionLabel } from "@/components/SectionLabel";
import { cvSections, education, publishedPublications, publishedTeaching } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV",
  description: "Full web CV for Rui Zhao with education, publications, teaching, awards, funding, service, and skills."
};

export default function CvPage() {
  return (
    <PageShell
      active="cv"
      eyebrow="Curriculum Vitae"
      intro="A web version of Rui Zhao's academic CV. The downloadable PDF is available below."
      title="CV"
    >
      <div className="mb-10 flex gap-2">
        <a className="ui-button px-4 py-3 uppercase" href="/downloads/rui-zhao-cv.pdf">
          Download CV
        </a>
        <a className="ui-button px-4 py-3 uppercase" href="/downloads/rui-zhao-portfolio.pdf">
          Download Portfolio
        </a>
      </div>

      <section className="mb-14 max-w-5xl">
        <SectionLabel>Affiliation</SectionLabel>
        {cvSections.affiliation.map((line) => (
          <p className="text-[14px] leading-snug" key={line}>
            {line}
          </p>
        ))}
      </section>

      <section className="mb-14 max-w-5xl">
        <SectionLabel>Education</SectionLabel>
        {education.map((item) => (
          <ArchiveRow key={item.degree} year={item.date} title={item.degree} meta={item.institution} />
        ))}
      </section>

      <section className="mb-14 max-w-6xl">
        <SectionLabel>Selected Publications</SectionLabel>
        {publishedPublications().slice(0, 8).map((item) => (
          <ArchiveRow
            href={item.doiUrl || item.externalUrl || undefined}
            key={`${item.year}-${item.title}`}
            year={item.year}
            title={item.title}
            meta={`${item.type} / ${item.status}`}
          />
        ))}
      </section>

      <section className="mb-14 max-w-6xl">
        <SectionLabel>Teaching Experience</SectionLabel>
        {publishedTeaching().map((item) => (
          <ArchiveRow
            key={`${item.year}-${item.courseTitle}-${item.role}`}
            year={item.year}
            title={`${item.role}, ${item.courseCode}`}
            meta={`${item.courseTitle} / ${item.institution}`}
          />
        ))}
      </section>

      {(["awards", "funding", "service", "associations", "skills", "languages"] as const).map((section) => (
        <section className="mb-12 max-w-5xl" key={section}>
          <SectionLabel>{section}</SectionLabel>
          <div className="grid gap-2 md:grid-cols-3">
            {cvSections[section].map((item) => (
              <p className="border-t border-[#e2e2e2] pt-2 text-[12px] uppercase leading-tight text-[#333]" key={item}>
                {item}
              </p>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
