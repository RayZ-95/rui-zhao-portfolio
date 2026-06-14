import { sortDesignImagesByNumber } from "./content";
import { designFolderManifest } from "./design-folder-manifest";

const COVER_FILENAMES = new Set([
  "cover.png",
  "cover.jpg",
  "cover.jpeg",
  "cover.webp",
  "list-cover.jpg",
  "list-cover.png"
]);

function filenameFromWebPath(webPath: string): string {
  return webPath.split("/").pop() ?? "";
}

export function imagesFromPublicFolder(webPath: string): string[] {
  return resolveFolderAssets(webPath).galleryImages;
}

export function resolveFolderAssets(webPath: string): {
  coverImage: string;
  galleryImages: string[];
} {
  const normalized = webPath.startsWith("/") ? webPath : `/${webPath}`;
  const files = designFolderManifest[normalized] ?? [];

  if (files.length === 0) {
    return { coverImage: "", galleryImages: [] };
  }

  const coverImage = files.find((image) => COVER_FILENAMES.has(filenameFromWebPath(image).toLowerCase()));
  const portfolioFiles = files.filter((image) => !COVER_FILENAMES.has(filenameFromWebPath(image).toLowerCase()));
  const sortedPortfolio = sortDesignImagesByNumber(portfolioFiles);

  if (coverImage) {
    return {
      coverImage,
      galleryImages: sortedPortfolio
    };
  }

  return {
    coverImage: sortedPortfolio[0] ?? "",
    galleryImages: sortedPortfolio.slice(1)
  };
}
