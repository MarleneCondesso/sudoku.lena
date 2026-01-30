import { MdOutlineArrowBackIos } from "react-icons/md";
import { BiPauseCircle } from 'react-icons/bi';
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { SudokuGenerate } from "../libs/SudokuGenerate";
import { useParams, useNavigate } from "react-router-dom";
import NavbarTheme from "../components/NavbarTheme";
import { Cookie } from "../libs/Cookie";
import { CONSTANT_GAME } from "../libs/Modules";
import Table from "../components/Table";
import FooterGame from "../components/FooterGame";
import React from "react";

export interface SelectedCell {
    row: number;
    col: number;
    num: number | null;
    cell: any; // obrigatório
}

/**
 * GamePage component renders the main Sudoku game interface.
 * It manages game state, timer, errors, and user interactions for playing Sudoku.
 * Uses React.memo for performance optimization.
 */
const GamePage = React.memo(() => {
    /**
     * useEffect hook to listen for theme changes in localStorage.
     * Updates the document class when storage changes (e.g., from another tab).
     */
    useEffect(() => {
        const handleStorageChange = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const params = useParams();
    const navigate = useNavigate();
    const cookie = new Cookie();
    const sudokuGenerate = new SudokuGenerate();
    const levelParam = params?.level;
    const index_level = levelParam ? parseInt(levelParam) : 0;

    // 🔒 guarda o level original do jogo
    const initialLevelRef = useRef<number>(index_level);

    const restartGame = parseInt(params?.type || "0");

    const sudokuCreated = JSON.parse(
        JSON.stringify(sudokuGenerate.sudokuGen(CONSTANT_GAME.LEVEL[index_level]))
    );

    const [sudokuSolution] = useState(sudokuCreated.solution);
    const [initialSudoku, setInitialSudoku] = useState(sudokuCreated.question);
    const [sudokuAnswer, setSudokuAnswer] = useState(sudokuCreated.question);

    const [cellErrors, setCellErrors] = useState<boolean[][]>(
        Array.from({ length: 9 }, () => Array(9).fill(false))
    );

    const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
    const [errors, setErrors] = useState(0);
    const [seconds, setSeconds] = useState(-1);
    const [timeArray, setTimeArray] = useState<number[]>([]);
    const [penActive, setPenActive] = useState(false);
    const [penGuesses, setPenGuesses] = useState<number[][][]>(
        Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
    );

    /**
     * Handles user input for a Sudoku cell.
     * Determines the value to insert, updates the answer grid, checks for errors, and increments error count if incorrect.
     * Prevents duplicate calls by checking if the value hasn't changed.
     * Logic example: If user enters 5 in cell (0,0) but solution has 3, marks cell as error and increments errors to 1.
     * @param e - The event object (optional, for input changes).
     * @param row - The row index of the cell.
     * @param col - The column index of the cell.
     * @param num - The number to insert (or -1 to clear).
     */
    function handler(e: any, row: number, col: number, num: number) {
        const value =
            num >= 1 || num === -1
                ? num
                : parseInt(e?.target?.value) || -1;

        const previousValue = sudokuAnswer[row][col];

        setSelectedCell({
            row,
            col,
            num: value,
            cell: e?.target || null // sempre definido
        });

        // 🔒 impede chamadas duplicadas
        if (previousValue === value) return;

        setSudokuAnswer((prev: number[][]): number[][] => {
            const copy: number[][] = JSON.parse(JSON.stringify(prev));
            copy[row][col] = value;
            return copy;
        });

        const isValidNumber = value >= 1 && value <= 9;
        const isCorrect = isValidNumber && sudokuSolution[row][col] === value;
        const hasErrorNow = isValidNumber && !isCorrect;

        setCellErrors(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            copy[row][col] = hasErrorNow;
            return copy;
        });

        // Count every wrong value entry
        if (hasErrorNow) {
            setErrors(e => e + 1);
        }
    }

    /**
     * Pads a number with a leading zero if it's less than 10.
     * Used for formatting time display (e.g., 5 becomes "05").
     * @param val - The number to pad.
     * @returns The padded string.
     */
    function pad(val: number) {
        return val > 9 ? val : "0" + val;
    }

    /**
     * Starts the game timer from a given start time.
     * Increments time every second and updates timeArray for display (HH:MM:SS format).
     * @param start - The starting time in seconds.
     */
    function startTimer(start: number) {
        let time = start;
        setInterval(() => {
            time++;
            setSeconds(time);
            setTimeArray([
                Number(pad(Math.floor(time / 3600))),
                Number(pad(Math.floor(time / 60) % 60)),
                Number(pad(time % 60))
            ]);
        }, 1000);
    }

    /**
     * Loads a saved game from cookies if available and not restarting.
     * If saved game exists, restores answer, original, timer, and errors; otherwise starts new timer at 0.
     */
    const openGame = useCallback(() => {
        const saved = cookie.getCookie("game");
        if (saved && restartGame !== 1) {
            const game = JSON.parse(saved);
            setSudokuAnswer(game.answer);
            setInitialSudoku(game.original);
            startTimer(game.time);
            setErrors(game.errors);
        } else {
            startTimer(0);
        }
    }, [cookie, restartGame]);

    /**
     * Saves the current game state to cookies.
     * Stores level, solution, original puzzle, current answer, time, and errors for 7 days.
     * @param answer - The current answer grid (defaults to sudokuAnswer).
     * @param timeValue - The current time in seconds (defaults to seconds).
     * @param errorValue - The current error count (defaults to errors).
     */
    const saveGameCookie = useCallback((
        answer = sudokuAnswer,
        timeValue = seconds,
        errorValue = errors
    ) => {
        const game = {
            level: initialLevelRef.current,
            solution: sudokuSolution,
            original: initialSudoku,
            answer,
            time: timeValue,
            errors: errorValue,
        };

        cookie.setCookie("game", JSON.stringify(game), 7);
    }, [cookie, sudokuAnswer, seconds, errors, sudokuSolution, initialSudoku]);

    /**
     * useEffect hook that saves the game whenever answer, seconds, or errors change.
     * Only saves if seconds >= 0 (timer started).
     */
    useEffect(() => {
        if (seconds >= 0) {
            saveGameCookie();
        }
    }, [sudokuAnswer, seconds, errors, saveGameCookie]);

    /**
     * useEffect hook that loads the game on component mount.
     */
    useEffect(() => {
        openGame();
    }, [openGame]);

    /**
     * useEffect hook that navigates to lose page if errors reach 3.
     */
    useEffect(() => {
        if (errors === 3) {
            navigate("/game-page/lost");
        }
    }, [errors, navigate]);

    /**
     * useEffect hook that focuses the selected cell's input element.
     */
    useEffect(() => {
        if (selectedCell?.cell) {
            selectedCell.cell.focus();
        }
    }, [selectedCell]);

    return (
        <div className="gap-4 px-6 flex flex-col pt-4 justify-center w-max">
            <div className="flex justify-between">
                <button onClick={() => navigate("/")}>
                    <MdOutlineArrowBackIos size={30} className="dark:text-teal-700 text-black" />
                </button>
                <h1  className="text-xl font-semibold dark:text-teal-700 text-black">Sudoku.lena</h1>
                <NavbarTheme onGameScene={true} />
            </div>

            <div className="flex justify-between">
                <p className="dark:text-white text-black">{CONSTANT_GAME.LEVEL_NAME[index_level]}</p>
                <p className="dark:text-white text-black">Errors: {errors}/3</p>
                <div className="flex gap-2">
                    <BiPauseCircle
                        size={20}
                        className="dark:text-white text-black cursor-pointer" 
                        onClick={() => navigate("/game-page/pause")}
                    />
                    <span className="dark:text-white text-black">
                        {timeArray.length
                            ? `${timeArray[0]}:${timeArray[1]}:${timeArray[2]}`
                            : "00:00:00"}
                    </span>
                </div>
            </div>

            <Table
                sudokuAnswer={sudokuAnswer}
                sudokuInitial={initialSudoku}
                handler={handler}
                disable={false}
                penActive={penActive}
                penGuesses={penGuesses}
                cellErrors={cellErrors}
                selectedCell={selectedCell}
            />

            <FooterGame
                clearSudoku={() => setSudokuAnswer(initialSudoku)}
                handler={handler}
                setPenMode={setPenActive}
                guesses={setPenGuesses}
                penGuesses={penGuesses}
                selectedCell={selectedCell}
                clearTheBorderInput={() => {
                    // função para limpar o border do input selecionado, se tiveres
                    // caso não haja, basta passar uma função vazia
                }}
                isSelectedCell={selectedCell !== null} // true se houver célula selecionada
            />

        </div>
    );
});

export default GamePage;
