"use client";

import { useEffect, useState } from "react";

export function usePlayerId() {
  const [playerId, setPlayerId] = useState("");

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

  return playerId;
}