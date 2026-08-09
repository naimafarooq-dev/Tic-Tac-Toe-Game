export type Player = "X" | "O";

export type CellValue = Player | "";

export type GameMode = "pvp" | "ai";

export type Difficulty = "easy" | "medium" | "hard";

export type WinnerResult = {
  player: Player;
  cells: number[];
};

export interface GameRoom {
  board: CellValue[];

  currentPlayer: Player;

  playerX: string | null;

  playerO: string | null;

  winner: Player | null;

  isDraw: boolean;

  status:
    | "waiting"
    | "playing"
    | "finished";

  createdAt?: unknown;
}