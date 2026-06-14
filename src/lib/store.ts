import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteContent } from "./types";

const dataPath = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
  await fs.writeFile(dataPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

export function isAdminPassword(value: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "rui-admin";
  return Boolean(value) && value === expected;
}
