"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showAnimation?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

export default function Logo({ size = "md", className = "", showAnimation = false }: LogoProps) {
  const [error, setError] = useState(false);

  return (
    <div className={`${sizeClasses[size]} relative overflow-hidden ${className} ${showAnimation ? 'avs-animation-float' : ''}`}>
      {!error ? (
        <Image
          src="/avs-logo.png"
          alt="AVS - அகில இந்திய வேளாளர் சங்கம்"
          fill
          className="object-contain"
          onError={() => setError(true)}
          priority={size === "xl" || size === "lg"}
        />
      ) : (
        // Fallback if image not found
        <div className="w-full h-full avs-gradient rounded-full flex items-center justify-center">
          <span className="text-white font-bold" style={{ fontSize: size === 'xl' ? '3rem' : size === 'lg' ? '2rem' : '1rem' }}>
            AVS
          </span>
        </div>
      )}
    </div>
  );
}

