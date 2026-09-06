import React from "react";
import { JapaneseTowerLandscape } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <JapaneseTowerLandscape
        country="china"
      />
    </div>
  );
}

export default Scene;
