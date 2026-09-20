"use client";

import { usePlayerId } from "@/hooks/usePlayerId";
import { useGameRoom } from "@/hooks/useGameRoom";
import { useOnlineMove } from "@/hooks/useOnlineMove";

import GameBoard from "@/components/GameBoard";
import ShareGame from "@/components/ShareGame";

import OnlineHeader from "./OnlineHeader";
import OnlineRoomInfo from "./OnlineRoomInfo";
import OnlinePlayerInfo from "./OnlinePlayerInfo";
import OnlineGameStatus from "./OnlineGameStatus";
import OnlineLoading from "./OnlineLoading";
import OnlineError from "./OnlineError";

type OnlineGameProps = {
  roomId: string;
};

export default function OnlineGame({
  roomId,
}: OnlineGameProps) {
  const playerId = usePlayerId();

  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    myPlayer,
    winningCells,
    gameStatus,
    loading,
    error,
  } = useGameRoom(
    roomId,
    playerId
  );

  const {
    handleCellClick,
  } = useOnlineMove(
    roomId,
    board,
    currentPlayer,
    myPlayer,
    winner,
    isDraw
  );

  if (loading) {
    return <OnlineLoading />;
  }

  if (error) {
    return (
      <OnlineError
        message={error}
      />
    );
  }

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-hidden">

      <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 right-10 h-52 w-52 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-8">

        <div className="w-full max-w-md">

          <OnlineHeader />

          <OnlineRoomInfo
          roomId={roomId}
           player={myPlayer}
         />

          <div className="mb-5 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
            <ShareGame
              roomId={roomId}
            />
          </div>

          <OnlinePlayerInfo
            myPlayer={myPlayer}
          />

          <OnlineGameStatus
            status={gameStatus}
            currentPlayer={
              currentPlayer
            }
            myPlayer={myPlayer}
            winner={winner}
            isDraw={isDraw}
          />

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