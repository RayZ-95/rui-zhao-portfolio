import type { DesignProject } from "./types";
import { designSkillsGroup, projectCoverImage, publishedProjects, resolveProjectSection } from "./content";
import { resolveFolderAssets } from "./design-folder-images";

export type HomeArchiveItem = {
  title: string;
  label: string;
  slug: string;
  coverImage: string;
};

export function resolveDesignProject(project: DesignProject): DesignProject {
  const explicitGallery = project.galleryImages.map((image) => image.trim()).filter(Boolean);
  const explicitCover = project.coverImage.trim();

  if (!project.galleryFolder?.trim()) {
    return project;
  }

  const { coverImage, galleryImages } = resolveFolderAssets(project.galleryFolder);
  if (!coverImage && galleryImages.length === 0 && explicitGallery.length === 0) {
    return project;
  }

  return {
    ...project,
    galleryImages: explicitGallery.length > 0 ? explicitGallery : galleryImages,
    coverImage: explicitCover || coverImage
  };
}

export function resolveDesignProjects(): DesignProject[] {
  return publishedProjects().map(resolveDesignProject);
}

export function resolvePublishedProjectBySlug(slug: string): DesignProject | undefined {
  const project = publishedProjects().find((item) => item.slug === slug);
  return project ? resolveDesignProject(project) : undefined;
}

const designSkillSectionIds = new Set<string>(designSkillsGroup.sections.map((section) => section.id));

export function homeDesignArchiveItems(limit = 20): HomeArchiveItem[] {
  return resolveDesignProjects()
    .filter((project) => !designSkillSectionIds.has(resolveProjectSection(project)))
    .map((project) => ({
      title: project.title,
      label: `Design · ${project.year}`,
      slug: project.slug,
      coverImage: projectCoverImage(project)
    }))
    .filter((item) => item.coverImage.trim().length > 0)
    .slice(0, limit);
}
