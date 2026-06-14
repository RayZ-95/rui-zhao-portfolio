import { DesignArchive } from "@/components/DesignArchive";
import { SiteNav } from "@/components/SiteNav";
import { resolveDesignProjects } from "@/lib/resolve-design-projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design",
  description:
    "Design archive by Rui Zhao across Ph.D., M.F.A., undergraduate, and design skills including fashion illustration, draping, basics of clothing design, garment 3D, and Procreate."
};

export default function DesignPage() {
  const projects = resolveDesignProjects();

  return (
    <>
      <SiteNav active="design" />
      <main className="site-main design-page pb-28 pt-10 md:pt-14">
        <h1 className="site-page-title">Design</h1>
        <DesignArchive projects={projects} />
      </main>
    </>
  );
}
