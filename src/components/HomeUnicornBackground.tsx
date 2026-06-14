"use client";

import { UnicornScene } from "unicornstudio-react/next";

const HOME_UNICORN_SCENE = "/videos/frosted-glass-yellow-full-glass-scene.json";

export function HomeUnicornBackground() {
  return (
    <div aria-hidden className="home-page-background">
      <UnicornScene
        className="home-page-background__scene"
        fps={60}
        height="100%"
        jsonFilePath={HOME_UNICORN_SCENE}
        scale={1}
        width="100%"
      />
    </div>
  );
}
