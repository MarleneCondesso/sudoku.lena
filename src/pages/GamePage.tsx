import { MdOutlineArrowBackIos } from "react-icons/md";
import { BsPalette } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineUndo } from "react-icons/ai";
import { TfiEraser } from "react-icons/tfi";
import { BsFillPencilFill } from "react-icons/bs";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { useCallback, useEffect, useState } from "react";
import { SudokuGenerate } from "./SudokuGenerate";
import { CONSTANT } from "./HomePage";
import { useNavigate, useParams } from "react-router-dom";
import NavbarTheme from "../components/NavbarTheme";
import FinishGamePage from "./FinishGamePage";
import { debug, error } from "console";

export interface Sudoku {
    origin: number[][];
    question: number[];
}

export interface SelectedCell {
    e: any;
    row: any;
    col: any;
    num: any;
}

export interface Game {
    level: any;
    sudoku: any;
    sudokuOrigin: any;
    time: any;
    solution: any;
}

let sudokuGenerate = new SudokuGenerate();

const GamePage = () => {
    let params = useParams();
    let level = params?.level?.toString() || "";
    let type = params.type?.toString() || "";
    let index_level = parseInt(level);
    let typeConvert = parseInt(type);

    const navigate = useNavigate();

    const [showMenuTheme, setShowMenuTheme] = useState(false);
    const [isSelectedCell, setIsSelectedCell] = useState(false);
    const [showFinishGamePage, setShowFinishGamePage] = useState(false);

    const [timeArray, setTimeArray] = useState<Array<number>>([]);
    const [pauseTimer, setPauseTimer] = useState(false);
    const [seconds, setSeconds] = useState(0);

    const sudokuCreated = getDeepCopy(sudokuGenerate.sudokuGen(CONSTANT.LEVEL[index_level]));

    const sudokuBase = getDeepCopy(sudokuCreated.question);
    const [sudokuSolution, setSudokuSolution] = useState(getDeepCopy(sudokuCreated.solution));

    const [initialSudoku, setInitialSudoku] = useState(sudokuBase);
    const [sudokuAnswer, setSudokuAnswer] = useState(sudokuBase);




    const toggleShowMenuTheme = useCallback(() => {
        setShowMenuTheme((current) => !current);
    }, []);

    function getDeepCopy(arr: any) {
        return JSON.parse(JSON.stringify(arr));
    }

    //CHECK ROW BY ROW
    const equals = (gridRow: any, sudokuSolutionRow: any) =>
        gridRow.length === sudokuSolutionRow.length &&
        gridRow.every((value: any, i: any) => value === sudokuSolutionRow[i]);

    const checkSudoku = (grid: any) => {
        var res = false;
        //debugger
        // GRID -> ROWS -> ROW -> VALUE
        // EQUALS
        // SOLUTION -> SOLUTION[ROWS] -> SOLUTION[INDEXROW] -> VALUE
        try {
            grid.forEach((rows: Array<number>, i: any) => {
                res = rows.every(
                    (value: any, iRow: any) => value === sudokuSolution[i][iRow]
                );
                if (!res) throw Error;
            });
        } catch (error) {
            return res;
        }

        return res;
    };

    const handler = (e: any, row: number, col: number, num: number) => {
        setIsSelectedCell(true);
        var value = 0,
            grid = getDeepCopy(sudokuAnswer),
            selectedCell: SelectedCell = {
                e: e,
                row: row,
                col: col,
                num: num,
            },
            inputs = document.getElementsByTagName("input");

        if (num >= 1 || num === -1) {
            value = num;
        } else {
            value = parseInt(e.target.value) || -1;
        }

        changeTheBorderOfInput(inputs, e, value, row, col);

        if (value === -1 || (value >= 1 && value <= 9)) {
            grid[row][col] = value;
        }
        setSudokuAnswer(grid);
        globalThis.selectedCell = selectedCell;
        saveGame();


        // var gameInformation = encodeURI(globalThis.game);
        // document.cookie = "game=" + gameInformation;


        if (checkSudoku(grid)) {
            console.log();
            saveGame();
            navigate("/game-page/finish");
        }
    };

    const changeTheBorderOfInput = (
        inputs: any,
        cell: any,
        value: any,
        row: any,
        col: any
    ) => {
        // Changes style according to user number interaction
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] === cell.target) {
                if (sudokuSolution[row][col] !== value && value !== -1) {
                    clearTheBorderInput(cell.target, 0);
                    addTheBorderInput(cell.target, 1);
                } else {
                    clearTheBorderInput(cell.target, 1);
                    addTheBorderInput(cell.target, 0);
                }
            } else {
                clearTheBorderInput(inputs[i], 0);
            }
        }
    };
    const getTime = (time: any) => {
        function pad(val: any) {
            return val > 9 ? val : "0" + val;
        }
        setInterval(function () {
            if (!pauseTimer) {
                let hours = pad(parseInt((time / 3600).toString(), 10));
                let minutes = pad(parseInt((time / 60).toString(), 10) % 60);
                let seconds = pad(++time % 60);

                let array = [hours, minutes, seconds];

                setTimeArray(array);
                setSeconds(time);
            }
        }, 1000);
    };

    const saveGame = () => {
        setPauseTimer(true);
        const game: Game = {
            level: index_level,
            sudoku: sudokuAnswer,
            sudokuOrigin: initialSudoku,
            time: seconds,
            solution: sudokuSolution,
        };

        globalThis.game = game;
    };

    const redirectToHomePage = () => {
        saveGame();
        navigate("/");
    };

    const clearSudoku = () => {
        setSudokuAnswer(initialSudoku);
        var inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            clearTheBorderInput(inputs[i], 2);
        }
    };

    const openGame = () => {
        if (typeConvert === 1) {
            setSudokuAnswer(globalThis.game?.sudoku);
            setInitialSudoku(globalThis.game?.sudokuOrigin);
            getTime(globalThis.game?.time);
            setSudokuSolution(globalThis.game?.solution);
        } else {
            getTime(-1);
        }
    };

    useEffect(() => {
        openGame();
        //console.log(getCookie("game"));
    }, []);

    function getCookie(name: any) {
        debugger
        var x,
            y,
            pair = document.cookie?.split("; ");
        // Cookies seperated by ;   Key->value seperated by =
        for (var i = 0; pair[i]?.split("="); i++)
            x = pair[i].substring(0, pair[i].indexOf("="));
        y = pair[i].substring(pair[i].indexOf("=") + 1);
        x = x?.replace(/^\s+|\s+$/g, "");
        if (x == name) {
            console.log(decodeURI(y));
            return decodeURI(y);
        }
    }

    const insertNumber = (num: any) => {
        if (isSelectedCell) {
            // Make changes on input cell without using interaction of keyboard user - readOnly
            if (
                num === globalThis.selectedCell?.num &&
                globalThis.selectedCell.num !== null
            )
                num = -1;
            handler(
                globalThis.selectedCell.e,
                globalThis.selectedCell.row,
                globalThis.selectedCell.col,
                num
            );
        }
    };

    // Methods to change the border of inputs cells
    const clearTheBorderInput = (cell: any, type: any) => {
        if (type === 0) {
            cell.classList.remove("dark:focus:border-teal-700");
            cell.classList.remove("dark:focus:border-4");
            cell.classList.remove("focus:border-slate-500");
            cell.classList.remove("focus:border-4");
        } else if (type === 1) {
            cell.classList.remove("border-red-600");
            cell.classList.remove("border-4");
        } else {
            cell.classList.remove("dark:focus:border-teal-700");
            cell.classList.remove("dark:focus:border-4");
            cell.classList.remove("focus:border-slate-500");
            cell.classList.remove("focus:border-4");
            cell.classList.remove("border-red-600");
            cell.classList.remove("border-4");
        }
    };

    const addTheBorderInput = (cell: any, type: any) => {
        if (type === 0) {
            cell.classList.add("dark:focus:border-teal-700");
            cell.classList.add("dark:focus:border-4");
            cell.classList.add("focus:border-slate-500");
            cell.classList.add("focus:border-4");
        } else {
            cell.classList.add("border-red-600");
            cell.classList.add("border-4");
        }
    };

    return (
        <div className="flex flex-col w-full p-7 dark:bg-[var(--dark-background)] justify-between items-center">
            <div className="lg:w-96 ">
                <div className="flex flex-row justify-between dark:text-teal-700">
                    <button onClick={() => redirectToHomePage()}>
                        <MdOutlineArrowBackIos size={25} />
                    </button>

                    <h1 className="text-xl font-semibold dark:text-white">Sudoku.lena</h1>
                    <div className="flex flex-row gap-5 dark:text-teal-700">
                        <BsPalette
                            size={25}
                            className="cursor-pointer"
                            onClick={toggleShowMenuTheme}
                        />

                        {/* <FiSettings size={25} /> */}
                    </div>
                    <div
                        className={`${showMenuTheme ? "flex" : "hidden"
                            } fixed top-16 right-7`}
                    >
                        <NavbarTheme onGameScene={true} />
                    </div>
                </div>

                <div className="flex flex-row justify-between pt-10 dark:text-white">
                    <p>{CONSTANT.LEVEL_NAME[index_level]}</p>
                    <div className="flex flex-row gap-2">
                        <p>Erros:</p>
                        <div className="flex flex-row">
                            <p>0</p>
                            <p>/</p>
                            <p>3</p>
                        </div>
                    </div>
                    <div>
                        <span>{timeArray[0]}:</span>
                        <span>{timeArray[1]}:</span>
                        <span>{timeArray[2]}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center w-full py-2">
                    <table className="border-collapse border-[#f0c98b] dark:border-teal-700 border-4 w-full">
                        <tbody id="tbody">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => {
                                return (
                                    <tr
                                        key={row}
                                        id="tableRow"
                                        className={`${(row + 1) % 3 === 0 && row + 1 !== 9 ? "mb-1" : ""
                                            } flex-row flex`}
                                    >
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => {
                                            return (
                                                <td
                                                    key={col}
                                                    id="tableCol"
                                                    className={`${(col + 1) % 3 === 0 && col + 1 !== 9 ? "mr-1" : ""
                                                        } flex flex-col items-center`}
                                                >
                                                    <input
                                                        id="input"
                                                        type="number"
                                                        className={`h-8 
                                                    //dark:focus:border-teal-700 
                                                    //dark:focus:border-4
                                                    //focus:border-slate-500
                                                    //focus:border-4
                                                    w-8 
                                                    flex 
                                                    text-center
                                                    shadow-xl
                                                    bg-slate-400
                                                    text-black
                                                    dark:bg-teal-700
                                                    dark:bg-opacity-20
                                                    dark:text-teal-800
                                                    outline-none
                                                    opacity-100
                                                    disabled:border-0
                                                    disabled:opacity-100 
                                                    disable:font-semibold
                                                    disabled:bg-[var(--background-components)]
                                                    disabled:text-slate-50
                                                    dark:disabled:bg-teal-800
                                                    dark:disabled:text-[#ffffff]
                                                    dark:disable:opacity-100`}
                                                        value={
                                                            sudokuAnswer &&
                                                                (sudokuAnswer[row][col] === 0 ||
                                                                    sudokuAnswer[row][col] === -1)
                                                                ? ""
                                                                : sudokuAnswer[row][col]
                                                        }
                                                        onChange={(e) => {
                                                            handler(e, row, col, 0);
                                                        }}
                                                        disabled={initialSudoku[row][col] !== 0}
                                                        //onInput={(e) => { handler(e, row, col,0) }}
                                                        onClick={(e) => handler(e, row, col, 0)}
                                                        inputMode="numeric"
                                                        readOnly
                                                    />
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-row justify-center mt-5 gap-20">
                    <div
                        className="flex flex-col items-center dark:text-white cursor-pointer"
                        onClick={() => clearSudoku()}
                    >
                        <AiOutlineUndo className="rotate-90" size={25} />
                        <p>Apagar Tudo</p>
                    </div>
                    <div
                        className="flex flex-col items-center dark:text-white"
                        onClick={() => {
                            insertNumber(-1);
                        }}
                    >
                        <TfiEraser className="" size={25} />
                        <p>Apagar</p>
                    </div>
                    {/**<div className='flex flex-col items-center'>
                        <BsFillPencilFill className='' size={25} />
                        <p>Desfazer</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <MdOutlineTipsAndUpdates className='' size={25} />
                        <p>Desfazer</p>
                    </div> */}
                </div>
                <div className="flex flex-row justify-between text-3xl font-semibold pt-5 dark:text-teal-700">
                    {CONSTANT.NUMBERS.map((num: any) => (
                        <p
                            key={num}
                            onClick={() => {
                                insertNumber(num);
                            }}
                        >
                            {num}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamePage;
