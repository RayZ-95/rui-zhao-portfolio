import { ArchiveRow } from "@/components/ArchiveRow";
import { PageShell } from "@/components/PageShell";
import { SectionLabel } from "@/components/SectionLabel";
import { groupBy, publishedPublications } from "@/lib/content";
import type { Publication } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications, proceedings, design exhibitions, and books by Rui Zhao."
};

const types: Publication["type"][] = ["Journal Articles", "Conference Proceedings", "Design Exhibitions", "Books/Monographs"];

export default function PublicationsPage() {
  const groups = groupBy(publishedPublications(), "type");

  return (
    <PageShell
      active="publications"
      eyebrow="Publications"
      intro="Peer-reviewed journal articles, conference proceedings, design exhibitions, and scholarly book contributions."
      title="Publications"
    >
      {types.map((type) => (
        <section className="mb-16 max-w-6xl" key={type}>
          <SectionLabel>{type}</SectionLabel>
          {(groups[type] ?? []).map((item) => (
            <ArchiveRow
              href={item.doiUrl || item.externalUrl || undefined}
              key={`${item.year}-${item.title}`}
              meta={`${item.authors} ${item.venue} ${item.status}`}
              title={item.title}
              year={item.year}
            />
          ))}
        </section>
      ))}
    </PageShell>
  );
}
