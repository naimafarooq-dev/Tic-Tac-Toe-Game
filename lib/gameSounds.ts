// lib/gameSounds.ts

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  return audioContext;
};

// Make sure browser allows audio
const resumeAudio = async () => {
  const ctx = getAudioContext();

  if (ctx.state === "suspended") {
    await ctx.resume();
  }

  return ctx;
};

// --------------------------------------------------
// Basic tone
// --------------------------------------------------

const playTone = (
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.08,
  delay = 0
) => {
  void resumeAudio().then((ctx) => {
    const oscillator =
      ctx.createOscillator();

    const gain =
      ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
      frequency,
      ctx.currentTime + delay
    );

    gain.gain.setValueAtTime(
      0,
      ctx.currentTime + delay
    );

    gain.gain.linearRampToValueAtTime(
      volume,
      ctx.currentTime + delay + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime +
        delay +
        duration
    );

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(
      ctx.currentTime + delay
    );

    oscillator.stop(
      ctx.currentTime +
        delay +
        duration +
        0.02
    );
  });
};

// --------------------------------------------------
// Player move
// Funky "pop"
// --------------------------------------------------

export const playMoveSound = () => {
  playTone(
    520,
    0.09,
    "square",
    0.07
  );

  playTone(
    760,
    0.08,
    "triangle",
    0.05,
    0.05
  );
};

// --------------------------------------------------
// AI move
// Slightly deeper "boop"
// --------------------------------------------------

export const playAIMoveSound = () => {
  playTone(
    320,
    0.12,
    "sine",
    0.07
  );

  playTone(
    480,
    0.12,
    "triangle",
    0.05,
    0.07
  );
};

// --------------------------------------------------
// Button click
// --------------------------------------------------

export const playClickSound = () => {
  playTone(
    700,
    0.05,
    "square",
    0.045
  );
};

// --------------------------------------------------
// Winning sound
// Funky ascending celebration
// --------------------------------------------------

export const playWinSound = () => {
  playTone(
    523,
    0.12,
    "triangle",
    0.08
  );

  playTone(
    659,
    0.12,
    "triangle",
    0.08,
    0.10
  );

  playTone(
    784,
    0.12,
    "triangle",
    0.08,
    0.20
  );

  playTone(
    1047,
    0.22,
    "sine",
    0.10,
    0.30
  );
};

// --------------------------------------------------
// Draw sound
// Funny descending sound
// --------------------------------------------------

export const playDrawSound = () => {
  playTone(
    500,
    0.12,
    "triangle",
    0.06
  );

  playTone(
    400,
    0.12,
    "triangle",
    0.06,
    0.10
  );

  playTone(
    300,
    0.18,
    "triangle",
    0.06,
    0.20
  );
};

// --------------------------------------------------
// Restart sound
// Little arcade sweep
// --------------------------------------------------

export const playRestartSound = () => {
  playTone(
    300,
    0.08,
    "square",
    0.05
  );

  playTone(
    450,
    0.08,
    "square",
    0.05,
    0.07
  );

  playTone(
    650,
    0.12,
    "square",
    0.05,
    0.14
  );
};

// --------------------------------------------------
// Online room created
// Notification/chime
// --------------------------------------------------

export const playRoomCreatedSound = () => {
  playTone(
    660,
    0.10,
    "sine",
    0.07
  );

  playTone(
    880,
    0.12,
    "sine",
    0.07,
    0.10
  );

  playTone(
    1100,
    0.18,
    "sine",
    0.08,
    0.20
  );
};

