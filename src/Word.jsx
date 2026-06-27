export default function Word({ answer, guessed }) {
  return (
    <div className="flex justify-center mt-6 px-2 sm:px-0">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
        {answer
          ?.split(" ")
          .map((word, wordIndex) => (
            <div key={wordIndex} className="flex gap-2 whitespace-nowrap">
              {word.split("").map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`w-8 h-8 sm:w-12 sm:h-12 border-2 border-white
                    flex items-center justify-center
                    text-white font-bold text-xl sm:text-2xl uppercase rounded
                    ${guessed.includes(letter) ? "bg-green-700 animate-reveal" : "bg-gray-800"}
                    drop-shadow
                  `}
                >
                  {guessed.includes(letter) ? letter : ""}
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
