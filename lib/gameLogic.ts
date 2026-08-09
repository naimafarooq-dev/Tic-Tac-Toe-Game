import { WINNING_COMBINATIONS } from "./constants";
import type { CellValue, WinnerResult } from "@/types/game";

export const checkWinner = (
  board: CellValue[]
): WinnerResult | null => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return {
        player: board[a] as "X" | "O",
        cells: combination,
      };
    }
  }

  return null;
};

export const isBoardFull = (
  board: CellValue[]
): boolean => {
  return board.every((cell) => cell !== "");
};