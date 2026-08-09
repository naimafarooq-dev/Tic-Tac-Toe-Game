import type { CellValue, Player } from "@/types/game";

export type Difficulty = "easy" | "medium" | "hard";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/* --------------------------------
   Get Empty Cells
--------------------------------- */

function getEmptyCells(board: CellValue[]): number[] {
  return board
    .map((cell, index) => (cell === "" ? index : -1))
    .filter((index) => index !== -1);
}

/* --------------------------------
   Check Winner
--------------------------------- */

function getWinner(board: CellValue[]): Player | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (
      board[a] !== "" &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a] as Player;
    }
  }

  return null;
}

/* --------------------------------
   Check Draw
--------------------------------- */

function isBoardFull(board: CellValue[]): boolean {
  return board.every((cell) => cell !== "");
}

/* --------------------------------
   EASY AI
   Random Move
--------------------------------- */

function getEasyMove(board: CellValue[]): number {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return -1;
  }

  const randomIndex = Math.floor(
    Math.random() * emptyCells.length
  );

  return emptyCells[randomIndex];
}

/* --------------------------------
   Find Winning Move
--------------------------------- */

function findWinningMove(
  board: CellValue[],
  player: Player
): number {
  const emptyCells = getEmptyCells(board);

  for (const index of emptyCells) {
    const testBoard = [...board];

    testBoard[index] = player;

    if (getWinner(testBoard) === player) {
      return index;
    }
  }

  return -1;
}

/* --------------------------------
   MEDIUM AI
--------------------------------- */

function getMediumMove(board: CellValue[]): number {
  // AI ki winning move
  const winningMove = findWinningMove(board, "O");

  if (winningMove !== -1) {
    return winningMove;
  }

  // Human ki winning move block karo
  const blockingMove = findWinningMove(board, "X");

  if (blockingMove !== -1) {
    return blockingMove;
  }

  // Center prefer karo
  if (board[4] === "") {
    return 4;
  }

  // Corners prefer karo
  const corners = [0, 2, 6, 8].filter(
    (index) => board[index] === ""
  );

  if (corners.length > 0) {
    const randomCorner =
      corners[
        Math.floor(Math.random() * corners.length)
      ];

    return randomCorner;
  }

  // Agar kuch aur na mile to random move
  return getEasyMove(board);
}

/* --------------------------------
   HARD AI - MINIMAX
--------------------------------- */

function minimax(
  board: CellValue[],
  depth: number,
  isMaximizing: boolean
): number {
  const winner = getWinner(board);

  // AI wins
  if (winner === "O") {
    return 10 - depth;
  }

  // Human wins
  if (winner === "X") {
    return depth - 10;
  }

  // Draw
  if (isBoardFull(board)) {
    return 0;
  }

  // AI turn
  if (isMaximizing) {
    let bestScore = -Infinity;

    const emptyCells = getEmptyCells(board);

    for (const index of emptyCells) {
      const newBoard = [...board];

      newBoard[index] = "O";

      const score = minimax(
        newBoard,
        depth + 1,
        false
      );

      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  }

  // Human turn
  let bestScore = Infinity;

  const emptyCells = getEmptyCells(board);

  for (const index of emptyCells) {
    const newBoard = [...board];

    newBoard[index] = "X";

    const score = minimax(
      newBoard,
      depth + 1,
      true
    );

    bestScore = Math.min(bestScore, score);
  }

  return bestScore;
}

/* --------------------------------
   Get Hard AI Move
--------------------------------- */

function getHardMove(board: CellValue[]): number {
  const emptyCells = getEmptyCells(board);

  if (emptyCells.length === 0) {
    return -1;
  }

  let bestScore = -Infinity;
  let bestMove = emptyCells[0];

  for (const index of emptyCells) {
    const newBoard = [...board];

    newBoard[index] = "O";

    const score = minimax(
      newBoard,
      0,
      false
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

/* --------------------------------
   MAIN AI FUNCTION
--------------------------------- */

export function getAIMove(
  board: CellValue[],
  difficulty: Difficulty
): number {
  switch (difficulty) {
    case "easy":
      return getEasyMove(board);

    case "medium":
      return getMediumMove(board);

    case "hard":
      return getHardMove(board);

    default:
      return getEasyMove(board);
  }
}