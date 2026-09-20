"use client";

import { useEffect, useState } from "react";

import {
  onSnapshot,
} from "firebase/firestore";

import type {
  CellValue,
  Player,
} from "@/types/game";

import {
  checkWinner,
} from "@/lib/gameLogic";

import {
  createRoom,
  getRoomRef,
  updateRoom,
} from "@/lib/gameRoom";

const EMPTY_BOARD: CellValue[] = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

type GameStatus =
  | "waiting"
  | "playing"
  | "finished";

export function useGameRoom(
  roomId: string,
  playerId: string
) {
  const [board, setBoard] =
    useState<CellValue[]>(
      [...EMPTY_BOARD]
    );

  const [currentPlayer, setCurrentPlayer] =
    useState<Player>("X");

  const [winner, setWinner] =
    useState<Player | null>(null);

  const [isDraw, setIsDraw] =
    useState(false);

  const [myPlayer, setMyPlayer] =
    useState<Player | null>(null);

  const [winningCells, setWinningCells] =
    useState<number[]>([]);

  const [gameStatus, setGameStatus] =
    useState<GameStatus>("waiting");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Create room if it doesn't exist
  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }

    const initializeRoom =
      async () => {
        try {
          await createRoom(
            roomId,
            playerId
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

    void initializeRoom();
  }, [roomId, playerId]);

  // Listen to Firebase room
  useEffect(() => {
    if (!roomId || !playerId) {
      return;
    }

    const roomRef =
      getRoomRef(roomId);

    const unsubscribe =
      onSnapshot(
        roomRef,
        async (snapshot) => {
          try {
            if (!snapshot.exists()) {
              setError(
                "Game room not found."
              );

              setLoading(false);
              return;
            }

            const data =
              snapshot.data();

            const roomBoard =
              (data.board ??
                [...EMPTY_BOARD]) as CellValue[];

            const roomCurrentPlayer =
              (data.currentPlayer ??
                "X") as Player;

            const roomWinner =
              (data.winner ??
                null) as Player | null;

            const roomDraw =
              data.isDraw ?? false;

            setBoard(roomBoard);
            setCurrentPlayer(
              roomCurrentPlayer
            );
            setWinner(roomWinner);
            setIsDraw(roomDraw);

            // Winning cells
            if (roomWinner) {
              const result =
                checkWinner(
                  roomBoard
                );

              setWinningCells(
                result?.cells ?? []
              );
            } else {
              setWinningCells([]);
            }

            // Determine player
            if (
              data.playerX ===
              playerId
            ) {
              setMyPlayer("X");
            } else if (
              data.playerO ===
              playerId
            ) {
              setMyPlayer("O");
            } else if (
              !data.playerX
            ) {
              await updateRoom(
                roomId,
                {
                  playerX:
                    playerId,
                }
              );

              setMyPlayer("X");
            } else if (
              !data.playerO
            ) {
              await updateRoom(
                roomId,
                {
                  playerO:
                    playerId,
                  status:
                    "playing",
                }
              );

              setMyPlayer("O");
            }

            // Room status
            if (
              roomWinner ||
              roomDraw
            ) {
              setGameStatus(
                "finished"
              );
            } else if (
              data.playerX &&
              data.playerO
            ) {
              setGameStatus(
                "playing"
              );
            } else {
              setGameStatus(
                "waiting"
              );
            }

            setLoading(false);
          } catch (error) {
            console.error(
              "Room processing error:",
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
            "Firebase error:",
            error
          );

          setError(
            "Unable to connect to Firebase."
          );

          setLoading(false);
        }
      );

    return unsubscribe;
  }, [roomId, playerId]);

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    myPlayer,
    winningCells,
    gameStatus,
    loading,
    error,
  };
}