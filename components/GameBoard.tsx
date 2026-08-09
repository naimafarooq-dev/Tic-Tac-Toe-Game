"use client";

import type { CellValue } from "@/types/game";
import GameCell from "./GameCell";

type GameBoardProps = {
  board: CellValue[];
  winningCells: number[];
  disabled: boolean;
  onCellClick: (index: number) => void;
};

export default function GameBoard({
  board,
  winningCells,
  disabled,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className="mx-auto grid w-fit grid-cols-3 gap-3">
      {board.map((cell, index) => (
        <GameCell
          key={index}
          cell={cell}
          isWinning={winningCells.includes(index)}
          disabled={disabled}
          onClick={() => onCellClick(index)}
        />
      ))}
    </div>
  );
}