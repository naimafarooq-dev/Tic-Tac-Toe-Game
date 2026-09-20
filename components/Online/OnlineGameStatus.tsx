import type { Player } from "@/types/game";

type Props = {
  status:
    | "waiting"
    | "playing"
    | "finished";

  currentPlayer: Player;
  myPlayer: Player | null;
  winner: Player | null;
  isDraw: boolean;
};

export default function OnlineGameStatus({
  status,
  currentPlayer,
  myPlayer,
  winner,
  isDraw,
}: Props) {

  if (winner) {
    return (
      <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">
        <p className="text-2xl font-black text-yellow-200">
          🏆 Player {winner} Wins!
        </p>
      </div>
    );
  }

  if (isDraw) {
    return (
      <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">
        <p className="text-2xl font-black text-yellow-200">
          🤝 It&apos;s a Draw!
        </p>
      </div>
    );
  }

  if (status === "waiting") {
    return (
      <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">
        <p className="font-semibold text-yellow-200">
          Waiting for your friend...
        </p>

        <p className="mt-1 text-xs text-yellow-100/70">
          Share the game link with your friend.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">
      <p className="text-sm text-indigo-200">
        Current Turn
      </p>

      <p
        className={`mt-1 text-3xl font-black ${
          currentPlayer === "X"
            ? "text-cyan-300"
            : "text-pink-300"
        }`}
      >
        Player {currentPlayer}
      </p>

      <p className="mt-1 text-xs text-indigo-200/70">
        {currentPlayer === myPlayer
          ? "Your turn"
          : "Opponent's turn"}
      </p>
    </div>
  );
}