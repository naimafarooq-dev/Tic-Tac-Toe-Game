"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { CellValue, Player } from "@/types/game";
import { checkWinner, isBoardFull } from "@/lib/gameLogic";
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

type Difficulty = "easy" | "medium" | "hard";
type GameModeType = "ai" | "friend" | "online";

const EMPTY_BOARD: CellValue[] = Array(9).fill("");
const STORAGE_KEY = "tic-tac-toe-game";

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

export default function TicTacToe() {
  const router = useRouter();

  const [board, setBoard] = useState<CellValue[]>([...EMPTY_BOARD]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);

  const [difficulty, setDifficulty] =
    useState<Difficulty>("easy");

  const [gameMode, setGameMode] =
    useState<GameModeType>("ai");

  const [creatingRoom, setCreatingRoom] = useState(false);
  const [storageLoaded, setStorageLoaded] = useState(false);

  // Load saved game
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data: SavedGame = JSON.parse(saved);

        if (Array.isArray(data.board) && data.board.length === 9)
          setBoard(data.board);

        if (data.currentPlayer === "X" || data.currentPlayer === "O")
          setCurrentPlayer(data.currentPlayer);

        if (data.winner === "X" || data.winner === "O" || data.winner === null)
          setWinner(data.winner);

        if (typeof data.isDraw === "boolean")
          setIsDraw(data.isDraw);

        if (Array.isArray(data.winningCells))
          setWinningCells(data.winningCells);

        if (typeof data.xScore === "number")
          setXScore(data.xScore);

        if (typeof data.oScore === "number")
          setOScore(data.oScore);

        if (typeof data.drawScore === "number")
          setDrawScore(data.drawScore);

        if (
          data.difficulty === "easy" ||
          data.difficulty === "medium" ||
          data.difficulty === "hard"
        ) {
          setDifficulty(data.difficulty);
        }

        if (
          data.gameMode === "ai" ||
          data.gameMode === "friend" ||
          data.gameMode === "online"
        ) {
          setGameMode(data.gameMode);
        }
      }
    } catch (error) {
      console.error("Unable to load saved game:", error);
    }

    setStorageLoaded(true);
  }, []);

  // Save game
  useEffect(() => {
    if (!storageLoaded) return;

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
      console.error("Unable to save game:", error);
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

  // Reset board only
  const resetBoard = () => {
    setBoard([...EMPTY_BOARD]);
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
    setIsThinking(false);
  };

  // Finish game
  const finishGame = (newBoard: CellValue[]) => {
    const result = checkWinner(newBoard);

    if (result) {
      setWinner(result.player);
      setWinningCells(result.cells);

      if (result.player === "X") {
        setXScore((score) => score + 1);
      } else {
        setOScore((score) => score + 1);
      }

      playWinSound();
      return true;
    }

    if (isBoardFull(newBoard)) {
      setIsDraw(true);
      setDrawScore((score) => score + 1);
      playDrawSound();
      return true;
    }

    return false;
  };

  // AI move
  const makeAIMove = (currentBoard: CellValue[]) => {
    setIsThinking(true);

    setTimeout(() => {
      const aiMove = getAIMove(
        currentBoard,
        difficulty
      );

      if (aiMove === -1) {
        setIsThinking(false);
        return;
      }

      const newBoard = [...currentBoard];
      newBoard[aiMove] = "O";

      setBoard(newBoard);
      playAIMoveSound();

      if (finishGame(newBoard)) {
        setIsThinking(false);
        return;
      }

      setCurrentPlayer("X");
      setIsThinking(false);
    }, 500);
  };

  // Cell click
  const handleCellClick = (index: number) => {
    if (winner || isDraw || isThinking) return;
    if (board[index] !== "") return;
    if (gameMode === "online") return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    // AI mode: human is always X
    if (gameMode === "ai") {
      if (currentPlayer !== "X") return;

      newBoard[index] = "X";
      setBoard(newBoard);
      playMoveSound();

      if (finishGame(newBoard)) return;

      setCurrentPlayer("O");
      makeAIMove(newBoard);
      return;
    }

    // Friend mode
    setBoard(newBoard);
    playMoveSound();

    if (finishGame(newBoard)) return;

    setCurrentPlayer(
      currentPlayer === "X" ? "O" : "X"
    );
  };

  // Change difficulty
  const handleDifficultyChange = (
    value: Difficulty
  ) => {
    setDifficulty(value);
    resetBoard();
  };

  // Change mode
  const handleGameModeChange = (
    value: GameModeType
  ) => {
    setGameMode(value);
    resetBoard();
  };

  // Player ID for online room
  const getPlayerId = () => {
    let id = localStorage.getItem(
      "tic-tac-toe-player-id"
    );

    if (!id) {
      id = `player-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}`;

      localStorage.setItem(
        "tic-tac-toe-player-id",
        id
      );
    }

    return id;
  };

  // Create online room
  const handleCreateOnlineGame = async () => {
    if (creatingRoom) return;

    try {
      setCreatingRoom(true);

      const roomId = await createGameRoom(
        getPlayerId()
      );

      playRoomCreatedSound();
      router.push(`/game/${roomId}`);
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

  // Restart round
  const restartGame = () => {
    resetBoard();
    playRestartSound();
  };

  // Reset everything
  const resetGame = () => {
    resetBoard();

    setXScore(0);
    setOScore(0);
    setDrawScore(0);

    localStorage.removeItem(STORAGE_KEY);

    playRestartSound();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-8 sm:px-6 lg:px-10">

      {/* Background */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-2 text-sm font-bold text-cyan-200 shadow-lg backdrop-blur-xl">
              🎮 LET&apos;S PLAY
            </div>
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-cyan-300">Tic</span>{" "}
            <span className="text-pink-300">Tac</span>{" "}
            <span className="text-yellow-300">Toe</span>
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-indigo-200 sm:text-base">
            Choose your opponent and get three in a row!
          </p>
        </header>

        {/* Game Layout */}
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(420px,1fr)_260px]">

          {/* Left */}
          <aside className="space-y-5">

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                Game Mode
              </p>

              <h2 className="mt-1 mb-4 text-xl font-black text-white">
                Choose Opponent
              </h2>

              <GameMode
                mode={gameMode}
                onModeChange={handleGameModeChange}
              />
            </section>

            {gameMode === "ai" && (
              <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
                  AI Settings
                </p>

                <h2 className="mt-1 mb-4 text-xl font-black text-white">
                  Difficulty
                </h2>

                <DifficultySelector
                  difficulty={difficulty}
                  onDifficultyChange={
                    handleDifficultyChange
                  }
                />
              </section>
            )}

            {gameMode === "online" && (
              <section className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5 shadow-2xl backdrop-blur-xl text-center">
                <div className="mb-3 text-4xl">🌐</div>

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
                  onClick={handleCreateOnlineGame}
                  disabled={creatingRoom}
                  className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-4 py-3 font-bold text-white shadow-lg transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingRoom
                    ? "Creating Room..."
                    : "🌐 Create Online Game"}
                </button>
              </section>
            )}

          </aside>

          {/* Center */}
          <section className="flex flex-col items-center">
            <div className="w-full rounded-[2rem] border border-white/10 bg-indigo-950/50 p-5 shadow-2xl backdrop-blur-xl sm:p-7 lg:p-8">

              <div className="mb-6">
                <GameStatus
                  currentPlayer={currentPlayer}
                  winner={winner}
                  isDraw={isDraw}
                />
              </div>

              {gameMode === "ai" && isThinking && (
                <div className="mb-5 flex justify-center">
                  <div className="rounded-2xl border border-purple-300/20 bg-purple-400/10 px-5 py-3 text-sm font-semibold text-purple-200">
                    🤖 AI is thinking...
                  </div>
                </div>
              )}

              <div className="mx-auto w-full max-w-[520px]">
                <GameBoard
                  board={board}
                  winningCells={winningCells}
                  disabled={
                    winner !== null ||
                    isDraw ||
                    isThinking ||
                    gameMode === "online"
                  }
                  onCellClick={handleCellClick}
                />
              </div>

              <button
                type="button"
                onClick={restartGame}
                className="mx-auto mt-7 block w-full max-w-[520px] rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 px-6 py-4 text-base font-black text-white shadow-xl transition hover:scale-[1.02] active:scale-[0.98]"
              >
                ↻ Restart Game
              </button>

              <button
                type="button"
                onClick={resetGame}
                className="mx-auto mt-3 block w-full max-w-[520px] rounded-2xl border border-red-300/20 bg-red-400/10 px-6 py-3.5 text-sm font-bold text-red-200 transition hover:bg-red-400/20"
              >
                🗑️ Reset Game
              </button>

              <p className="mt-5 text-center text-xs font-semibold text-indigo-200/60">
                {gameMode === "ai" &&
                  "✨ Player X vs 🤖 AI"}

                {gameMode === "friend" &&
                  "✨ Player X vs Player O"}

                {gameMode === "online" &&
                  "✨ Online Multiplayer"}
              </p>

            </div>
          </section>

          {/* Right */}
          <aside className="space-y-5">

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
                Statistics
              </p>

              <h2 className="mt-1 mb-5 text-xl font-black text-white">
                Score Board
              </h2>

              <ScoreBoard
                xScore={xScore}
                oScore={oScore}
                drawScore={drawScore}
              />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-pink-300">
                Players
              </p>

              <div className="mt-4 space-y-3">

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
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
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
            </section>

          </aside>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-xs font-medium text-indigo-300/50">
            Tic Tac Toe • Play • Challenge • Win
          </p>
        </footer>

      </div>
    </main>
  );
}