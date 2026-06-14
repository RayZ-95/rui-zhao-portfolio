import { ResearchEntryList, ResearchGrantList } from "@/components/ResearchEntry";
import { ResearchNav } from "@/components/ResearchNav";
import { ResearchSectionLabel } from "@/components/SectionLabel";
import { SiteNav } from "@/components/SiteNav";
import {
  grantGroups,
  publicationsForResearchSection,
  researchNavItems,
  researchSections
} from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research output by Rui Zhao: journal articles, conference proceedings, design exhibitions, books and monographs, and grants."
};

export default function ResearchPage() {
  return (
    <>
      <SiteNav active="research" />
      <main className="site-main research-page bg-[#fafafa] pb-24 pt-10 md:pt-14">
        <h1 className="site-page-title">Research</h1>

        <div className="research-layout">
          <aside className="research-layout-nav">
            <ResearchNav items={researchNavItems} />
          </aside>

          <div className="research-layout-content">
            {researchSections.map((section) => {
              const items = publicationsForResearchSection([...section.types]);

              return (
                <section className="research-section-anchor mb-16 md:mb-20" id={section.id} key={section.id}>
                  <ResearchSectionLabel>{section.label}</ResearchSectionLabel>
                  <ResearchEntryList items={items} />
                </section>
              );
            })}

            <section className="research-section-anchor mb-16 md:mb-20" id="grants">
              <ResearchSectionLabel>Grants</ResearchSectionLabel>
              <ResearchGrantList groups={grantGroups} />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
