import type { Player } from "@/types/game";

type Props = {
  myPlayer: Player | null;
};

export default function OnlinePlayerInfo({
  myPlayer,
}: Props) {
  return (
    <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">
      {myPlayer ? (
        <>
          <p className="text-sm text-indigo-200">
            You are
          </p>

          <p
            className={`mt-1 text-3xl font-black ${
              myPlayer === "X"
                ? "text-cyan-300"
                : "text-pink-300"
            }`}
          >
            Player {myPlayer}
          </p>
        </>
      ) : (
        <p className="text-yellow-200">
          Assigning player...
        </p>
      )}
    </div>
  );
}