import content from "../../data/content.json";
import type { DesignProject, DesignSection, Publication, SiteContent, TeachingExperience } from "./types";

export const siteContent = content as SiteContent;

export const researchThemes = [
  {
    title: "Digital Fashion Marketing",
    kicker: "Consumer research, product transparency, and brand communication",
    description:
      "Researching how emerging technologies such as Digital Product Passports and digital twins influence fashion consumers' attitudes, value perceptions, trust, and purchase intentions."
  },
  {
    title: "AI in Fashion Education",
    kicker: "Pedagogy, creativity, digital literacy, and classroom integration",
    description:
      "Examining how AI-assisted tools including ChatGPT, Midjourney, Adobe Photoshop, CLO3D, and professional fashion software can support creativity, efficiency, and future career skills."
  },
  {
    title: "Cultural Heritage & Design",
    kicker: "Historical dress, textile technology, and digital reconstruction",
    description:
      "Connecting historical research, textile conservation, virtual heritage methods, and design transformation to preserve and reinterpret Chinese dress and textile culture."
  }
];

export const education = [
  {
    degree: "Doctor of Philosophy in Textiles, Apparel Design and Merchandising in Merchandising",
    institution: "Louisiana State University, Baton Rouge, LA",
    date: "May 2026",
    status: "In progress",
    detail:
      "Dissertation: Investigating the Impact of Digital Product Passports on Fashion Consumers' Attitudes and Purchase Intentions.",
    people: "Committee: Dr. Chuanlan Liu (Chair), Dr. Sibei Xia, Dr. Bruce Cameron"
  },
  {
    degree: "Master of Fine Arts in Art Design",
    institution: "Guangxi Arts University, Nanning, China",
    date: "June 2023",
    status: "Completed",
    detail:
      "Thesis: Structural Study and Innovative Design of a Tang Dynasty Short-Sleeved Lined Robe with Standing Collar and Overlapping Front from the Haixi Prefecture Ethnic Museum Collection.",
    people: "Advisor: Dr. Hongshan Chen"
  },
  {
    degree: "Bachelor of Fine Arts in Dress Design (Knitted Clothes Design)",
    institution: "Beijing City University, Beijing, China",
    date: "July 2019",
    status: "Completed",
    detail: "Undergraduate thesis: The Application of Gender-Blurred Design in Deconstructed Menswear.",
    people: "Advisor: Dr. Li Yuan"
  }
];

export const grantGroups = [
  {
    label: "1. Extramural Support",
    sublabel: "Under Review",
    grants: [
      "Liu, C. (Principal Investigator), Mamp, M. (Co-Investigator), & Zhao, R. (Key Personnel). (2026). Inside Geoffrey Beene: A Planning Framework for the Digitization and Interpretation of American Fashion Heritage. National Endowment for the Humanities (NEH) Collections Stewardship Program. $99,764."
    ]
  },
  {
    label: "2. Internal Support",
    grants: [
      "Conference Travel Grant, Louisiana State University, Fall 2025",
      "Conference Travel Grant, Louisiana State University, Fall 2024"
    ]
  }
] as const;

export const cvSections = {
  affiliation: [
    "Ph.D. Candidate",
    "Department of Textiles, Apparel Design and Merchandising",
    "College of Agriculture, Louisiana State University",
    "Baton Rouge, LA"
  ],
  awards: [
    "Finalist, 25th China International Leather and Fur Fashion Design Competition, 2023",
    "Excellent Rendering Award, 24th China International Leather and Fur Fashion Design Competition, 2022",
    "Excellent Award, Charming Oriental Underwear Design Competition, 2021"
  ],
  funding: grantGroups.flatMap((group) => [...group.grants]),
  service: ["Registration Desk, International Textiles and Apparel Association, St. Louis, Missouri, 2026"],
  associations: ["Member, International Textile and Apparel Association (ITAA), since 2023"],
  skills: [
    "Adobe Illustrator",
    "Adobe Photoshop",
    "Shima Seiki programs",
    "CLO3D",
    "Style3D",
    "Midjourney",
    "Procreate",
    "SPSS",
    "SPSS AMOS",
    "NVivo",
    "VOSviewer",
    "Biblioshiny (R Studio)",
    "Microsoft Office",
    "Cursor"
  ],
  languages: ["Chinese: Native", "English: Professional working proficiency"]
};

export const mainDesignSections = [
  { id: "PhD", label: "Ph.D." },
  { id: "Master", label: "M.F.A." },
  { id: "Undergraduate", label: "Undergraduate" }
] as const satisfies ReadonlyArray<{ id: DesignSection; label: string }>;

export const designNavItems = [
  { id: "phd", label: "Ph.D." },
  { id: "master", label: "M.F.A." },
  { id: "undergraduate", label: "Undergraduate" },
  { id: "design-skills", label: "Design Skills" }
] as const;

export const designSectionAnchorIds = {
  PhD: "phd",
  Master: "master",
  Undergraduate: "undergraduate",
  "Design Skills": "design-skills"
} as const;

export const designSkillsGroup = {
  label: "Design Skills",
  sections: [
    { id: "Fashion Illustration", label: "Fashion Illustration" },
    { id: "Draping", label: "Draping" },
    { id: "Basics of Clothing Design", label: "Basics of Clothing Design" },
    { id: "Garment 3D", label: "Garment 3D" },
    { id: "Procreate", label: "Procreate" }
  ]
} as const satisfies {
  label: string;
  sections: ReadonlyArray<{ id: DesignSection; label: string }>;
};

export const designSections = [
  ...mainDesignSections,
  ...designSkillsGroup.sections
] as const satisfies ReadonlyArray<{ id: DesignSection; label: string }>;

export function designSectionLabel(section: DesignSection): string {
  return designSections.find((item) => item.id === section)?.label ?? section;
}

export function resolveProjectSection(project: DesignProject): DesignSection {
  if (project.section) return project.section;
  if (project.stage === "MFA") return "Master";
  if (project.stage === "Undergraduate") return "Undergraduate";
  return "PhD";
}

export function publishedProjects(): DesignProject[] {
  return siteContent.designProjects
    .filter((item) => item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function projectsForDesignSection(section: DesignSection): DesignProject[] {
  return publishedProjects().filter((item) => resolveProjectSection(item) === section);
}

export function projectCoverImage(project: DesignProject): string {
  if (project.coverImage.trim()) return project.coverImage;
  if (project.galleryImages[0]?.trim()) return project.galleryImages[0];
  return `/images/designs/${project.slug}.jpg`;
}

export function projectGalleryImages(project: DesignProject): string[] {
  const gallery = project.galleryImages.map((image) => image.trim()).filter(Boolean);

  if (gallery.length > 0) {
    return gallery;
  }

  const cover = projectCoverImage(project);
  return cover ? [cover] : [];
}

function imageNumberKey(path: string): number {
  const filename = path.split("/").pop() ?? path;
  const match = filename.match(/(\d+)(?=\.[^.]+$)/) ?? filename.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
}

export function sortDesignImagesByNumber(images: string[]): string[] {
  return [...images].sort((a, b) => {
    const order = imageNumberKey(a) - imageNumberKey(b);
    return order !== 0 ? order : a.localeCompare(b);
  });
}

export function publishedProjectBySlug(slug: string): DesignProject | undefined {
  return publishedProjects().find((project) => project.slug === slug);
}

export function encodePublicAssetPath(assetPath: string): string {
  return assetPath
    .split("/")
    .map((segment, index) => {
      if (segment === "" && index === 0) return "";
      if (index <= 2) return segment;
      return encodeURIComponent(segment);
    })
    .join("/");
}

export function homeArchiveImages() {
  const images = siteContent.homeArchiveImages ?? [];
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function publishedPublications(): Publication[] {
  return siteContent.publications
    .filter((item) => item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function publicationCoverImage(item: Publication): string {
  if (item.coverImage?.trim()) return item.coverImage;
  return `/images/publications/${item.sortOrder}.jpg`;
}

export const researchSections = [
  {
    id: "journals",
    label: "Articles in Refereed Journals or Bulletins",
    types: ["Journal Articles"] as Publication["type"][]
  },
  {
    id: "proceedings",
    label: "Abstracts of Refereed Papers Published in Proceedings and Symposium Publications",
    types: ["Conference Proceedings"] as Publication["type"][]
  },
  {
    id: "exhibitions",
    label: "Design Exhibition",
    types: ["Design Exhibitions"] as Publication["type"][]
  },
  {
    id: "books",
    label: "Books and Monographs",
    types: ["Books/Monographs"] as Publication["type"][]
  }
] as const;

export const researchNavItems = [
  ...researchSections.map((section) => ({ id: section.id, label: section.label })),
  { id: "grants", label: "Grants" }
] as const;

export function publicationsForResearchSection(types: Publication["type"][]) {
  return publishedPublications().filter((item) => types.includes(item.type));
}

export function publishedTeaching(): TeachingExperience[] {
  return siteContent.teachingExperiences
    .filter((item) => item.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] ? [...groups[group], item] : [item];
    return groups;
  }, {});
}

export const homeIntroCopy = {
  name: "RUI ZHAO",
  prefix: "I AM A",
  roles: ["Researcher", "Designer", "Scholar"],
  tagline:
    "a researcher and designer working at the intersection of digital fashion, consumer behavior, artificial intelligence, and textile heritage.",
  tags: ["Digital Fashion", "Consumer Research", "Design", "Heritage"],
  video: {
    gif: "/videos/shadows-remix-scene.gif",
    mp4: "/videos/shadows-remix-scene.mp4",
    webm: "/videos/shadows-remix-scene.webm"
  }
} as const;

export const contactProfile = {
  email: "zrui3@lsu.edu",
  affiliation: {
    name: "Louisiana State University",
    lines: [
      "Department of Textiles, Apparel Design and Merchandising",
      "College of Agriculture, Louisiana State University",
      "Human Ecology Building, Baton Rouge, LA 70803"
    ]
  },
  profiles: [
    {
      id: "linkedin" as const,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/rui-zhao-b3b3b6298"
    },
    {
      id: "researchgate" as const,
      label: "ResearchGate",
      href: "https://www.researchgate.net/profile/Rui-Zhao-128"
    }
  ]
};
