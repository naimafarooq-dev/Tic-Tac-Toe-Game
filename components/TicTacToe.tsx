
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  CellValue,
  Player,
} from "@/types/game";

import {
  checkWinner,
  isBoardFull,
} from "@/lib/gameLogic";

import { getAIMove } from "@/lib/ai";
import { createGameRoom } from "@/lib/gameRoom";

import {
  playMoveSound,
  playAIMoveSound,
  playWinSound,
  playDrawSound,
  playRestartSound,
  playRoomCreatedSound,
} from "@/lib/gameSounds";

import GameBoard from "./GameBoard";
import GameStatus from "./GameStatus";
import ScoreBoard from "./ScoreBoard";
import DifficultySelector from "./DifficultySelector";
import GameMode from "./GameMode";

// =====================================================
// TYPES
// =====================================================

type Difficulty =
  | "easy"
  | "medium"
  | "hard";

type GameModeType =
  | "ai"
  | "friend"
  | "online";

// =====================================================
// CONSTANTS
// =====================================================

const EMPTY_BOARD: CellValue[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

// Local Storage key
const STORAGE_KEY = "tic-tac-toe-game";

// =====================================================
// SAVED GAME TYPE
// =====================================================

interface SavedGame {
  board: CellValue[];
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  winningCells: number[];

  xScore: number;
  oScore: number;
  drawScore: number;

  difficulty: Difficulty;
  gameMode: GameModeType;
}

// =====================================================
// COMPONENT
// =====================================================

export default function TicTacToe() {
  const router = useRouter();

  // ===================================================
  // GAME STATE
  // ===================================================

  const [board, setBoard] =
    useState<CellValue[]>([
      ...EMPTY_BOARD,
    ]);

  const [currentPlayer, setCurrentPlayer] =
    useState<Player>("X");

  const [winner, setWinner] =
    useState<Player | null>(null);

  const [isDraw, setIsDraw] =
    useState(false);

  const [isThinking, setIsThinking] =
    useState(false);

  // ===================================================
  // SCORE
  // ===================================================

  const [xScore, setXScore] =
    useState(0);

  const [oScore, setOScore] =
    useState(0);

  const [drawScore, setDrawScore] =
    useState(0);

  // ===================================================
  // WINNING CELLS
  // ===================================================

  const [winningCells, setWinningCells] =
    useState<number[]>([]);

  // ===================================================
  // DIFFICULTY
  // ===================================================

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  // ===================================================
  // GAME MODE
  // ===================================================

  const [gameMode, setGameMode] =
    useState<GameModeType>("ai");

  // ===================================================
  // ONLINE ROOM LOADING
  // ===================================================

  const [creatingRoom, setCreatingRoom] =
    useState(false);

  // ===================================================
  // LOCAL STORAGE LOADED
  // ===================================================

  const [storageLoaded, setStorageLoaded] =
    useState(false);

  // ===================================================
  // LOAD GAME FROM LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    try {
      const savedGame =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (savedGame) {
        const data: SavedGame =
          JSON.parse(savedGame);

        // -------------------------------
        // Board
        // -------------------------------

        if (
          Array.isArray(data.board) &&
          data.board.length === 9
        ) {
          setBoard(data.board);
        }

        // -------------------------------
        // Current Player
        // -------------------------------

        if (
          data.currentPlayer === "X" ||
          data.currentPlayer === "O"
        ) {
          setCurrentPlayer(
            data.currentPlayer
          );
        }

        // -------------------------------
        // Winner
        // -------------------------------

        if (
          data.winner === "X" ||
          data.winner === "O" ||
          data.winner === null
        ) {
          setWinner(data.winner);
        }

        // -------------------------------
        // Draw
        // -------------------------------

        if (
          typeof data.isDraw === "boolean"
        ) {
          setIsDraw(data.isDraw);
        }

        // -------------------------------
        // Winning Cells
        // -------------------------------

        if (
          Array.isArray(data.winningCells)
        ) {
          setWinningCells(
            data.winningCells
          );
        }

        // -------------------------------
        // Scores
        // -------------------------------

        if (
          typeof data.xScore === "number"
        ) {
          setXScore(data.xScore);
        }

        if (
          typeof data.oScore === "number"
        ) {
          setOScore(data.oScore);
        }

        if (
          typeof data.drawScore === "number"
        ) {
          setDrawScore(data.drawScore);
        }

        // -------------------------------
        // Difficulty
        // -------------------------------

        if (
          data.difficulty === "easy" ||
          data.difficulty === "medium" ||
          data.difficulty === "hard"
        ) {
          setDifficulty(
            data.difficulty
          );
        }

        // -------------------------------
        // Game Mode
        // -------------------------------

        if (
          data.gameMode === "ai" ||
          data.gameMode === "friend" ||
          data.gameMode === "online"
        ) {
          setGameMode(
            data.gameMode
          );
        }
      }
    } catch (error) {
      console.error(
        "Unable to load saved game:",
        error
      );
    }

    // Important:
    // Local Storage loading complete
    setStorageLoaded(true);
  }, []);

  // ===================================================
  // SAVE GAME TO LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    // Don't save before the first load
    if (!storageLoaded) {
      return;
    }

    const gameData: SavedGame = {
      board,
      currentPlayer,
      winner,
      isDraw,
      winningCells,

      xScore,
      oScore,
      drawScore,

      difficulty,
      gameMode,
    };

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(gameData)
      );
    } catch (error) {
      console.error(
        "Unable to save game:",
        error
      );
    }
  }, [
    board,
    currentPlayer,
    winner,
    isDraw,
    winningCells,
    xScore,
    oScore,
    drawScore,
    difficulty,
    gameMode,
    storageLoaded,
  ]);

  // ===================================================
  // CREATE / GET PLAYER ID
  // ===================================================

  const getPlayerId = () => {
    let playerId =
      localStorage.getItem(
        "tic-tac-toe-player-id"
      );

    if (!playerId) {
      playerId =
        "player-" +
        Date.now() +
        "-" +
        Math.random()
          .toString(36)
          .substring(2, 10);

      localStorage.setItem(
        "tic-tac-toe-player-id",
        playerId
      );
    }

    return playerId;
  };

  // ===================================================
  // RESET BOARD
  // ===================================================

  const resetBoard = () => {
    setBoard([
      ...EMPTY_BOARD,
    ]);

    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setIsThinking(false);
  };

  // ===================================================
  // DIFFICULTY CHANGE
  // ===================================================

  const handleDifficultyChange = (
    newDifficulty: Difficulty
  ) => {
    setDifficulty(newDifficulty);

    resetBoard();
  };

  // ===================================================
  // GAME MODE CHANGE
  // ===================================================

  const handleGameModeChange = (
    newMode: GameModeType
  ) => {
    setGameMode(newMode);

    resetBoard();
  };

  // ===================================================
  // CREATE ONLINE GAME
  // ===================================================

  const handleCreateOnlineGame =
    async () => {
      if (creatingRoom) {
        return;
      }

      try {
        setCreatingRoom(true);

        const playerId =
          getPlayerId();

        console.log(
          "Player ID:",
          playerId
        );

        const roomId =
          await createGameRoom(
            playerId
          );

        console.log(
          "Game room created:",
          roomId
        );

        playRoomCreatedSound();

        router.push(
          `/game/${roomId}`
        );
      } catch (error) {
        console.error(
          "Unable to create online game:",
          error
        );

        alert(
          "Unable to create game room. Please try again."
        );

        setCreatingRoom(false);
      }
    };

  // ===================================================
  // GAME FINISH
  // ===================================================

  const finishGame = (
    newBoard: CellValue[]
  ): boolean => {
    const gameWinner =
      checkWinner(newBoard);

    // -------------------------------------------------
    // WINNER
    // -------------------------------------------------

    if (gameWinner) {
      setWinner(
        gameWinner.player
      );

      setWinningCells(
        gameWinner.cells
      );

      if (
        gameWinner.player === "X"
      ) {
        setXScore(
          (score) => score + 1
        );
      } else {
        setOScore(
          (score) => score + 1
        );
      }

      playWinSound();

      return true;
    }

    // -------------------------------------------------
    // DRAW
    // -------------------------------------------------

    if (isBoardFull(newBoard)) {
      setIsDraw(true);

      setDrawScore(
        (score) => score + 1
      );

      playDrawSound();

      return true;
    }

    return false;
  };

  // ===================================================
  // AI MOVE
  // ===================================================

  const makeAIMove = (
    currentBoard: CellValue[]
  ) => {
    setIsThinking(true);

    setTimeout(() => {
      const aiMove =
        getAIMove(
          currentBoard,
          difficulty
        );

      if (aiMove === -1) {
        setIsThinking(false);
        return;
      }

      const newBoard = [
        ...currentBoard,
      ];

      // AI = O
      newBoard[aiMove] = "O";

      setBoard(newBoard);

      playAIMoveSound();

      const gameFinished =
        finishGame(newBoard);

      if (gameFinished) {
        setIsThinking(false);
        return;
      }

      setCurrentPlayer("X");

      setIsThinking(false);
    }, 500);
  };

  // ===================================================
  // CELL CLICK
  // ===================================================

  const handleCellClick = (
    index: number
  ) => {
    // Game finished
    if (winner || isDraw) {
      return;
    }

    // AI thinking
    if (isThinking) {
      return;
    }

    // Cell already occupied
    if (board[index] !== "") {
      return;
    }

    // -------------------------------------------------
    // ONLINE MODE
    // -------------------------------------------------

    if (
      gameMode === "online"
    ) {
      return;
    }

    // -------------------------------------------------
    // AI MODE
    // -------------------------------------------------

    if (gameMode === "ai") {
      // Only X can play
      if (
        currentPlayer !== "X"
      ) {
        return;
      }

      const newBoard = [
        ...board,
      ];

      // Human = X
      newBoard[index] = "X";

      setBoard(newBoard);

      playMoveSound();

      const gameFinished =
        finishGame(newBoard);

      if (gameFinished) {
        return;
      }

      setCurrentPlayer("O");

      makeAIMove(newBoard);

      return;
    }

    // -------------------------------------------------
    // FRIEND MODE
    // -------------------------------------------------

    if (
      gameMode === "friend"
    ) {
      const newBoard = [
        ...board,
      ];

      newBoard[index] =
        currentPlayer;

      setBoard(newBoard);

      playMoveSound();

      const gameFinished =
        finishGame(newBoard);

      if (gameFinished) {
        return;
      }

      setCurrentPlayer(
        currentPlayer === "X"
          ? "O"
          : "X"
      );
    }
  };

  // ===================================================
  // RESTART CURRENT ROUND
  // ===================================================

  const restartGame = () => {
    resetBoard();

    playRestartSound();

    // Scores remain unchanged
    // Local Storage automatically updates
  };

  // ===================================================
  // RESET ENTIRE GAME
  // ===================================================

  const resetGame = () => {
    // Reset board
    setBoard([
      ...EMPTY_BOARD,
    ]);

    // Reset turn
    setCurrentPlayer("X");

    // Reset result
    setWinner(null);
    setIsDraw(false);

    // Reset winning cells
    setWinningCells([]);

    // Reset AI state
    setIsThinking(false);

    // Reset scores
    setXScore(0);
    setOScore(0);
    setDrawScore(0);

    // Clear saved game
    localStorage.removeItem(
      STORAGE_KEY
    );

    playRestartSound();
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-8 sm:px-6 lg:px-10">

      {/* ================================================= */}
      {/* DECORATIVE BACKGROUND */}
      {/* ================================================= */}

      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      {/* ================================================= */}
      {/* MAIN CONTAINER */}
      {/* ================================================= */}

      <div className="relative mx-auto w-full max-w-7xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8 text-center">

          <div className="mb-4 flex justify-center">

            <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-2 text-sm font-bold text-cyan-200 shadow-lg backdrop-blur-xl">
              🎮 LET&apos;S PLAY
            </div>

          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">

            <span className="text-cyan-300 drop-shadow-lg">
              Tic
            </span>{" "}

            <span className="text-pink-300 drop-shadow-lg">
              Tac
            </span>{" "}

            <span className="text-yellow-300 drop-shadow-lg">
              Toe
            </span>

          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-indigo-200 sm:text-base">
            Choose your opponent and get three in a row!
          </p>

        </div>

        {/* ================================================= */}
        {/* GAME LAYOUT */}
        {/* ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(420px,1fr)_260px]">

          {/* ================================================= */}
          {/* LEFT PANEL */}
          {/* ================================================= */}

          <div className="space-y-5">

            {/* GAME MODE */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

              <div className="mb-4">

                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Game Mode
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Choose Opponent
                </h2>

              </div>

              <GameMode
                mode={gameMode}
                onModeChange={
                  handleGameModeChange
                }
              />

            </div>

            {/* DIFFICULTY */}

            {gameMode === "ai" && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

                <div className="mb-4">

                  <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                    AI Settings
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Difficulty
                  </h2>

                </div>

                <DifficultySelector
                  difficulty={
                    difficulty
                  }
                  onDifficultyChange={
                    handleDifficultyChange
                  }
                />

              </div>
            )}

            {/* ONLINE GAME */}

            {gameMode === "online" && (
              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5 shadow-2xl backdrop-blur-xl">

                <div className="text-center">

                  <div className="mb-3 text-4xl">
                    🌐
                  </div>

                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                    Multiplayer
                  </p>

                  <h2 className="mt-1 text-xl font-black text-cyan-100">
                    Online Game
                  </h2>

                  <p className="mt-2 text-xs leading-relaxed text-indigo-200">
                    Create a private room and invite
                    your friend to play.
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleCreateOnlineGame
                    }
                    disabled={
                      creatingRoom
                    }
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-4 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {creatingRoom
                      ? "Creating Room..."
                      : "🌐 Create Online Game"}
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ================================================= */}
          {/* CENTER GAME */}
          {/* ================================================= */}

          <div className="flex flex-col items-center">

            <div className="w-full rounded-[2rem] border border-white/10 bg-indigo-950/50 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">

              {/* STATUS */}

              <div className="mb-6">

                <GameStatus
                  currentPlayer={
                    currentPlayer
                  }
                  winner={winner}
                  isDraw={isDraw}
                />

              </div>

              {/* AI THINKING */}

              {gameMode === "ai" &&
                isThinking && (
                  <div className="mb-5 flex justify-center">

                    <div className="flex items-center gap-2 rounded-2xl border border-purple-300/20 bg-purple-400/10 px-5 py-3 text-sm font-semibold text-purple-200 shadow-lg">

                      <span className="animate-bounce">
                        🤖
                      </span>

                      AI is thinking...

                    </div>

                  </div>
                )}

              {/* BOARD */}

              <div className="mx-auto w-full max-w-[520px]">

                <GameBoard
                  board={board}
                  winningCells={
                    winningCells
                  }
                  disabled={
                    winner !== null ||
                    isDraw ||
                    isThinking ||
                    gameMode === "online"
                  }
                  onCellClick={
                    handleCellClick
                  }
                />

              </div>

              {/* RESTART CURRENT ROUND */}

              <button
                type="button"
                onClick={
                  restartGame
                }
                className="mx-auto mt-7 block w-full max-w-[520px] rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-4 text-base font-black text-white shadow-xl shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                ↻ Restart Game
              </button>

              {/* RESET ENTIRE GAME */}

              <button
                type="button"
                onClick={
                  resetGame
                }
                className="mx-auto mt-3 block w-full max-w-[520px] rounded-2xl border border-red-300/20 bg-red-400/10 px-6 py-3.5 text-sm font-bold text-red-200 transition-all duration-200 hover:border-red-300/40 hover:bg-red-400/20 hover:text-red-100 active:scale-[0.98]"
              >
                🗑️ Reset Game
              </button>

              {/* CURRENT MODE */}

              <div className="mt-5 text-center">

                <p className="text-xs font-semibold text-indigo-200/60">

                  {gameMode === "ai" && (
                    <>
                      ✨ Player X vs 🤖 AI
                    </>
                  )}

                  {gameMode === "friend" && (
                    <>
                      ✨ Player X vs Player O
                    </>
                  )}

                  {gameMode === "online" && (
                    <>
                      ✨ Online Multiplayer
                    </>
                  )}

                </p>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* RIGHT PANEL */}
          {/* ================================================= */}

          <div className="space-y-5">

            {/* SCORE BOARD */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

              <div className="mb-5">

                <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
                  Statistics
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Score Board
                </h2>

              </div>

              <ScoreBoard
                xScore={xScore}
                oScore={oScore}
                drawScore={drawScore}
              />

            </div>

            {/* PLAYER INFORMATION */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

              <p className="text-xs font-bold uppercase tracking-widest text-pink-300">
                Players
              </p>

              <div className="mt-4 space-y-3">

                {/* PLAYER X */}

                <div className="flex items-center justify-between rounded-2xl bg-cyan-400/10 px-4 py-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/20 font-black text-cyan-300">
                      X
                    </div>

                    <span className="text-sm font-bold text-white">
                      Player X
                    </span>

                  </div>

                  <span className="text-xs font-semibold text-cyan-300">
                    {gameMode === "ai"
                      ? "You"
                      : "Player 1"}
                  </span>

                </div>

                {/* PLAYER O */}

                <div className="flex items-center justify-between rounded-2xl bg-pink-400/10 px-4 py-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-400/20 font-black text-pink-300">
                      O
                    </div>

                    <span className="text-sm font-bold text-white">
                      Player O
                    </span>

                  </div>

                  <span className="text-xs font-semibold text-pink-300">
                    {gameMode === "ai"
                      ? "AI"
                      : "Player 2"}
                  </span>

                </div>

              </div>

            </div>

            {/* QUICK TIP */}

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">

              <div className="mb-3 flex items-center gap-2">

                <span className="text-xl">
                  💡
                </span>

                <h3 className="font-black text-white">
                  Quick Tip
                </h3>

              </div>

              <p className="text-xs leading-relaxed text-indigo-200">

                {gameMode === "ai"
                  ? "Try to control the center and corners. The AI is watching."
                  : gameMode === "friend"
                    ? "Think ahead. Three matching symbols in a row wins the game."
                    : "Share your room link with a friend and start playing online."}

              </p>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="mt-8 text-center">

          <p className="text-xs font-medium text-indigo-300/50">
            Tic Tac Toe • Play • Challenge • Win
          </p>

        </div>

      </div>

    </main>
  );
}

