"use client";

import { useId } from "react";
import { mediaUrl } from "@/lib/media";

type SofaVectorSofaProps = {
  widthMetres: number;
  chaiseSide?: "start" | "end" | null;
  fabricImage?: string | null;
  colorSwatch?: string | null;
  title: string;
};

const PX_PER_METRE = 250;
const STAGE_WIDTH = 1000;
const STAGE_HEIGHT = 470;
const ARM_WIDTH = 44;
const BACK_HEIGHT = 132;
const SEAT_HEIGHT = 74;
const LEG_HEIGHT = 30;
const CHAISE_WIDTH = 130;

function seatCount(widthMetres: number) {
  return Math.max(2, Math.min(4, Math.round(widthMetres / 0.95)));
}

export function SofaVectorSofa({ widthMetres, chaiseSide, fabricImage, colorSwatch, title }: SofaVectorSofaProps) {
  const uid = useId().replace(/:/g, "");
  const fabric = mediaUrl(fabricImage ?? undefined);
  const color = colorSwatch || "#e8e3da";

  const bodyWidth = Math.min(STAGE_WIDTH - 120, Math.max(320, widthMetres * PX_PER_METRE));
  const chaise = chaiseSide ? CHAISE_WIDTH : 0;
  const totalWidth = bodyWidth + chaise;
  const left = (STAGE_WIDTH - totalWidth) / 2;
  const bodyLeft = chaiseSide === "start" ? left + chaise : left;

  const baseline = STAGE_HEIGHT - 70;
  const seatTop = baseline - SEAT_HEIGHT;
  const backTop = seatTop - BACK_HEIGHT;

  const seats = seatCount(widthMetres);
  const innerLeft = bodyLeft + ARM_WIDTH;
  const innerWidth = bodyWidth - ARM_WIDTH * 2;
  const cushionGap = 8;
  const cushionWidth = (innerWidth - cushionGap * (seats - 1)) / seats;

  const legXs = [
    bodyLeft + 16,
    ...(chaiseSide === "start" ? [left + 16] : []),
    ...(chaiseSide === "end" ? [bodyLeft + bodyWidth + chaise - 26] : []),
    bodyLeft + bodyWidth - 26
  ];

  const shapeId = `sofa-${uid}`;
  const clipId = `clip-${uid}`;
  const fabricId = `fabric-${uid}`;
  const shadeId = `shade-${uid}`;

  return (
    <svg
      viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
      role="img"
      aria-label={title}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <g id={shapeId}>
          <rect x={bodyLeft} y={backTop} width={bodyWidth} height={BACK_HEIGHT + 26} rx={26} />
          {chaiseSide ? (
            <rect
              x={chaiseSide === "start" ? left : bodyLeft + bodyWidth}
              y={seatTop - 10}
              width={chaise}
              height={SEAT_HEIGHT + 10}
              rx={18}
            />
          ) : null}
          <rect x={bodyLeft} y={seatTop - 16} width={ARM_WIDTH + 10} height={SEAT_HEIGHT + 16} rx={16} />
          <rect
            x={bodyLeft + bodyWidth - ARM_WIDTH - 10}
            y={seatTop - 16}
            width={ARM_WIDTH + 10}
            height={SEAT_HEIGHT + 16}
            rx={16}
          />
          <rect x={bodyLeft} y={seatTop} width={bodyWidth} height={SEAT_HEIGHT} rx={18} />
          {Array.from({ length: seats }).map((_, index) => (
            <rect
              key={`back-${index}`}
              x={innerLeft + index * (cushionWidth + cushionGap)}
              y={backTop + 12}
              width={cushionWidth}
              height={BACK_HEIGHT - 6}
              rx={20}
            />
          ))}
          {Array.from({ length: seats }).map((_, index) => (
            <rect
              key={`seat-${index}`}
              x={innerLeft + index * (cushionWidth + cushionGap)}
              y={seatTop - 6}
              width={cushionWidth}
              height={SEAT_HEIGHT - 6}
              rx={16}
            />
          ))}
        </g>

        <clipPath id={clipId}>
          <use href={`#${shapeId}`} />
        </clipPath>

        {fabric ? (
          <pattern id={fabricId} patternUnits="userSpaceOnUse" width="150" height="150">
            <image href={fabric} width="150" height="150" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        ) : null}

        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.24" />
        </linearGradient>
      </defs>

      <ellipse
        cx={left + totalWidth / 2}
        cy={baseline + LEG_HEIGHT + 8}
        rx={totalWidth / 2.1}
        ry={13}
        fill="currentColor"
        opacity="0.12"
      />

      {legXs.map((x) => (
        <path
          key={x}
          d={`M ${x} ${baseline} l 10 0 l -2.5 ${LEG_HEIGHT} l -5 0 Z`}
          fill="#4a3b30"
        />
      ))}

      <use href={`#${shapeId}`} fill={color} />

      {fabric ? (
        <g clipPath={`url(#${clipId})`} style={{ mixBlendMode: "multiply" }} opacity="0.72">
          <rect x="0" y="0" width={STAGE_WIDTH} height={STAGE_HEIGHT} fill={`url(#${fabricId})`} />
        </g>
      ) : null}

      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width={STAGE_WIDTH} height={STAGE_HEIGHT} fill={`url(#${shadeId})`} />
      </g>

      <use href={`#${shapeId}`} fill="none" stroke="#000000" strokeOpacity="0.14" strokeWidth="1.5" />
    </svg>
  );
}
