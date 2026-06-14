"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DesignSectionDrawer } from "@/components/DesignSectionDrawer";
import {
  designNavItems,
  designSectionAnchorIds,
  designSkillsGroup,
  encodePublicAssetPath,
  mainDesignSections,
  projectCoverImage,
  resolveProjectSection
} from "@/lib/content";
import type { DesignProject } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function formatTags(project: DesignProject) {
  return [project.category, ...project.tags]
    .filter(Boolean)
    .join(" - ")
    .toUpperCase();
}

function DesignImageCard({
  alt,
  detailHref,
  image
}: {
  alt: string;
  detailHref: string;
  image: string;
}) {
  return (
    <article className="design-card design-card--image-only">
      <Link className="design-card__hit" href={detailHref}>
        <div className="design-card__media">
          <div className="design-card__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={alt} className="design-card__image" draggable={false} src={image} />
          </div>
        </div>
      </Link>
    </article>
  );
}

function DesignCard({ project }: { project: DesignProject }) {
  const cover = encodePublicAssetPath(projectCoverImage(project));
  const detailHref = `/design/${project.slug}`;

  if (project.imageOnly) {
    const portfolioImages = project.galleryImages.map((image) => image.trim()).filter(Boolean);
    const images = portfolioImages.length > 0 ? portfolioImages : [projectCoverImage(project)];

    return (
      <>
        {images.map((image, index) => (
          <DesignImageCard
            alt={`${project.title} — portfolio ${index + 1}`}
            detailHref={detailHref}
            image={encodePublicAssetPath(image)}
            key={`${project.slug}-${image}-${index}`}
          />
        ))}
      </>
    );
  }

  return (
    <article className="design-card">
      <Link className="design-card__hit" href={detailHref}>
        <div className="design-card__media">
          <div className="design-card__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={project.title} className="design-card__image" draggable={false} src={cover} />
          </div>
        </div>
      </Link>

      <div className="design-card__rule" />

      <div className="design-card__meta-top">
        {!project.hideEditorialCopy ? (
          <p className="design-card__tags">{formatTags(project)}</p>
        ) : null}
        <p className="design-card__year">{project.year}</p>
      </div>

      <Link className="design-card__hit design-card__hit--title" href={detailHref}>
        <h3 className="design-card__title">{project.title}</h3>
      </Link>
    </article>
  );
}

function DesignProjectRow({ projects }: { projects: DesignProject[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="design-row">
      <div className="design-row__track">
        {projects.map((project) => (
          <div data-design-card key={project.slug}>
            <DesignCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesignArchive({ projects }: { projects: DesignProject[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = gsap.utils.toArray<HTMLElement>("[data-design-section]", root);

    const ctx = gsap.context(() => {
      sections.forEach((section) => {
        const title = section.querySelector<HTMLElement>("[data-design-title]");
        const cards = section.querySelectorAll<HTMLElement>("[data-design-card]");

        if (title) {
          gsap.from(title, {
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            y: 56,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
          });
        }

        if (cards.length > 0) {
          gsap.from(cards, {
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse"
            },
            x: 64,
            opacity: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out"
          });
        }
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  const visibleMainSections = mainDesignSections
    .map((section) => ({
      ...section,
      projects: projects.filter((project) => resolveProjectSection(project) === section.id)
    }))
    .filter((section) => section.projects.length > 0);

  const skillProjects = designSkillsGroup.sections.flatMap((section) =>
    projects.filter((project) => {
      if (resolveProjectSection(project) !== section.id) return false;
      const hasGallery = project.galleryImages.some((image) => image.trim());
      return Boolean(project.coverImage.trim() || hasGallery);
    })
  );

  const visibleNavItems = designNavItems.filter((item) => {
    if (item.id === "design-skills") return skillProjects.length > 0;
    const sectionId = Object.entries(designSectionAnchorIds).find(([, anchor]) => anchor === item.id)?.[0];
    return visibleMainSections.some((section) => section.id === sectionId);
  });

  return (
    <>
      <DesignSectionDrawer items={visibleNavItems} />

      <div className="design-archive" ref={rootRef}>
        {visibleMainSections.map((section) => (
          <section
            className="design-section research-section-anchor"
            data-design-section
            id={designSectionAnchorIds[section.id]}
            key={section.id}
          >
            <h2 className="design-section__title" data-design-title>
              {section.label}
            </h2>

            <DesignProjectRow projects={section.projects} />
          </section>
        ))}

        {skillProjects.length > 0 ? (
          <section
            className="design-section design-section-group research-section-anchor"
            data-design-section
            id={designSectionAnchorIds["Design Skills"]}
          >
            <h2 className="design-section__title" data-design-title>
              {designSkillsGroup.label}
            </h2>

            <DesignProjectRow projects={skillProjects} />
          </section>
        ) : null}
      </div>
    </>
  );
}
