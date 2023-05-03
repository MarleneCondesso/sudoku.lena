import { MdOutlineArrowBackIos } from "react-icons/md";
import { BsPalette } from "react-icons/bs";
//import { FiSettings } from "react-icons/fi";
import { AiOutlineUndo } from "react-icons/ai";
import { TfiEraser } from "react-icons/tfi";
//import { BsFillPencilFill } from "react-icons/bs";
//import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { BiPauseCircle } from 'react-icons/bi';
//import { VscPlayCircle } from 'react-icons/vsc'
import { useCallback, useEffect, useState } from "react";
import { SudokuGenerate } from "../libs/SudokuGenerate";
import { useParams } from "react-router-dom";
import NavbarTheme from "../components/NavbarTheme";
import { Cookie } from "../libs/Cookie";
import { useNavigate } from "react-router-dom";
import { TimeFormatter } from "../libs/TimeFormatter";
import { CONSTANT_GAME, CONSTANT_TYPE_BORDER } from "../libs/Modules";


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
    original: any;
    solution: any;
    answer: any;
    time: any;
    errors: any;
}



const GamePage = () => {

    var interval;

    const params = useParams();
    const level = params?.level?.toString() || "";
    const index_level = parseInt(level);


    const navigate = useNavigate();
    const cookie = new Cookie();
    const sudokuGenerate = new SudokuGenerate();
    const formatter = new TimeFormatter();

    const [showMenuTheme, setShowMenuTheme] = useState(false);
    const [isSelectedCell, setIsSelectedCell] = useState(false);

    const [timeArray, setTimeArray] = useState<Array<number>>([]);
    const [seconds, setSeconds] = useState(-1);

    const sudokuCreated = getDeepCopy(sudokuGenerate.sudokuGen(CONSTANT_GAME.LEVEL[index_level]));

    const sudokuBase = getDeepCopy(sudokuCreated.question);
    const [sudokuSolution, setSudokuSolution] = useState(getDeepCopy(sudokuCreated.solution));

    const [initialSudoku, setInitialSudoku] = useState(sudokuBase);
    const [sudokuAnswer, setSudokuAnswer] = useState(sudokuBase);


    const [errors, setErrors] = useState(0);

    const toggleShowMenuTheme = useCallback(() => {
        setShowMenuTheme((current) => !current);
    }, []);

    const toggleErrors = useCallback(() => {
        setErrors((current) => current + 1);
    }, []);


    function getDeepCopy(value: any) {
        return JSON.parse(JSON.stringify(value));
    }
    function handler(e: any, row: number, col: number, num: number){
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
        saveGameCookie();

        if (checkSudoku(grid)) {
            saveGameCookie();
            const finish = 'win';
            navigate(`/game-page/${finish}`);
        }

    };
    const saveGameCookie = () => {
        const game: Game = {
            level: level,
            solution: sudokuSolution,
            time: seconds,
            answer: sudokuAnswer,
            original: initialSudoku,
            errors: errors
        }

        const gameJsonString = JSON.stringify(game);
        cookie.setCookie('game', gameJsonString, 7);

    }

    function checkSudoku(grid: any){
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
    function clearSudoku(){
        setSudokuAnswer(initialSudoku);
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            clearTheBorderInput(inputs[i], 2);
        }
    };

    function changeTheBorderOfInput(
        inputs: any,
        cell: any,
        value: any,
        row: any,
        col: any
    ){
        // Changes style according to user number interaction
        for (const element of inputs) {
            if (element === cell.target) {
                debugger
                if (sudokuSolution[row][col] !== value && value !== -1) {
                    clearTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.normalBorder);
                    addTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.errorBorder);
                } else {
                    clearTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.errorBorder);
                    addTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.normalBorder);
                }
            } else {
                clearTheBorderInput(element, CONSTANT_TYPE_BORDER.normalBorder);
            }
        }
    };
    // Methods to change the border of inputs cells
    function clearTheBorderInput(cell: any, type: any){
        if (type === 0) {
            cell.classList.remove("dark:focus:border-teal-700");
            cell.classList.remove("dark:focus:border-4");
            cell.classList.remove("focus:border-slate-500");
            cell.classList.remove("focus:border-4");
            cell.classList.remove("dark:border-teal-700");
            cell.classList.remove("dark:border-4");
            cell.classList.remove("border-[var(--background-components)]");
            cell.classList.remove("border-4");
        } else if (type === 1) {
            cell.classList.remove("border-red-600");
            cell.classList.remove("border-4");
        } else {
            cell.classList.remove("dark:focus:border-teal-700");
            cell.classList.remove("dark:focus:border-4");
            cell.classList.remove("dark:border-teal-700");
            cell.classList.remove("dark:border-4");
            cell.classList.remove("focus:border-slate-500");
            cell.classList.remove("focus:border-4");
            cell.classList.remove("border-[var(--background-components)]");
            cell.classList.remove("border-4");
            cell.classList.remove("border-red-600");
            cell.classList.remove("border-4");
        }
    };
    function addTheBorderInput(cell: any, type: any){
        if (type === 0) {
            cell.classList.add("dark:focus:border-teal-700");
            cell.classList.add("dark:focus:border-4");
            cell.classList.add("dark:border-teal-700");
            cell.classList.add("dark:border-4");
            cell.classList.add("focus:border-[var(--background-components)]");
            cell.classList.add("focus:border-4");
            cell.classList.add("border-[var(--background-components)]");
            cell.classList.add("border-4");
        } else {
            toggleErrors();
            cell.classList.add("border-red-600");
            cell.classList.add("border-4");
        }
    };


    function insertNumber(num: any){
        if (isSelectedCell) {
            // Make changes on input cell without using interaction of keyboard user - readOnly
            if (num === globalThis.selectedCell?.num && globalThis.selectedCell.num !== null)
                num = -1;
            handler(
                globalThis.selectedCell.e,
                globalThis.selectedCell.row,
                globalThis.selectedCell.col,
                num
            );
        }
    };
    function pad(val: any){
        return val > 9 ? val : "0" + val;
      };
    function getTime(secs: number){

        var time: number = secs;
      
        interval = setInterval(function () {
            
            const hours = pad(parseInt((time / 3600).toString(), 10));
            const minutes = pad(parseInt((time / 60).toString(), 10) % 60);
            const seconds = pad(++time % 60);
        
            const array = [hours, minutes, seconds];

            setTimeArray(array);
            setSeconds(time);

        }, 1000);
    };
    function openGame(){

        const savedGameJsonString = cookie.getCookie('game');

        if (savedGameJsonString?.length !== 0) {
            const savedGame = JSON.parse(savedGameJsonString);
            setSudokuAnswer(savedGame?.answer);
            setInitialSudoku(savedGame?.original);
            setSudokuSolution(savedGame?.solution);
            getTime(savedGame?.time);
            setErrors(savedGame?.errors);
        } else {
            getTime(seconds);
        }
    };


    function redirectToHomePage(){
        saveGameCookie();
        navigate("/");
    };
    function redirectToPausePage(){
        saveGameCookie();
        navigate('/game-page/pause');
    };


    useEffect(() => {
        if (seconds !== -1 && sudokuAnswer !== initialSudoku) {
            saveGameCookie();
        }
    }, [seconds, sudokuAnswer, errors]);

    useEffect(() => {
        if (errors === 3) {
            const finish = 'lost';
            navigate(`/game-page/${finish}`);
        }
    }, [errors]);

    useEffect(() => {
        openGame();
    }, []);


    return (
            <div className="lg:w-full lg:h-full lg:p-7 gap-4 flex flex-col pt-10">
                <div className="flex flex-row justify-between dark:text-teal-700">
                    <button onClick={() => redirectToHomePage()}>
                        <MdOutlineArrowBackIos size={25} />
                    </button>

                    <h1 className="text-xl lg:text-4xl font-semibold dark:text-white">Sudoku.lena</h1>
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
                            } fixed top-20 lg:top-8 right-7`}
                    >
                        <NavbarTheme onGameScene={true} />
                    </div>
                </div>

                <div className="flex flex-row justify-between pt-10 dark:text-white">
                    <p>{CONSTANT_GAME.LEVEL_NAME[index_level]}</p>
                    <div className="flex flex-row gap-2">
                        <p>Erros:</p>
                        <div className="flex flex-row">
                            <p>{errors}</p>
                            <p>/</p>
                            <p>3</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <BiPauseCircle onClick={() => { redirectToPausePage(); }} size={20} />
                        {timeArray.length !== 0 ?
                            <div>
                                <span>{timeArray[0]}:</span>
                                <span>{timeArray[1]}:</span>
                                <span>{timeArray[2]}</span>
                            </div>
                            :
                            <div>
                                <span>00:</span>
                                <span>00:</span>
                                <span>00</span>
                            </div>
                        }
                    </div>
                </div>

                <div className="flex items-center justify-center w-full py-2">
                    <table className="border-collapse border-[#f0c98b] dark:border-teal-700 border-4">
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
                                                    cursor-pointer
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
                        onClick={() => insertNumber(-1)}
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
                <div className="flex flex-row justify-between text-3xl font-semibold pt-5 dark:text-teal-700 cursor-pointer">
                    {CONSTANT_GAME.NUMBERS.map((num: any) => (
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
    );
};

export default GamePage;
