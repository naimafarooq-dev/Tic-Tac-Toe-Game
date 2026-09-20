import type { Player } from "@/types/game";

type OnlineRoomInfoProps = {
  roomId: string;
  player: Player | null;
};

export default function OnlineRoomInfo({
  roomId,
  player,
}: OnlineRoomInfoProps) {
  return (
    <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">
      <p className="text-xs uppercase tracking-wider text-indigo-200">
        Room ID
      </p>

      <p className="mt-1 break-all text-xl font-black tracking-widest text-cyan-300">
        {roomId}
      </p>

      <p className="mt-2 text-sm text-indigo-200">
        You are{" "}
        <span
          className={
            player === "X"
              ? "font-bold text-cyan-300"
              : player === "O"
                ? "font-bold text-pink-300"
                : "font-bold text-white"
          }
        >
          Player {player ?? "..."}
        </span>
      </p>
    </div>
  );
}