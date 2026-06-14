import fs from "fs";
import path from "path";
import { sortDesignImagesByNumber } from "./content";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const COVER_FILENAMES = new Set([
  "cover.png",
  "cover.jpg",
  "cover.jpeg",
  "cover.webp",
  "list-cover.jpg",
  "list-cover.png"
]);

function isImageFile(filename: string): boolean {
  return IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase());
}

function isCoverFile(filename: string): boolean {
  return COVER_FILENAMES.has(filename.toLowerCase());
}

export function imagesFromPublicFolder(webPath: string): string[] {
  return resolveFolderAssets(webPath).galleryImages;
}

export function resolveFolderAssets(webPath: string): {
  coverImage: string;
  galleryImages: string[];
} {
  const normalized = webPath.startsWith("/") ? webPath.slice(1) : webPath;
  const folderPath = path.join(process.cwd(), "public", normalized);

  if (!fs.existsSync(folderPath)) {
    return { coverImage: "", galleryImages: [] };
  }

  const files = fs
    .readdirSync(folderPath)
    .filter((filename) => !filename.startsWith(".") && isImageFile(filename));

  const webFolder = `/${normalized.replace(/\\/g, "/")}`;
  const toWebPath = (filename: string) => `${webFolder}/${filename}`;
  const coverFile = files.find((filename) => isCoverFile(filename));
  const portfolioFiles = files.filter((filename) => !isCoverFile(filename));
  const sortedPortfolio = sortDesignImagesByNumber(portfolioFiles.map(toWebPath));

  if (coverFile) {
    return {
      coverImage: toWebPath(coverFile),
      galleryImages: sortedPortfolio
    };
  }

  return {
    coverImage: sortedPortfolio[0] ?? "",
    galleryImages: sortedPortfolio.slice(1)
  };
}
