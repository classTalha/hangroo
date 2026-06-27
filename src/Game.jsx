import { useState, useEffect, useRef } from "react";
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

  // Sounds
  const correctSound = useRef(
    new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3")
  );
  const wrongSound = useRef(
    new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3")
  );
  const gameOverSound = useRef(
    new Audio("https://www.soundjay.com/misc/sounds/fail-buzzer-01.mp3")
  );

  const playSound = (audioRef) => {
    if (isMuted || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  const pickRandomQuestion = () => {
    const random = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQ(random);
    setGuessed([]);
    setRoundOver(false);
    setIsWin(false);
  };

  // On first load
  useEffect(() => {
    pickRandomQuestion();
  }, []);

  // On restart
  useEffect(() => {
    pickRandomQuestion();
  }, [restartSignal]);

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || roundOver) return;

    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);

    if (!currentQ.answer.includes(letter)) {
      onLoseLife();
      playSound(wrongSound);

      if (totalLives - 1 <= 0) {
        setRoundOver(true);
        setIsWin(false);
        playSound(gameOverSound);
        return;
      }
    } else {
      playSound(correctSound);
    }

    // Check win
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

  // Auto next round
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

      {/* Keyboard */}
      {!roundOver && currentQ.answer && (
        <div className="w-full mb-4">
          <Keyboard guessed={guessed} onGuess={handleGuess} />
        </div>
      )}

      {/* Divider */}
      <hr className="border-t-2 border-white/30 w-1/2 mx-auto my-4" />

      {/* Question */}
      {currentQ.question && (
        <p className="mb-4 mt-2 px-4 py-2 text-md font-bold text-white
                       backdrop-blur-md border border-white/20 uppercase rounded-lg">
          {currentQ.question}
        </p>
      )}

      {/* Word blocks */}
      <Word answer={currentQ.answer} guessed={guessed} />

      {/* Round result */}
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
