"use client";

import type {
  CellValue,
  Player,
} from "@/types/game";

import {
  checkWinner,
  isBoardFull,
} from "@/lib/gameLogic";

import {
  updateRoom,
} from "@/lib/gameRoom";

export function useOnlineMove(
  roomId: string,
  board: CellValue[],
  currentPlayer: Player,
  myPlayer: Player | null,
  winner: Player | null,
  isDraw: boolean
) {
  const handleCellClick =
    async (index: number) => {

      if (!myPlayer) return;
      if (winner || isDraw) return;

      if (
        currentPlayer !==
        myPlayer
      ) {
        return;
      }

      if (board[index] !== "") {
        return;
      }

      const newBoard = [
        ...board,
      ];

      newBoard[index] =
        myPlayer;

      const gameWinner =
        checkWinner(
          newBoard
        );

      const draw =
        !gameWinner &&
        isBoardFull(
          newBoard
        );

      // Winner
      if (gameWinner) {
        await updateRoom(
          roomId,
          {
            board: newBoard,
            currentPlayer:
              myPlayer,
            winner:
              gameWinner.player,
            isDraw: false,
            status:
              "finished",
          }
        );

        return;
      }

      // Draw
      if (draw) {
        await updateRoom(
          roomId,
          {
            board: newBoard,
            currentPlayer:
              myPlayer,
            winner: null,
            isDraw: true,
            status:
              "finished",
          }
        );

        return;
      }

      // Normal move
      const nextPlayer: Player =
        myPlayer === "X"
          ? "O"
          : "X";

      await updateRoom(
        roomId,
        {
          board: newBoard,
          currentPlayer:
            nextPlayer,
        }
      );
    };

  return {
    handleCellClick,
  };
}