import { ResearchNav } from "@/components/ResearchNav";
import { ResearchSectionLabel } from "@/components/SectionLabel";
import { SiteNav } from "@/components/SiteNav";
import { TeachingEntryList } from "@/components/TeachingEntry";
import { groupBy, publishedTeaching } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teaching",
  description: "Teaching timeline for Rui Zhao, including instructor and teaching assistant experience."
};

export default function TeachingPage() {
  const groups = groupBy(publishedTeaching(), "year");
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a));
  const teachingNavItems = years.map((year) => ({
    id: `teaching-${year}`,
    label: year
  }));

  return (
    <>
      <SiteNav active="teaching" />
      <main className="site-main research-page bg-[#fafafa] pb-24 pt-10 md:pt-14">
        <h1 className="site-page-title">Teaching</h1>

        <div className="research-layout">
          {teachingNavItems.length > 0 ? (
            <aside className="research-layout-nav">
              <ResearchNav ariaLabel="Teaching years" items={teachingNavItems} label="Teaching" />
            </aside>
          ) : null}

          <div className="research-layout-content">
            {years.map((year) => (
              <section
                className="research-section-anchor mb-16 md:mb-20"
                id={`teaching-${year}`}
                key={year}
              >
                <ResearchSectionLabel>{year}</ResearchSectionLabel>
                <TeachingEntryList
                  items={[...groups[year]].sort((a, b) => a.sortOrder - b.sortOrder)}
                />
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
