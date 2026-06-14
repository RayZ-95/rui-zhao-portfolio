export type Stage = "Undergraduate" | "MFA" | "PhD";

export type DesignSection =
  | "PhD"
  | "Master"
  | "Undergraduate"
  | "Fashion Illustration"
  | "Draping"
  | "Basics of Clothing Design"
  | "Garment 3D"
  | "Procreate";

export type DesignProject = {
  title: string;
  slug: string;
  stage: Stage;
  section?: DesignSection;
  year: string;
  category: string;
  tags: string[];
  description: string;
  coverImage: string;
  galleryImages: string[];
  galleryFolder?: string;
  heroImages?: string[];
  leftImages?: string[];
  hideEditorialCopy?: boolean;
  layout?: "horizontal-strip";
  largeSansTitle?: boolean;
  imageOnly?: boolean;
  sortOrder: number;
  featured: boolean;
  published: boolean;
};

export type Publication = {
  authors: string;
  year: string;
  title: string;
  type: "Journal Articles" | "Conference Proceedings" | "Design Exhibitions" | "Books/Monographs";
  venue: string;
  status: string;
  doiUrl: string;
  externalUrl: string;
  citationText: string;
  coverImage?: string;
  highlight?: string;
  tags?: string[];
  sortOrder: number;
  published: boolean;
};

export type TeachingExperience = {
  courseCode: string;
  courseTitle: string;
  role: string;
  institution: string;
  department: string;
  semester: string;
  year: string;
  description: string;
  highlights: string[];
  sortOrder: number;
  published: boolean;
};

export type Asset = {
  filename: string;
  url: string;
  type: string;
  altText: string;
  createdAt: string;
};

export type HomeArchiveImage = {
  title: string;
  label: string;
  slug: string;
  image: string;
  sortOrder: number;
};

export type SiteContent = {
  designProjects: DesignProject[];
  homeArchiveImages: HomeArchiveImage[];
  publications: Publication[];
  teachingExperiences: TeachingExperience[];
  assets: Asset[];
};
