import { FC, useCallback, useState } from "react";
import { AiOutlineUndo } from "react-icons/ai";
import { TfiEraser } from "react-icons/tfi";
import { BsPencil } from "react-icons/bs";
import { CONSTANT_GAME } from "../libs/Modules";
import React from "react";

interface FooterGameProps {
    clearSudoku: () => void;
    clearTheBorderInput: (cell: any, type: any) => void;
    handler: (e: any, row: number, col: number, num: number) => void;
    isSelectedCell: boolean;
    setPenMode: (e: boolean) => void;
    guesses: (guesses: number[][][]) => void;
    penGuesses: number[][][];
    selectedCell: { row: number; col: number; num: number | null; cell: any } | null;
}

const FooterGame: FC<FooterGameProps> = React.memo(({
    clearSudoku,
    clearTheBorderInput,
    handler,
    isSelectedCell,
    setPenMode,
    guesses,
    penGuesses,
    selectedCell
}) => {

    const [penActive, setPenActive] = useState(false);

    /**
     * Toggles between normal input mode and pen mode.
     * Pen mode allows noting possible numbers in cells without committing to a final answer.
     * Uses useCallback to prevent unnecessary re-renders.
     */
    const changeMode = useCallback(() => {
        setPenActive(current => {
            setPenMode(!current);
            return !current;
        });
    }, [setPenMode]);

    /**
     * Clears all user inputs from the Sudoku grid, resetting to the initial puzzle state.
     * Also clears any visual border indicators on input elements.
     */
    function clear() {
        clearSudoku();
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            clearTheBorderInput(inputs[i], 2);
        }
    }

    /**
     * Inserts a number into the currently selected cell.
     * If the same number is already in the cell, it clears the cell instead (toggle behavior).
     * Only works if a cell is selected and it's a valid cell for input.
     * @param num - The number to insert (1-9) or -1 to clear.
     */
    function insertNumber(num: number) {
        if (!selectedCell || !isSelectedCell) return;

        let numberToInsert = num;
        if (num === selectedCell.num && selectedCell.num !== null) numberToInsert = -1;

        handler(selectedCell.cell, selectedCell.row, selectedCell.col, numberToInsert);
    }

    /**
     * Handles pen mode input by toggling a guess number in the penGuesses array.
     * If the guess is not present, adds it; if present, removes it.
     * Keeps guesses sorted for consistent display.
     * @param row - Row index of the cell.
     * @param col - Column index of the cell.
     * @param guess - The number to toggle as a guess (1-9).
     */
    function handlePenInput(row: number, col: number, guess: number) {
        const newGuesses = penGuesses.map((rowGuesses, r) =>
            r === row
                ? rowGuesses.map((cellGuesses, c) =>
                    c === col
                        ? (() => {
                            const updatedCellGuesses = [...cellGuesses];
                            const guessIndex = updatedCellGuesses.indexOf(guess);
                            if (guessIndex === -1) updatedCellGuesses.push(guess);
                            else updatedCellGuesses.splice(guessIndex, 1);
                            updatedCellGuesses.sort((a, b) => a - b);
                            return updatedCellGuesses;
                        })()
                        : cellGuesses
                )
                : rowGuesses
        );
        guesses(newGuesses);
    }

    return (
        <>
            <div className={`flex flex-row justify-between text-3xl font-semibold ${penActive ? 'dark:text-gray-50 text-slate-500' : 'dark:text-teal-700'} cursor-pointer`}>
                {CONSTANT_GAME.NUMBERS.map((num: any) => (
                    <p
                        key={num}
                        onClick={() => {
                            if (!selectedCell) return;
                            penActive
                                ? handlePenInput(selectedCell.row, selectedCell.col, num)
                                : insertNumber(num);
                        }}
                    >
                        {num}
                    </p>
                ))}
            </div>
            <div className="flex flex-row justify-center mt-2 gap-20">
                <div
                    className="flex flex-col items-center dark:text-white cursor-pointer"
                    onClick={() => clear()}
                >
                    <AiOutlineUndo className="rotate-90" />
                    <p>Clean All</p>
                </div>
                <div
                    className="flex flex-col items-center dark:text-white cursor-pointer"
                    onClick={() => insertNumber(-1)}
                >
                    <TfiEraser />
                    <p>Clean</p>
                </div>
                <div
                    className={`flex flex-col items-center ${penActive ? 'font-bold dark:text-black text-slate-700' : 'dark:text-white'} cursor-pointer w-4`}
                    onClick={() => changeMode()}
                >
                    <BsPencil />
                    <p>Pen</p>
                </div>
            </div>
        </>
    );
});

export default FooterGame;
