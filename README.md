# Tic-Tac-Toe Game

A modern and responsive Tic-Tac-Toe web application built with **Next.js, TypeScript, Tailwind CSS, and Firebase**.

The game supports **AI gameplay, local multiplayer, and online multiplayer rooms** with real-time game synchronization.

## Features

* Play against AI
* Three AI difficulty levels:

  * Easy
  * Medium
  * Hard
* Local multiplayer for two players
* Online multiplayer using Firebase
* Create and share online game rooms
* Real-time game synchronization
* Player identification for online games
* Winning-cell highlighting
* Game score tracking
* Draw detection
* Game restart and reset options
* Sound effects for moves, wins, draws, and game events
* Responsive design for desktop and mobile devices
* Game state saved using browser local storage
* Video call component for online gameplay

## Tech Stack

### Frontend

* Next.js 15
* React 19
* TypeScript
* Tailwind CSS 4

### Backend & Services

* Firebase
* Firebase Firestore

### Development Tools

* Node.js
* npm
* Git
* GitHub
* Vercel

## Project Structure

```text
tic-tac-toe/
│
├── app/
│   ├── game/
│   │   └── [roomId]/
│   │       └── page.tsx
│   └── ...
│
├── components/
│   ├── Online/
│   │   ├── OnlineError.tsx
│   │   ├── OnlineGame.tsx
│   │   ├── OnlineGameStatus.tsx
│   │   ├── OnlineHeader.tsx
│   │   ├── OnlineLoading.tsx
│   │   ├── OnlinePlayerInfo.tsx
│   │   └── OnlineRoomInfo.tsx
│   │
│   ├── GameBoard.tsx
│   ├── GameMode.tsx
│   ├── DifficultySelector.tsx
│   ├── ScoreBoard.tsx
│   ├── ShareGame.tsx
│   ├── TicTacToe.tsx
│   └── VideoCall.tsx
│
├── hooks/
│   ├── useGameRoom.ts
│   ├── useOnlineMove.ts
│   └── usePlayerId.ts
│
├── lib/
│   ├── ai.ts
│   ├── gameLogic.ts
│   ├── gameRoom.ts
│   ├── gameSounds.ts
│   └── firebase.ts
│
├── types/
│   └── game.ts
│
├── public/
│
├── firebase.rules
├── package.json
└── tsconfig.json
```

## Game Modes

### AI Mode

Play against a computer-controlled opponent with selectable difficulty levels.

### Local Multiplayer

Two players can play on the same device by taking turns as **X** and **O**.

### Online Multiplayer

Create an online game room and share the room with another player.

The online mode uses **Firebase Firestore** to synchronize:

* Board state
* Current player
* Player assignments
* Winner
* Draw status
* Game status

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/naimafarooq-dev/Tic-Tac-Toe-Game.git
```

### 2. Navigate to the Project

```bash
cd Tic-Tac-Toe-Game
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Firebase

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with the Firebase configuration from your Firebase project.

**Do not commit `.env.local` to GitHub.**

### 5. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment

The application can be deployed using **Vercel**.

Before deployment, make sure the required Firebase environment variables are configured in the deployment platform.

## Firebase

The online multiplayer functionality uses Firebase Firestore for real-time room data.

Firestore security rules are included in the repository.

The application stores online game rooms in the:

```text
gameRooms
```

collection.

## Live Demo

Try the deployed application:

**[Tic-Tac-Toe Game](https://tic-tac-toe-navy-chi-86.vercel.app/)**


## License

This project currently does not include a specific open-source license.
