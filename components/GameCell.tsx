"use client";

import type { CellValue } from "@/types/game";

type GameCellProps = {
  cell: CellValue;
  isWinning: boolean;
  disabled: boolean;
  onClick: () => void;
};

export default function GameCell({
  cell,
  isWinning,
  disabled,
  onClick,
}: GameCellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex h-24 w-24 items-center justify-center
        rounded-2xl border-2
        text-5xl font-black
        transition-all duration-300
        sm:h-28 sm:w-28

        ${
          isWinning
            ? cell === "X"
              ? "scale-110 border-cyan-300 bg-cyan-400/30 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.8)]"
              : "scale-110 border-pink-300 bg-pink-400/30 text-pink-200 shadow-[0_0_30px_rgba(244,114,182,0.8)]"
            : cell === "X"
              ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-300 shadow-lg shadow-cyan-400/20"
              : cell === "O"
                ? "border-pink-300/40 bg-pink-400/15 text-pink-300 shadow-lg shadow-pink-400/20"
                : "border-white/15 bg-white/10 hover:scale-105 hover:border-yellow-300/50 hover:bg-yellow-300/10"
        }
      `}
    >
      {cell}
    </button>
  );
}