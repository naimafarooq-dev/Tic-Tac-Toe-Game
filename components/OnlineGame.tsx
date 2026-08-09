"use client";

import { useEffect, useState } from "react";

import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CellValue,
  Player,
  GameRoom,
} from "@/types/game";

import {
  checkWinner,
  isBoardFull,
} from "@/lib/gameLogic";

import GameBoard from "./GameBoard";
import ShareGame from "./ShareGame";

type OnlineGameProps = {
  roomId: string;
};

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

export default function OnlineGame({
  roomId,
}: OnlineGameProps) {
  // -----------------------------
  // GAME STATE
  // -----------------------------

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

  // -----------------------------
  // PLAYER STATE
  // -----------------------------

  const [playerId, setPlayerId] =
    useState("");

  const [myPlayer, setMyPlayer] =
    useState<Player | null>(null);

  // -----------------------------
  // ROOM STATE
  // -----------------------------

  const [gameStatus, setGameStatus] =
    useState<
      "waiting" | "playing" | "finished"
    >("waiting");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // -----------------------------
  // WINNING CELLS
  // -----------------------------

  const [winningCells, setWinningCells] =
    useState<number[]>([]);

  // -----------------------------
  // CREATE / GET PLAYER ID
  // -----------------------------

  useEffect(() => {
    let id = localStorage.getItem(
      "tic-tac-toe-player-id"
    );

    if (!id) {
      id = crypto.randomUUID();

      localStorage.setItem(
        "tic-tac-toe-player-id",
        id
      );
    }

    setPlayerId(id);
  }, []);

  // -----------------------------
  // CREATE ROOM IF IT DOESN'T EXIST
  // -----------------------------

  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }

    const createRoom = async () => {
      try {
        const roomRef = doc(
          db,
          "gameRooms",
          roomId
        );

        const roomSnapshot =
          await getDoc(roomRef);

        // Room already exists
        if (roomSnapshot.exists()) {
          return;
        }

        // Create new room
        const room: GameRoom = {
          board: [
            ...EMPTY_BOARD,
          ],
          currentPlayer: "X",
          playerX: playerId,
          playerO: null,
          winner: null,
          isDraw: false,
          status: "waiting",
        };

        await setDoc(
          roomRef,
          room
        );
      } catch (error) {
        console.error(
          "Room creation error:",
          error
        );

        setError(
          "Unable to create game room."
        );

        setLoading(false);
      }
    };

    createRoom();
  }, [roomId, playerId]);

  // -----------------------------
  // LISTEN TO FIRESTORE ROOM
  // -----------------------------

  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }

    const roomRef = doc(
      db,
      "gameRooms",
      roomId
    );

    const unsubscribe = onSnapshot(
      roomRef,
      async (snapshot) => {
        try {
          // -----------------------------
          // ROOM NOT FOUND
          // -----------------------------

          if (!snapshot.exists()) {
            setError(
              "Game room not found."
            );

            setLoading(false);

            return;
          }

          const data =
            snapshot.data() as GameRoom;

          // -----------------------------
          // UPDATE GAME STATE
          // -----------------------------

          setBoard(
            data.board ?? [
              ...EMPTY_BOARD,
            ]
          );

          setCurrentPlayer(
            data.currentPlayer ?? "X"
          );

          setWinner(
            data.winner ?? null
          );

          setIsDraw(
            data.isDraw ?? false
          );

          // -----------------------------
          // WINNING CELLS
          // -----------------------------

          if (
            data.winner &&
            data.board
          ) {
            const result =
              checkWinner(data.board);

            setWinningCells(
              result?.cells ?? []
            );
          } else {
            setWinningCells([]);
          }

          // -----------------------------
          // DETERMINE MY PLAYER
          // -----------------------------

          if (
            data.playerX === playerId
          ) {
            setMyPlayer("X");
          } else if (
            data.playerO === playerId
          ) {
            setMyPlayer("O");
          } else if (
            !data.playerX
          ) {
            // First player becomes X

            await setDoc(
              roomRef,
              {
                playerX: playerId,
              },
              {
                merge: true,
              }
            );

            setMyPlayer("X");
          } else if (
            !data.playerO
          ) {
            // Second player becomes O

            await setDoc(
              roomRef,
              {
                playerO: playerId,
                status: "playing",
              },
              {
                merge: true,
              }
            );

            setMyPlayer("O");
          }

          // -----------------------------
          // ROOM STATUS
          // -----------------------------

          if (
            data.playerX &&
            data.playerO &&
            !data.winner &&
            !data.isDraw
          ) {
            setGameStatus("playing");
          } else if (
            data.winner ||
            data.isDraw
          ) {
            setGameStatus("finished");
          } else {
            setGameStatus("waiting");
          }

          setLoading(false);
        } catch (error) {
          console.error(
            "Error processing room:",
            error
          );

          setError(
            "Unable to process game room."
          );

          setLoading(false);
        }
      },
      (error) => {
        console.error(
          "Firestore error:",
          error
        );

        setError(
          "Unable to connect to Firebase."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId, playerId]);

  // -----------------------------
  // CELL CLICK
  // -----------------------------

  const handleCellClick = async (
    index: number
  ) => {
    if (loading) {
      return;
    }

    if (error) {
      return;
    }

    if (!myPlayer) {
      return;
    }

    if (
      gameStatus !== "playing"
    ) {
      return;
    }

    if (
      winner ||
      isDraw
    ) {
      return;
    }

    if (
      currentPlayer !== myPlayer
    ) {
      return;
    }

    if (
      board[index] !== ""
    ) {
      return;
    }

    // -----------------------------
    // CREATE NEW BOARD
    // -----------------------------

    const newBoard = [
      ...board,
    ];

    newBoard[index] = myPlayer;

    // -----------------------------
    // CHECK WINNER
    // -----------------------------

    const gameWinner =
      checkWinner(newBoard);

    const draw =
      !gameWinner &&
      isBoardFull(newBoard);

    // -----------------------------
    // FIRESTORE ROOM
    // -----------------------------

    const roomRef = doc(
      db,
      "gameRooms",
      roomId
    );

    // -----------------------------
    // WIN
    // -----------------------------

    if (gameWinner) {
      await setDoc(
        roomRef,
        {
          board: newBoard,
          currentPlayer: myPlayer,
          winner:
            gameWinner.player,
          isDraw: false,
          status: "finished",
        },
        {
          merge: true,
        }
      );

      return;
    }

    // -----------------------------
    // DRAW
    // -----------------------------

    if (draw) {
      await setDoc(
        roomRef,
        {
          board: newBoard,
          currentPlayer: myPlayer,
          winner: null,
          isDraw: true,
          status: "finished",
        },
        {
          merge: true,
        }
      );

      return;
    }

    // -----------------------------
    // NORMAL MOVE
    // -----------------------------

    const nextPlayer: Player =
      myPlayer === "X"
        ? "O"
        : "X";

    await setDoc(
      roomRef,
      {
        board: newBoard,
        currentPlayer:
          nextPlayer,
      },
      {
        merge: true,
      }
    );
  };

  // -----------------------------
  // LOADING SCREEN
  // -----------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 px-4 py-10 text-white">

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

          <div className="rounded-2xl border border-white/20 bg-white/10 px-8 py-6 text-center backdrop-blur-xl">

            <div className="text-4xl">
              🎮
            </div>

            <h1 className="mt-3 text-xl font-black">
              Loading game...
            </h1>

            <p className="mt-1 text-sm text-indigo-200">
              Connecting to Firebase
            </p>

          </div>

        </div>

      </main>
    );
  }

  // -----------------------------
  // ERROR SCREEN
  // -----------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 px-4 py-10 text-white">

        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">

          <div className="w-full max-w-md rounded-[2rem] border border-red-300/20 bg-red-400/10 p-8 text-center backdrop-blur-xl">

            <div className="text-5xl">
              ❌
            </div>

            <h1 className="mt-4 text-2xl font-black">
              Game Error
            </h1>

            <p className="mt-2 text-sm text-red-100/80">
              {error}
            </p>

          </div>

        </div>

      </main>
    );
  }

  // -----------------------------
  // GAME UI
  // -----------------------------

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 px-4 py-10 text-white">

      {/* Decorative circles */}

      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 right-10 h-52 w-52 rounded-full bg-pink-400/20 blur-3xl" />

      {/* Main */}

      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center">

        <div className="w-full max-w-md">

          {/* Header */}

          <div className="mb-6 text-center">

            <div className="mb-3 text-4xl">
              🎮
            </div>

            <h1 className="text-4xl font-black">
              Tic Tac Toe
            </h1>

            <p className="mt-2 text-indigo-200">
              Online Friend Game
            </p>

          </div>

          {/* Room ID */}

          <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">

            <p className="text-xs uppercase tracking-wider text-indigo-200">
              Room ID
            </p>

            <p className="mt-1 break-all text-xl font-black tracking-widest text-cyan-300">
              {roomId}
            </p>

          </div>

          {/* Share Game */}

          <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">

            <ShareGame
              roomId={roomId}
            />

          </div>

          {/* Player Information */}

          <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">

            {myPlayer ? (
              <>
                <p className="text-sm text-indigo-200">
                  You are
                </p>

                <p
                  className={`mt-1 text-3xl font-black ${
                    myPlayer === "X"
                      ? "text-cyan-300"
                      : "text-pink-300"
                  }`}
                >
                  Player {myPlayer}
                </p>
              </>
            ) : (
              <p className="text-yellow-200">
                Assigning player...
              </p>
            )}

          </div>

          {/* Waiting */}

          {gameStatus ===
            "waiting" && (
            <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">

              <p className="font-semibold text-yellow-200">
                Waiting for your friend...
              </p>

              <p className="mt-1 text-xs text-yellow-100/70">
                Share the game link with your friend.
              </p>

            </div>
          )}

          {/* Turn */}

          {gameStatus ===
            "playing" &&
            !winner &&
            !isDraw && (
            <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur-xl">

              <p className="text-sm text-indigo-200">
                Current Turn
              </p>

              <p
                className={`mt-1 text-3xl font-black ${
                  currentPlayer === "X"
                    ? "text-cyan-300"
                    : "text-pink-300"
                }`}
              >
                Player {currentPlayer}
              </p>

              <p className="mt-1 text-xs text-indigo-200/70">
                {currentPlayer === myPlayer
                  ? "Your turn"
                  : "Opponent's turn"}
              </p>

            </div>
          )}

          {/* Winner */}

          {winner && (
            <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">

              <p className="text-2xl font-black text-yellow-200">
                🏆 Player {winner} Wins!
              </p>

            </div>
          )}

          {/* Draw */}

          {isDraw && (
            <div className="mb-5 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4 text-center">

              <p className="text-2xl font-black text-yellow-200">
                🤝 It&apos;s a Draw!
              </p>

            </div>
          )}

          {/* Game Board */}

          <div className="rounded-[2rem] border border-white/20 bg-indigo-950/60 p-6 shadow-2xl backdrop-blur-xl">

            <GameBoard
              board={board}
              winningCells={
                winningCells
              }
              disabled={
                !myPlayer ||
                gameStatus !==
                  "playing" ||
                currentPlayer !==
                  myPlayer ||
                winner !== null ||
                isDraw
              }
              onCellClick={
                handleCellClick
              }
            />

          </div>

        </div>

      </div>

    </main>
  );
}

