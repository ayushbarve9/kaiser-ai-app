import React from "react";
import { JapaneseTowerLandscape, type TowerCountry } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export interface JapaneseTowerBackgroundProps {
  country?: TowerCountry;
  className?: string;
}

export const JapaneseTowerBackground: React.FC<JapaneseTowerBackgroundProps> = ({
  country = "china",
  className = "",
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden w-full h-full opacity-100 transition-opacity duration-1000 ${className}`}
      aria-hidden="true"
    >
      <div className="shader-frame w-full h-full min-h-screen fixed inset-0">
        <JapaneseTowerLandscape
          country={country as TowerCountry}
          sourceUrl="/japanese-tower.html"
          className="w-full h-full fixed inset-0"
        />
      </div>
      {/* Subtle overlay gradient to ensure high readability while keeping the 3D landscape vivid */}
      <div className="absolute inset-0 bg-gradient-to-b from-evergreen-50/30 via-transparent to-evergreen-950/20 pointer-events-none" />
    </div>
  );
};
