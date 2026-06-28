import { useState, useEffect } from "react";
import questions from "./questions.json";
import Word from "./Word";
import Keyboard from "./Keyboard";

export default function Game({
  totalLives,
  onLoseLife,
  onRoundComplete,
  restartSignal,
  isMuted
}) {
  const [currentQ, setCurrentQ] = useState({});
  const [guessed, setGuessed] = useState([]);
  const [roundOver, setRoundOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // 🎧 AUDIO ENGINE (Web Audio API)
  const audioCtxRef = { current: null };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playTone = (type) => {
    if (isMuted) return;

    const ctx = initAudio();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.05;

    if (type === "correct") {
      oscillator.frequency.setValueAtTime(900, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        200,
        ctx.currentTime + 0.12
      );

      oscillator.type = "triangle";

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + 0.12
      );
    }

    if (type === "wrong") {
      oscillator.frequency.value = 200;
      oscillator.type = "sine";
    }

    if (type === "gameover") {
      oscillator.frequency.value = 120;
      oscillator.type = "triangle";
    }

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
  };

  const playSound = (type) => {
    try {
      playTone(type);
    } catch (err) {
      console.log("Audio error:", err);
    }
  };

  const pickRandomQuestion = () => {
    const random = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(random);
    setGuessed([]);
    setRoundOver(false);
    setIsWin(false);
  };

  useEffect(() => {
    pickRandomQuestion();
  }, []);

  useEffect(() => {
    pickRandomQuestion();
  }, [restartSignal]);

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || roundOver) return;

    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);

    if (!currentQ.answer.includes(letter)) {
      onLoseLife();
      playSound("wrong");

      if (totalLives - 1 <= 0) {
        setRoundOver(true);
        setIsWin(false);
        playSound("gameover");
        return;
      }
    } else {
      playSound("correct");
    }

    const allGuessed = currentQ.answer
      .split("")
      .filter((l) => l !== " ")
      .every((l) => newGuessed.includes(l));

    if (allGuessed) {
      setRoundOver(true);
      setIsWin(true);
      onRoundComplete();
    }
  };

  useEffect(() => {
    if (roundOver && isWin) {
      const timer = setTimeout(() => {
        pickRandomQuestion();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [roundOver, isWin]);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-3xl text-center shadow-lg flex flex-col items-center">

      {!roundOver && currentQ.answer && (
        <div className="w-full mb-4">
          <Keyboard guessed={guessed} onGuess={handleGuess} />
        </div>
      )}

      <hr className="border-t-2 border-white/30 w-1/2 mx-auto my-4" />

      {/* ✅ FIXED HINT DESIGN (iOS SAFE) */}
      {currentQ.question && (
        <p className="mb-4 mt-2 px-4 py-2 text-md font-bold text-white
                       bg-black/40 backdrop-blur-md border border-white/30
                       uppercase rounded-lg shadow-md">
          {currentQ.question}
        </p>
      )}

      <Word answer={currentQ.answer} guessed={guessed} />

      {roundOver && isWin && (
        <p className="text-green-400 mt-4 font-bold">
          🎉 Correct! Next round starting...
        </p>
      )}

      {roundOver && !isWin && (
        <p className="text-red-400 mt-4 font-bold">
          💀 Game Over! Answer: {currentQ.answer}
        </p>
      )}
    </div>
  );
}