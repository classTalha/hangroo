const ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["Z","X","C","V","B","N","M"]
];

export default function Keyboard({ guessed, onGuess }) {
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center w-full flex-wrap">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onGuess(key)}
              disabled={guessed.includes(key)}
              className="
                bg-green-700 hover:bg-green-600 disabled:bg-gray-600
                py-2 px-3 sm:py-3 sm:px-4 md:py-4 md:px-5
                rounded font-bold text-base sm:text-lg md:text-xl
                uppercase transition-all duration-150
                flex-1 min-w-[2rem] sm:min-w-[3rem] md:min-w-[3.5rem]
              "
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
