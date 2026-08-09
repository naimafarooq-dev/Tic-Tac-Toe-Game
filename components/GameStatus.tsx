"use client";

import type { Player } from "@/types/game";

type GameStatusProps = {
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
};

export default function GameStatus({
  currentPlayer,
  winner,
  isDraw,
}: GameStatusProps) {
  return (
    <div className="mb-6 flex justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 shadow-lg">
        {winner ? (
          <>
            <span className="text-sm font-bold text-yellow-200">
              🏆 Winner
            </span>

            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-black shadow-lg ${
                winner === "X"
                  ? "bg-cyan-400 text-indigo-950 shadow-cyan-400/40"
                  : "bg-pink-400 text-white shadow-pink-400/40"
              }`}
            >
              {winner}
            </span>
          </>
        ) : isDraw ? (
          <span className="text-sm font-bold text-yellow-200">
            🤝 It&apos;s a Draw!
          </span>
        ) : (
          <>
            <span className="text-sm font-semibold text-indigo-200">
              Current Turn
            </span>

            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-black shadow-lg ${
                currentPlayer === "X"
                  ? "bg-cyan-400 text-indigo-950 shadow-cyan-400/40"
                  : "bg-pink-400 text-white shadow-pink-400/40"
              }`}
            >
              {currentPlayer}
            </span>
          </>
        )}
      </div>
    </div>
  );
}