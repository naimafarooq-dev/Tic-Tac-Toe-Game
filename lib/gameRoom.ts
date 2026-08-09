import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CellValue,
  GameRoom,
} from "@/types/game";

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

/**
 * Firebase mein new game room create karta hai.
 */
export const createGameRoom = async (
  playerX: string
): Promise<string> => {
  const gameRoom: GameRoom = {
    board: [...EMPTY_BOARD],

    currentPlayer: "X",

    playerX,

    playerO: null,

    winner: null,

    isDraw: false,

    status: "waiting",

    createdAt: serverTimestamp(),
  };

  const roomRef = await addDoc(
    collection(db, "gameRooms"),
    gameRoom
  );

  return roomRef.id;
};

/**
 * Existing game room Firebase se retrieve karta hai.
 */
export const getGameRoom = async (
  roomId: string
): Promise<GameRoom | null> => {
  const roomRef = doc(
    db,
    "gameRooms",
    roomId
  );

  const roomSnapshot =
    await getDoc(roomRef);

  if (!roomSnapshot.exists()) {
    return null;
  }

  return roomSnapshot.data() as GameRoom;
};

/**
 * Friend ko existing game room mein
 * Player O ke taur par join karwata hai.
 */
export const joinGameRoom = async (
  roomId: string,
  playerO: string
): Promise<boolean> => {
  const roomRef = doc(
    db,
    "gameRooms",
    roomId
  );

  const roomSnapshot =
    await getDoc(roomRef);

  if (!roomSnapshot.exists()) {
    return false;
  }

  const room =
    roomSnapshot.data() as GameRoom;

  // Room already full hai
  if (room.playerO !== null) {
    return false;
  }

  // Room finished hai
  if (room.status === "finished") {
    return false;
  }

  // Player O assign karo
  await updateDoc(roomRef, {
    playerO,
    status: "playing",
  });

  return true;
};

