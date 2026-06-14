import { DesignProjectGallery } from "@/components/DesignProjectGallery";
import { MasterEditorialLayout } from "@/components/MasterEditorialLayout";
import { MasterStripLayout } from "@/components/MasterStripLayout";
import { SiteNav } from "@/components/SiteNav";
import {
  designSectionLabel,
  designSkillsGroup,
  resolveProjectSection
} from "@/lib/content";
import {
  resolveDesignProjects,
  resolvePublishedProjectBySlug,
} from "@/lib/resolve-design-projects";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return resolveDesignProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = resolvePublishedProjectBySlug(slug);

  if (!project) {
    return { title: "Design Project" };
  }

  return {
    title: project.title,
    description: project.description
  };
}

export default async function DesignProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = resolvePublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const portfolioImages = project.galleryImages.map((image) => image.trim()).filter(Boolean);
  const heroImages = (project.heroImages ?? []).map((image) => image.trim()).filter(Boolean);
  const leftImages = (project.leftImages ?? []).map((image) => image.trim()).filter(Boolean);
  const section = resolveProjectSection(project);
  const sectionLabel = designSectionLabel(section);
  const isMasterLayout = section === "Master";
  const keywordList = [project.category, ...project.tags]
    .filter(Boolean)
    .filter((item, index, items) => items.findIndex((entry) => entry.toLowerCase() === item.toLowerCase()) === index)
    .join("; ");
  const showEditorialCopy = !project.hideEditorialCopy;
  const isDesignSkill = designSkillsGroup.sections.some((item) => item.id === section);
  const stripTitle =
    isDesignSkill && project.hideEditorialCopy ? "" : project.title;
  const keywords = showEditorialCopy && keywordList ? `Keywords: ${keywordList}` : "";
  const description = showEditorialCopy ? project.description : "";

  return (
    <div className="design-project-shell">
      <SiteNav active="design" />
      <main
        className={`site-main design-page design-project-page pb-28 pt-10 md:pt-14${
          project.layout === "horizontal-strip" ? " design-project-page--strip" : ""
        }`}
      >
        <Link className="design-project-back" href="/design">
          ← Design
        </Link>

        {project.layout === "horizontal-strip" ? (
          <MasterStripLayout
            description={description}
            heroImages={heroImages}
            keywordList={showEditorialCopy ? keywordList : ""}
            largeSansTitle={project.largeSansTitle}
            portfolioImages={portfolioImages}
            section={sectionLabel}
            title={stripTitle}
            year={project.year}
          />
        ) : isMasterLayout ? (
          <MasterEditorialLayout
            description={description}
            heroImages={heroImages}
            keywords={keywords}
            leftImages={leftImages}
            portfolioImages={portfolioImages}
            section={sectionLabel}
            title={project.title}
            year={project.year}
          />
        ) : (
          <div className="design-project-hero">
            <header className="design-project-header">
              <p className="design-project-eyebrow">
                {sectionLabel} · {project.year}
              </p>
              <h1 className="design-project-title">{project.title}</h1>
              {keywords ? (
                <p className="design-project-keywords">
                  <span className="design-project-keywords__label">Keywords:</span> {keywords}
                </p>
              ) : null}
              {project.description ? (
                <>
                  <p className="design-project-intro-label">Introduction</p>
                  <p className="design-project-description">{project.description}</p>
                </>
              ) : null}
            </header>

            <DesignProjectGallery images={portfolioImages} title={project.title} />
          </div>
        )}
      </main>
    </div>
  );
}
