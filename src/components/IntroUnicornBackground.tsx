"use client";

import { UnicornScene } from "unicornstudio-react/next";
import { useEffect, useState } from "react";

const INTRO_UNICORN_SCENE = "/videos/shadows-remix-scene.json";
const INTRO_BACKGROUND_FALLBACK = "/videos/shadows-remix-scene.gif";

export function IntroUnicornBackground() {
  const [useMobileFallback, setUseMobileFallback] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const syncFallback = () => setUseMobileFallback(mediaQuery.matches);

    syncFallback();
    mediaQuery.addEventListener("change", syncFallback);

    return () => mediaQuery.removeEventListener("change", syncFallback);
  }, []);

  return (
    <div aria-hidden className="home-intro__animation">
      {useMobileFallback ? (
        <img alt="" className="home-intro__fallback" src={INTRO_BACKGROUND_FALLBACK} />
      ) : (
        <UnicornScene
          className="home-intro__scene"
          fps={60}
          height="100%"
          jsonFilePath={INTRO_UNICORN_SCENE}
          placeholder={INTRO_BACKGROUND_FALLBACK}
          scale={1}
          showPlaceholderOnError
          showPlaceholderWhileLoading
          width="100%"
        />
      )}
    </div>
  );
}
