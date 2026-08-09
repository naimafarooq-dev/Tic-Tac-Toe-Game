"use client";

import { useState } from "react";

interface ShareGameProps {
  roomId: string;
}

export default function ShareGame({
  roomId,
}: ShareGameProps) {
  const [copied, setCopied] = useState(false);

  const getGameLink = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/game/${roomId}`;
  };

  const copyLink = async () => {
    const gameLink = getGameLink();

    if (!gameLink) {
      return;
    }

    try {
      // Modern Clipboard API
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(gameLink);
      } else {
        // Fallback for browsers where Clipboard API
        // is unavailable
        const textArea =
          document.createElement("textarea");

        textArea.value = gameLink;

        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful =
          document.execCommand("copy");

        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy game link:",
        error
      );

      alert(
        "Unable to copy the link automatically. Please copy the game link manually."
      );
    }
  };

  const shareGame = async () => {
    const gameLink = getGameLink();

    if (!gameLink) {
      return;
    }

    try {
      // Native Web Share API
      if (
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        await navigator.share({
          title: "Tic Tac Toe",
          text: "Join my Tic Tac Toe game!",
          url: gameLink,
        });

        return;
      }

      // Web Share API unavailable
      // Copy the link instead
      await copyLink();
    } catch (error) {
      // User cancelled the share dialog
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Share failed:",
        error
      );

      // Try copying as fallback
      await copyLink();
    }
  };

  const gameLink = getGameLink();

  return (
    <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">

      {/* Heading */}
      <div className="mb-4 text-center">

        <div className="mb-2 text-3xl">
          🎮
        </div>

        <h2 className="text-lg font-bold text-white">
          Invite Your Friend
        </h2>

        <p className="mt-1 text-xs text-indigo-200">
          Share this link with your friend to play online.
        </p>

      </div>

      {/* Game Link */}
      <div className="rounded-xl border border-white/10 bg-black/20 p-3">

        <p className="break-all text-center text-xs text-cyan-200">
          {gameLink || "Generating link..."}
        </p>

      </div>

      {/* Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-3">

        {/* Copy */}
        <button
          type="button"
          onClick={copyLink}
          disabled={!gameLink}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied
            ? "✓ Copied!"
            : "📋 Copy Link"}
        </button>

        {/* Share */}
        <button
          type="button"
          onClick={shareGame}
          disabled={!gameLink}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          🔗 Share
        </button>

      </div>

      {/* Copied message */}
      {copied && (
        <p className="mt-3 text-center text-xs font-semibold text-green-300">
          ✓ Game link copied successfully!
        </p>
      )}

    </div>
  );
}

