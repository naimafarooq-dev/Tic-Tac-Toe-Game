"use client";

type Difficulty =
  | "easy"
  | "medium"
  | "hard";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (
    difficulty: Difficulty
  ) => void;
}

export default function DifficultySelector({
  difficulty,
  onDifficultyChange,
}: DifficultySelectorProps) {
  const difficulties = [
    {
      value: "easy" as const,
      label: "Easy",
      icon: "🌱",
    },
    {
      value: "medium" as const,
      label: "Medium",
      icon: "⚡",
    },
    {
      value: "hard" as const,
      label: "Hard",
      icon: "🔥",
    },
  ];

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
          AI Difficulty
        </p>

        <h3 className="mt-1 text-base font-black text-white">
          Choose Difficulty
        </h3>

        <p className="mt-1 text-xs text-indigo-200/70">
          Select how challenging you want the AI to be.
        </p>
      </div>

      {/* Difficulty Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {difficulties.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() =>
              onDifficultyChange(level.value)
            }
            aria-pressed={
              difficulty === level.value
            }
            className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-3 transition-all duration-200 ${
              difficulty === level.value
                ? "scale-[1.03] border-yellow-300/60 bg-yellow-300/20 text-yellow-200 shadow-lg shadow-yellow-300/10"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:bg-white/10 hover:text-white"
            }`}
          >
            {/* Icon */}
            <span className="text-lg leading-none">
              {level.icon}
            </span>

            {/* Label */}
            <span className="mt-1 max-w-full truncate text-xs font-bold sm:text-sm">
              {level.label}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Difficulty */}
      <div className="mt-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-center">
        <span className="text-[11px] text-indigo-200/60">
          Current difficulty:{" "}
        </span>

        <span className="text-xs font-bold capitalize text-yellow-200">
          {difficulty}
        </span>
      </div>

    </div>
  );
}

