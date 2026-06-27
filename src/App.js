import { useState, useRef } from "react";
import Game from "./Game";

function App() {
  const MAX_LIVES = 4;

  const [totalLives, setTotalLives] = useState(MAX_LIVES);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [restartSignal, setRestartSignal] = useState(0);

  // 🔊 Mute state
  const [isMuted, setIsMuted] = useState(false);

  // Heart animation state
  const [heartAnimation, setHeartAnimation] = useState(null);

  // Restart sound
  const restartSound = useRef(
    new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3")
  );

  // ❌ Wrong guess → lose life
  const handleLoseLife = () => {
    if (totalLives > 0) {
      setHeartAnimation("lose");
      setTotalLives((prev) => prev - 1);
      setTimeout(() => setHeartAnimation(null), 400);
    }
  };

  // ✅ Win round → add life
  const handleRoundComplete = () => {
    setRoundsCompleted((prev) => prev + 1);

    setTotalLives((prevLives) => {
      if (prevLives < MAX_LIVES) {
        setHeartAnimation("gain");
        setTimeout(() => setHeartAnimation(null), 400);
        return prevLives + 1;
      }
      return prevLives;
    });
  };

  // 🔄 Restart game
  const handleRestart = () => {
    if (!isMuted) {
      restartSound.current.currentTime = 0;
      restartSound.current.play().catch(() => {});
    }

    setTotalLives(MAX_LIVES);
    setRoundsCompleted(0);
    setRestartSignal((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex flex-col items-center text-white p-4">
      <h1 className="text-4xl font-extrabold mt-4 mb-3">hangroo.pk 🇵🇰</h1>

      {/* ❤️ HEARTS UI */}
      <div className="flex gap-3 mb-6">
        {Array.from({ length: MAX_LIVES }).map((_, i) => {
          const isActive = i < totalLives;
          const danger = totalLives === 1 && isActive;

          return (
            <div
              key={i}
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                backdrop-blur-md border border-white/20
                transition-all duration-300
                ${
                  isActive
                    ? "bg-white/10 shadow-[0_0_12px_rgba(255,80,80,0.6)]"
                    : "bg-white/5 opacity-40"
                }
                ${danger ? "animate-pulse" : ""}
                ${
                  heartAnimation === "gain" && i === totalLives - 1
                    ? "animate-heart-pop"
                    : ""
                }
                ${
                  heartAnimation === "lose" && i === totalLives
                    ? "animate-heart-shake"
                    : ""
                }
              `}
            >
              <span
                className={`text-2xl ${
                  isActive
                    ? "drop-shadow-[0_0_6px_rgba(255,80,80,0.9)]"
                    : "grayscale"
                }`}
              >
                ❤️
              </span>
            </div>
          );
        })}
      </div>

      {/* 🔘 Controls Row */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={handleRestart}
          className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded-lg font-bold transition-transform hover:scale-105"
        >
          Restart
        </button>

        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-2xl transition-transform hover:scale-105"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>

        <div className="px-4 py-2 bg-white/10 rounded-lg font-bold backdrop-blur-md border border-white/20">
          Rounds: <span className="text-green-300">{roundsCompleted}</span>
        </div>
      </div>

      <Game
        totalLives={totalLives}
        onLoseLife={handleLoseLife}
        onRoundComplete={handleRoundComplete}
        restartSignal={restartSignal}
        isMuted={isMuted}
      />
    </div>
  );
}

export default App;
