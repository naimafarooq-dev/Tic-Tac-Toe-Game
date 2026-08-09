type ScoreBoardProps = {
  xScore: number;
  oScore: number;
  drawScore: number;
};

export default function ScoreBoard({
  xScore,
  oScore,
  drawScore,
}: ScoreBoardProps) {
  return (
    <div className="mt-7 grid grid-cols-3 gap-3">

      {/* Player X */}
      <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 p-3 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
          Player X
        </p>

        <p className="mt-1 text-2xl font-black text-cyan-300">
          {xScore}
        </p>

        <p className="text-xs text-cyan-100/60">
          Wins
        </p>
      </div>

      {/* Draw */}
      <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-3 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-yellow-200">
          Draw
        </p>

        <p className="mt-1 text-2xl font-black text-yellow-300">
          {drawScore}
        </p>

        <p className="text-xs text-yellow-100/60">
          Games
        </p>
      </div>

      {/* Player O */}
      <div className="rounded-2xl border border-pink-300/20 bg-pink-400/10 p-3 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-pink-200">
          Player O
        </p>

        <p className="mt-1 text-2xl font-black text-pink-300">
          {oScore}
        </p>

        <p className="text-xs text-pink-100/60">
          Wins
        </p>
      </div>

    </div>
  );
}