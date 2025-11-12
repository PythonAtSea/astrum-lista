"use client";
import type { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type GridImageProps = {
  image?: StaticImageData;
  credit?: string;
  creditUrl?: string;
  useColor?: boolean;
  maxWidth?: number;
  brightness?: number;
  className?: string;
};

export default function GridImage({
  image,
  credit,
  creditUrl,
  useColor = false,
  maxWidth = 400,
  brightness = 1.25,
  className,
}: GridImageProps) {
  const [pixels, setPixels] = useState<string[]>([]);
  const [scaledSize, setScaledSize] = useState({ w: 0, h: 0 });
  const width = image?.width ?? 0;
  const height = image?.height ?? 0;

  const CIRCLE_RADIUS = 0.4;
  const CELL_SIZE = 1.5;

  useEffect(() => {
    if (!image) return;

    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const origW = width || img.naturalWidth || 1;
      const origH = height || img.naturalHeight || 1;
      const scale = Math.min(1, maxWidth / origW);
      const scaledW = Math.max(1, Math.round(origW * scale));
      const scaledH = Math.max(1, Math.round(origH * scale));

      canvas.width = scaledW;
      canvas.height = scaledH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const pixelColors: string[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
        if (useColor) {
          const rr = clamp(r * brightness);
          const gg = clamp(g * brightness);
          const bb = clamp(b * brightness);
          pixelColors.push(`rgba(${rr},${gg},${bb},${a / 255})`);
        } else {
          const grey = 0.299 * r + 0.587 * g + 0.114 * b;
          const brightGrey = clamp(grey * brightness);
          pixelColors.push(
            `rgba(${brightGrey},${brightGrey},${brightGrey},${a / 255})`
          );
        }
      }
      setPixels(pixelColors);
      setScaledSize({ w: canvas.width, h: canvas.height });
    };
  }, [image, width, height, useColor, maxWidth, brightness]);

  if (!image || pixels.length === 0) return null;

  const displayWidth = scaledSize.w || Math.max(1, width);
  const displayHeight = scaledSize.h || Math.max(1, height);

  return (
    <div className={`border p-4 relative ${className}`}>
      <svg
        className="w-full block"
        viewBox={`0 0 ${displayWidth * CELL_SIZE} ${displayHeight * CELL_SIZE}`}
        style={{
          aspectRatio: `${displayWidth} / ${displayHeight}`,
        }}
      >
        {pixels.map((color, index) => {
          const x = (index % displayWidth) * CELL_SIZE;
          const y = Math.floor(index / displayWidth) * CELL_SIZE;
          return (
            <circle
              key={index}
              cx={x + CELL_SIZE / 2}
              cy={y + CELL_SIZE / 2}
              r={CIRCLE_RADIUS}
              fill={color}
            />
          );
        })}
      </svg>
      {credit && (
        <div
          className={`text-xs absolute left-4 right-4 ${
            creditUrl ? "text-blue-500 hover:underline" : ""
          }`}
        >
          {creditUrl ? (
            <a href={creditUrl} target="_blank" rel="noopener noreferrer">
              {credit}
            </a>
          ) : (
            credit
          )}
        </div>
      )}
    </div>
  );
}
