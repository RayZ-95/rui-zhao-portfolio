"use client";

import { UnicornScene } from "unicornstudio-react/next";

const INTRO_UNICORN_SCENE = "/videos/shadows-remix-scene.json";
const INTRO_BACKGROUND_FALLBACK = "/videos/shadows-remix-scene.gif";

export function IntroUnicornBackground() {
  return (
    <div aria-hidden className="home-intro__animation">
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
    </div>
  );
}
