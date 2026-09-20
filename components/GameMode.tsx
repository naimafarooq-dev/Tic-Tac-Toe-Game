"use client";

type GameMode = "ai" | "friend" | "online";

type GameModeProps = {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
};

export default function GameMode({
  mode,
  onModeChange,
}: GameModeProps) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-center text-sm font-bold text-indigo-200">
        Choose Game Mode
      </p>

      <div className="grid grid-cols-3 gap-2">

        {/* AI */}
        <button
          type="button"
          onClick={() => onModeChange("ai")}
          className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
            mode === "ai"
              ? "border-cyan-300 bg-cyan-400/20 text-cyan-200 shadow-lg shadow-cyan-400/20"
              : "border-white/15 bg-white/10 text-indigo-200 hover:bg-white/15"
          }`}
        >
          <div className="text-xl">🤖</div>
          <div className="mt-1">AI</div>
        </button>

        {/* Friend */}
        <button
          type="button"
          onClick={() => onModeChange("friend")}
          className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
            mode === "friend"
              ? "border-pink-300 bg-pink-400/20 text-pink-200 shadow-lg shadow-pink-400/20"
              : "border-white/15 bg-white/10 text-indigo-200 hover:bg-white/15"
          }`}
        >
          <div className="text-xl">👥</div>
          <div className="mt-1">Friend</div>
        </button>

        {/* Online */}
        <button
          type="button"
          onClick={() => onModeChange("online")}
          className={`rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
            mode === "online"
              ? "border-yellow-300 bg-yellow-400/20 text-yellow-200 shadow-lg shadow-yellow-400/20"
              : "border-white/15 bg-white/10 text-indigo-200 hover:bg-white/15"
          }`}
        >
          <div className="text-xl">🌐</div>
          <div className="mt-1">Online</div>
        </button>

      </div>
    </div>
  );
}