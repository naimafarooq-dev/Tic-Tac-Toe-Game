import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CellValue,
  GameRoom,
} from "@/types/game";

/* =========================================================
   CONSTANTS
========================================================= */

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

/* =========================================================
   GET ROOM REFERENCE
========================================================= */

export function getRoomRef(
  roomId: string
) {
  return doc(
    db,
    "gameRooms",
    roomId
  );
}

/* =========================================================
   GENERATE ROOM ID
========================================================= */

function generateRoomId(): string {
  return Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();
}

/* =========================================================
   CREATE GAME ROOM
========================================================= */

/**
 * Creates a new online game room.
 *
 * A unique room ID is generated automatically.
 * The player who creates the room becomes Player X.
 */
export async function createGameRoom(
  playerId: string
): Promise<string> {
  let roomId = "";
  let roomExists = true;

  /*
   * Generate a room ID until
   * an unused ID is found.
   */
  while (roomExists) {
    roomId =
      generateRoomId();

    const roomRef =
      getRoomRef(roomId);

    const snapshot =
      await getDoc(roomRef);

    roomExists =
      snapshot.exists();
  }

  /* -------------------------------------------------------
     CREATE ROOM DATA
  ------------------------------------------------------- */

  const room: GameRoom = {
    board: [
      ...EMPTY_BOARD,
    ],

    currentPlayer:
      "X",

    playerX:
      playerId,

    playerO:
      null,

    winner:
      null,

    isDraw:
      false,

    status:
      "waiting",
  };

  /* -------------------------------------------------------
     SAVE ROOM TO FIREBASE
  ------------------------------------------------------- */

  await setDoc(
    getRoomRef(roomId),
    room
  );

  return roomId;
}

/* =========================================================
   CREATE ROOM WITH SPECIFIC ID
========================================================= */

/**
 * Creates a room using a provided room ID.
 *
 * This function is kept separately from createGameRoom()
 * because some parts of the application may need to create
 * or initialize a room using a known ID.
 */
export async function createRoom(
  roomId: string,
  playerId: string
): Promise<void> {
  const roomRef =
    getRoomRef(roomId);

  const snapshot =
    await getDoc(roomRef);

  /* -------------------------------------------------------
     ROOM ALREADY EXISTS
  ------------------------------------------------------- */

  if (snapshot.exists()) {
    return;
  }

  /* -------------------------------------------------------
     CREATE ROOM DATA
  ------------------------------------------------------- */

  const room: GameRoom = {
    board: [
      ...EMPTY_BOARD,
    ],

    currentPlayer:
      "X",

    playerX:
      playerId,

    playerO:
      null,

    winner:
      null,

    isDraw:
      false,

    status:
      "waiting",
  };

  /* -------------------------------------------------------
     SAVE ROOM
  ------------------------------------------------------- */

  await setDoc(
    roomRef,
    room
  );
}

/* =========================================================
   UPDATE ROOM
========================================================= */

/**
 * Updates one or more fields of an existing game room.
 *
 * merge: true ensures that fields not included in `data`
 * remain unchanged in Firestore.
 */
export async function updateRoom(
  roomId: string,
  data: Partial<GameRoom>
): Promise<void> {
  await setDoc(
    getRoomRef(roomId),
    data,
    {
      merge: true,
    }
  );
}