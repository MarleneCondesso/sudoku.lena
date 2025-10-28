import { FC, useEffect } from "react";

interface TableProps {
    sudokuInitial: number[][];
    sudokuAnswer: number[][];
    handler: (e: any, row: number, col: number, num: number) => void;
    disable: boolean;
    penActive: boolean;
    penGuesses: number[][][];
}

const Table: FC<TableProps> = ({ sudokuInitial, sudokuAnswer, handler, disable, penActive, penGuesses }) => {

    useEffect(() => {
       console.log(penGuesses)
       penGuesses[1][0]?.map(guess => (
        [0,1,2]?.map((rowGuess) => (
            [0,1,2]?.map(colGuess => (
                guess === rowGuess * 3 + colGuess + 1 ? console.log(guess.toString()) : console.log("nao tem")
            ))
            ))
        ))
      
    },[penGuesses])

    return (
        <table className="border-collapse border-[#f0c98b] dark:border-teal-700 border-4">
            <tbody id="tbody">
                {[ 0, 1, 2, 3, 4, 5, 6, 7, 8 ].map((row) => (
                    <tr
                        key={row}
                        className={`flex-row flex ${((row + 1) % 3 === 0 && row + 1 !== 9) ? "mb-1" : ""}`}
                    >
                        {[ 0, 1, 2, 3, 4, 5, 6, 7, 8 ].map((col) => (
                            <td
                                key={col}
                                className={`flex flex-col items-center ${((col + 1) % 3 === 0 && col + 1 !== 9) ? "mr-1" : ""}`}
                            >
                                {!penActive || (sudokuAnswer[ row ][ col ] !== -1 && sudokuAnswer[ row ][ col ] !== 0) ? (
                                    <input
                                        id={`input-${row}-${col}`}
                                        type="number"
                                        className={`h-[30px] w-[30px] text-md flex text-center cursor-pointer shadow-xl bg-slate-400 text-black dark:bg-teal-700 dark:bg-opacity-20 dark:text-[#ffffff] outline-none disabled:border-0 disabled:opacity-100 disable:font-semibold disabled:bg-[var(--background-components)] disabled:text-black dark:disabled:bg-teal-800 dark:disabled:text-[#ffffff] dark:disable:opacity-100`}
                                        value={
                                            sudokuAnswer[ row ][ col ] === 0 || sudokuAnswer[ row ][ col ] === -1 ? "" : sudokuAnswer[ row ][ col ]
                                        }
                                        onChange={(e) => handler(e, row, col, Number(e.target.value))}
                                        disabled={sudokuInitial[ row ][ col ] !== 0 || disable}
                                        onClick={(e) => handler(e, row, col, 0)}
                                        inputMode="numeric"
                                        readOnly
                                    />
                                ) : (
                                    <button onClick={(e) => handler(e, row, col, 0)}>
                                        <table className="bg-slate-400">
                                            <tbody>
                                                {penActive && [ 0, 1, 2 ].map((rowGuess) => (
                                                    <tr key={rowGuess+1}>
                                                        {[ 0, 1, 2 ].map((colGuess) => (
                                                            <td key={colGuess+1}>
                                                                <input
                                                                    id={`pen-input-${row}-${col}-${rowGuess}-${colGuess}`}
                                                                    type="number"
                                                                    className={`h-[8px] w-[8px] text-sm flex text-center cursor-pointer shadow-xl bg-slate-800 text-whhite dark:bg-teal-700 dark:bg-opacity-20 dark:text-black outline-none`}
                                                                    value={penGuesses[row][col]?.map(guess => (
                                                                        guess === rowGuess * 3 + colGuess + 1 ? guess.toString() : ""
                                                                    ))}

                                                                    inputMode="numeric"
                                                                    readOnly
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </button>

                                )}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;