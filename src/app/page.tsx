import { HomeShell } from "@/components/HomeShell";
import { homeDesignArchiveItems } from "@/lib/resolve-design-projects";

export default function Home() {
  const archiveItems = homeDesignArchiveItems();

  return <HomeShell items={archiveItems} />;
}
