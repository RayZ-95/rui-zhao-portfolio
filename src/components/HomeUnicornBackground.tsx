"use client";

import { UnicornScene } from "unicornstudio-react/next";
import { useEffect, useState } from "react";

const HOME_UNICORN_SCENE = "/videos/frosted-glass-yellow-full-glass-scene.json";
const HOME_BACKGROUND_FALLBACK = "/videos/frosted-glass-tiles-remix-scene.gif";

export function HomeUnicornBackground() {
  const [useMobileFallback, setUseMobileFallback] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const syncFallback = () => setUseMobileFallback(mediaQuery.matches);

    syncFallback();
    mediaQuery.addEventListener("change", syncFallback);

    return () => mediaQuery.removeEventListener("change", syncFallback);
  }, []);

  return (
    <div aria-hidden className="home-page-background">
      {useMobileFallback ? (
        <img alt="" className="home-page-background__fallback" src={HOME_BACKGROUND_FALLBACK} />
      ) : (
        <UnicornScene
          className="home-page-background__scene"
          fps={60}
          height="100%"
          jsonFilePath={HOME_UNICORN_SCENE}
          scale={1}
          width="100%"
        />
      )}
    </div>
  );
}
