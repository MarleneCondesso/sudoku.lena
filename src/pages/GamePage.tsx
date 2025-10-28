import { MdOutlineArrowBackIos } from "react-icons/md";
import { BsPalette } from "react-icons/bs";
//import { FiSettings } from "react-icons/fi"
//import { BsFillPencilFill } from "react-icons/bs"
//import { MdOutlineTipsAndUpdates } from "react-icons/md"
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
import Table from "../components/Table";
import FooterGame from "../components/FooterGame";
import React from "react";


export interface Sudoku {
    origin: number[][];
    question: number[];
}

export interface SelectedCell {
    cell: any;
    row: number;
    col: number;
    num: number;
}

export interface Game {
    level: any;
    original: any;
    solution: any;
    answer: any;
    time: any;
    errors: any;
}



const GamePage = React.memo(() => {

    let interval;

    const params = useParams();
    const level = params?.level?.toString() || "";
    const index_level = parseInt(level);

    const type = params?.type?.toString() || "";
    const restartGame = parseInt(type);


    const navigate = useNavigate();
    const cookie = new Cookie();
    const sudokuGenerate = new SudokuGenerate();

    const [ showMenuTheme, setShowMenuTheme ] = useState(false);
    const [ isSelectedCell, setIsSelectedCell ] = useState(false);

    const [ timeArray, setTimeArray ] = useState<Array<number>>([]);
    const [ seconds, setSeconds ] = useState(-1);

    const sudokuCreated = getDeepCopy(sudokuGenerate.sudokuGen(CONSTANT_GAME.LEVEL[ index_level ]));

    const sudokuBase = getDeepCopy(sudokuCreated.question);
    const [ sudokuSolution, setSudokuSolution ] = useState(getDeepCopy(sudokuCreated.solution));

    const [ initialSudoku, setInitialSudoku ] = useState(sudokuBase);
    const [ sudokuAnswer, setSudokuAnswer ] = useState(sudokuBase);

    const [ disableInput, setDisableInput ] = useState(false);

    const [ errors, setErrors ] = useState(0);

    const [ penActive, setPenActive ] = useState(false);

    /*     const [penGuesses, setPenGuesses] = useState(() => 
            Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []))
          ); */
    const [ penGuesses, setPenGuesses ] = useState<number[][][]>(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));


    const toggleShowMenuTheme = useCallback(() => {
        setShowMenuTheme((current) => !current);
    }, []);

    const toggleErrors = useCallback(() => {
        //setErrors((current) => current + 1);
        setDisableInput(false);
    }, []);


    function getDeepCopy(value: any) {
        return JSON.parse(JSON.stringify(value));
    }

    

    function handler(e: any, row: number, col: number, num: number) {

        

        setIsSelectedCell(true);
        let value = 0,
            grid = getDeepCopy(sudokuAnswer),
            selectedCell: SelectedCell = {
                cell: e,
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


        !penActive && changeTheBorderOfInput(inputs, e, value, row, col);

        if (value === -1 || (value >= 1 && value <= 9)) {
            grid[ row ][ col ] = value;
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
            level: index_level,
            solution: sudokuSolution,
            time: seconds,
            answer: sudokuAnswer,
            original: initialSudoku,
            errors: errors
        }

        const gameJsonString = JSON.stringify(game);
        cookie.setCookie('game', gameJsonString, 7);

    }

    function checkSudoku(grid: any) {
        let res = false;
        //debugger
        // GRID -> ROWS -> ROW -> VALUE
        // EQUALS
        // SOLUTION -> SOLUTION[ROWS] -> SOLUTION[INDEXROW] -> VALUE
        try {
            grid.forEach((rows: Array<number>, i: any) => {
                res = rows.every(
                    (value: any, iRow: any) => value === sudokuSolution[ i ][ iRow ]
                );
                if (!res) throw Error;
            });
        } catch (error) {
            return res;
        }
        return res;
    };


    function changeTheBorderOfInput(
        inputs: any,
        cell: any,
        value: any,
        row: any,
        col: any
    ) {

        const isCorrect = sudokuSolution[ row ][ col ] === value;
        // Changes style according to user number interaction
        /**
         * 
         * 
         * 
         * if the input is incorrect and the user select and insert a number
         * the border of the cell will be red 
         * 
         * if the input is -1 that means that the user just select the cell 
         * the border of the cell will be green 
         * 
         * if the input is correct 
         * the border of the cell will be disappear
         * 
         * 
         * if any element has the border has select that is not the actual cell selected has the last one, 
         * then clear the border of that elements.
         */
        for (const element of inputs) {
            if (element === cell.target) {

                if (!isCorrect && value !== -1) {
                    if (cell.target.classList.contains("border-red-600")) return
                    clearTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.normalBorder);
                    addTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.errorBorder);

                } else if (value === -1) {
                    clearTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.errorBorder);
                    addTheBorderInput(cell.target, CONSTANT_TYPE_BORDER.normalBorder);
                } else if (isCorrect) {
                    clearTheBorderInput(cell.target, -1);
                } else {
                    return
                }
            } else {
                if (element?.classList.contains("border-[var(--background-components)]") || element?.classList.contains("border-teal-700")) clearTheBorderInput(element, -1);

                var cellBeforeSelected = globalThis.selectedCell?.cell;

                if (element !== cellBeforeSelected?.target) {

                    globalThis.selectedCell = {
                        cell: cell,
                        row: row,
                        col: col,
                        num: value,
                    };


                }
            }
        }
    };

    // Methods to change the border of inputs cells
    function clearTheBorderInput(cell: any, type: any) {
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
    function addTheBorderInput(cell: any, type: any) {
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



    function pad(val: any) {
        return val > 9 ? val : "0" + val;
    };
    function getTime(secs: number) {

        let time: number = secs;

        interval = setInterval(function () {

            const hours = pad(parseInt((time / 3600).toString(), 10));
            const minutes = pad(parseInt((time / 60).toString(), 10) % 60);
            const seconds = pad(++time % 60);

            const array = [ hours, minutes, seconds ];

            setTimeArray(array);
            setSeconds(time);

        }, 1000);
    };

    function openGame() {

        const savedGameJsonString = cookie.getCookie('game');

        if (savedGameJsonString?.length !== 0) {
            const savedGame = JSON.parse(savedGameJsonString);
            if (restartGame === 1) {
                setSudokuAnswer(savedGame?.original);
                getTime(seconds);
                setErrors(0);
            } else {
                setSudokuAnswer(savedGame?.answer);
                getTime(savedGame?.time);
                setErrors(savedGame?.errors);
            }
            setInitialSudoku(savedGame?.original);
            setSudokuSolution(savedGame?.solution);


        } else {
            getTime(seconds);
        }
    };


    function redirectToHomePage() {
        saveGameCookie();
        navigate("/");
    };
    function redirectToPausePage() {
        saveGameCookie();
        navigate('/game-page/pause');
    };


    useEffect(() => {
        if (seconds !== -1 && sudokuAnswer !== initialSudoku) {
            saveGameCookie();
        }
    }, [ seconds, sudokuAnswer, errors ]);

    useEffect(() => {
        if (errors === 3) {
            const finish = 'lost';
            navigate(`/game-page/${finish}`);
        }
    }, [ errors ]);

    useEffect(() => {
        openGame();
    }, []);









    return (
        <div className="gap-4 px-6 flex flex-col pt-4 lg:pt-2 justify-center w-max">
            <div className="flex flex-row dark:text-teal-700 justify-between">
                <button onClick={() => redirectToHomePage()}>
                    <MdOutlineArrowBackIos size={30} />
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
                        } fixed top-10 lg:top-11 right-7 lg:right-80 xl:right-[28rem] xl:top-10 2xl:right-[68rem] 2xl:top-96`}
                >
                    <NavbarTheme onGameScene={true} />
                </div>
            </div>

            <div className="flex flex-row justify-between md:pt-10 pt-2 lg:pt-0 dark:text-white">
                <p>{CONSTANT_GAME.LEVEL_NAME[ index_level ]}</p>
                <div className="flex flex-row gap-2">
                    <p>Errors:</p>
                    <div className="flex flex-row">
                        <p>{errors}</p>
                        <p>/</p>
                        <p>3</p>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <BiPauseCircle onClick={() => { redirectToPausePage(); }} size={20} className="cursor-pointer" />
                    {timeArray.length !== 0 ?
                        <div>
                            <span>{timeArray[ 0 ]}:</span>
                            <span>{timeArray[ 1 ]}:</span>
                            <span>{timeArray[ 2 ]}</span>
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

            <div className="flex items-center justify-center py-2">
                <Table sudokuAnswer={sudokuAnswer} sudokuInitial={initialSudoku} handler={(e, row, col, num) => handler(e, row, col, num)} disable={disableInput} penActive={penActive} penGuesses={penGuesses} />
            </div>

            <FooterGame clearSudoku={() => setSudokuAnswer(initialSudoku)} clearTheBorderInput={(cell, type) => clearTheBorderInput(cell, type)} handler={(e, row, col, num) => handler(e, row, col, num)} isSelectedCell={isSelectedCell} setPenMode={(res) => { setPenActive(res) }} guesses={(res) => setPenGuesses(res)} />
        </div>
    );
});

export default GamePage;
