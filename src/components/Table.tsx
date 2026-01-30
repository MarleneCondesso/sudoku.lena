import { FC } from "react";

interface TableProps {
    sudokuInitial: number[][];
    sudokuAnswer: number[][];
    handler: (e: any, row: number, col: number, num: number) => void;
    disable: boolean;
    penActive: boolean;
    penGuesses: number[][][];
    selectedCell: { row: number; col: number; num: number | null } | null;
    cellErrors: boolean[][]; // <-- adicionar esta linha
}

/**
 * Table component renders the 9x9 Sudoku grid.
 * Handles cell inputs, displays pen guesses, highlights errors and selected cells.
 * Supports both normal input mode and pen mode for noting possible numbers.
 */
const Table: FC<TableProps> = ({
    sudokuInitial,
    sudokuAnswer,
    handler,
    disable,
    penActive,
    penGuesses,
    selectedCell,
    cellErrors
}) => {

    return (
        <table className="border-collapse border-[#f0c98b] dark:border-teal-700 border-4">
            <tbody id="tbody">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                    <tr
                        key={row}
                        className={`flex-row flex ${((row + 1) % 3 === 0 && row + 1 !== 9) ? "mb-1" : ""}`}
                    >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                            <td
                                key={col}
                                className={`flex flex-col items-center justify-center content-center self-center text-center place-items-center ${((col + 1) % 3 === 0 && col + 1 !== 9) ? "mr-1" : ""}`}
                            >
                                {!penActive || (sudokuAnswer[row][col] !== -1 && sudokuAnswer[row][col] !== 0) ? (
                                    <input
                                        id={`input-${row}-${col}`}
                                        type="text"
                                        className={`
                                            h-[30px] w-[30px] text-md text-center flex items-center justify-center cursor-pointer shadow-xl
                                            bg-slate-400 text-black dark:bg-teal-700 dark:bg-opacity-20 dark:text-[#ffffff] outline-none caret-transparent focus:outline-none
                                            ${cellErrors[row][col] ? 'border-2 border-red-500' : ''}
                                            ${selectedCell?.row === row && selectedCell?.col === col ? 'ring-2 ring-blue-500' : ''}
                                            ${sudokuInitial[row][col] !== 0 ? 'opacity-60 cursor-not-allowed' : ''}
                                        `}
                                        value={sudokuAnswer[row][col] === 0 || sudokuAnswer[row][col] === -1 ? "" : sudokuAnswer[row][col]}
                                        onChange={(e) => {
                                            if (sudokuInitial[row][col] === 0) handler(e, row, col, Number(e.target.value));
                                        }}
                                        onClick={(e) => {
                                            if (sudokuInitial[row][col] === 0) handler(e, row, col, sudokuAnswer[row][col]);
                                        }}
                                        inputMode="numeric"
                                        readOnly={sudokuInitial[row][col] !== 0}
                                    />
                                ) : (
                                    <button
                                        onClick={(e) => handler(e, row, col, 0)}
                                        className={`w-[30px] h-[30px] bg-slate-400 dark:bg-teal-700 dark:bg-opacity-20 ${selectedCell?.row === row && selectedCell?.col === col ? 'ring-2 ring-blue-500' : ''}`}
                                    >
                                        <div className="grid grid-cols-3 grid-rows-3 gap-0">
                                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                                                const num = i + 1;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="w-[10px] h-[10px] flex items-center justify-center text-xs font-bold  bg-stone-300 dark:bg-stone-gray-50 text-black"
                                                    >
                                                        {penGuesses[row][col]?.includes(num) ? num.toString() : ""}
                                                    </div>
                                                );
                                            })}
                                        </div>
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
