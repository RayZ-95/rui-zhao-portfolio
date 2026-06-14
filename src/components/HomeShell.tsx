"use client";

import { HomeArchive } from "@/components/HomeArchive";
import { HomeIntro } from "@/components/HomeIntro";
import { SiteNav } from "@/components/SiteNav";
import { homeIntroCopy } from "@/lib/content";
import type { HomeArchiveItem } from "@/lib/resolve-design-projects";
import { useEffect, useState } from "react";

export function HomeShell({ items }: { items: HomeArchiveItem[] }) {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = homeIntroCopy.video.gif;
    link.type = "image/gif";
    document.head.appendChild(link);

    const introSceneLink = document.createElement("link");
    introSceneLink.rel = "preload";
    introSceneLink.as = "fetch";
    introSceneLink.href = "/videos/shadows-remix-scene.json";
    introSceneLink.type = "application/json";
    introSceneLink.crossOrigin = "anonymous";
    document.head.appendChild(introSceneLink);

    const homeBackgroundLink = document.createElement("link");
    homeBackgroundLink.rel = "preload";
    homeBackgroundLink.as = "fetch";
    homeBackgroundLink.href = "/videos/frosted-glass-yellow-full-glass-scene.json";
    homeBackgroundLink.type = "application/json";
    homeBackgroundLink.crossOrigin = "anonymous";
    document.head.appendChild(homeBackgroundLink);

    return () => {
      link.remove();
      introSceneLink.remove();
      homeBackgroundLink.remove();
    };
  }, []);

  return (
    <div className="site-shell site-shell--home">
      {!introDone ? <HomeIntro onComplete={() => setIntroDone(true)} /> : null}
      {introDone ? (
        <>
          <SiteNav active="home" />
          <HomeArchive items={items} />
        </>
      ) : null}
    </div>
  );
}
