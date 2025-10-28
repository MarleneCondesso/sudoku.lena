import { FC, useCallback, useState } from "react";
import { AiOutlineUndo } from "react-icons/ai";
import { TfiEraser } from "react-icons/tfi";
import { BsPencil } from "react-icons/bs";
import { CONSTANT_GAME } from "../libs/Modules";
import PenGuesses from "./PenGuesses";
import React from "react";

interface FooterGameProps{
    clearSudoku: () => void;
    clearTheBorderInput: (cell: any, type: any) => void;
    handler: (e: any, row: number, col: number, num: number) => void;
    isSelectedCell: boolean;
   /*  handlePenInput: (row: number, col: number, guess: number, e: any) => void; */
    setPenMode: (e: boolean) => void;
    guesses: (guesses: number[][][]) => void;

}

const FooterGame: FC<FooterGameProps> = React.memo(({clearSudoku, clearTheBorderInput, handler, isSelectedCell, setPenMode, guesses}) => {

    const [penActive, setPenActive] = useState(false);
    const [ penGuesses, setPenGuesses ] = useState<number[][][]>(Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => [])));


    const changeMode = useCallback(() => {
        setPenActive(current => {
            setPenMode(!current);
            return !current;
        });
    },[setPenMode])

    function clear(){
        clearSudoku();
        const inputs = document.getElementsByTagName("input");
        for (let i = 0; i < inputs.length; i++) {
            clearTheBorderInput(inputs[i], 2);
        }
    };

    function insertNumber(num: any){
        if (isSelectedCell) {
            // Make changes on input cell without using interaction of keyboard user - readOnly
            if (num === globalThis.selectedCell?.num && globalThis.selectedCell.num !== null) num = -1;
            handler(
                globalThis.selectedCell.cell,
                globalThis.selectedCell.row,
                globalThis.selectedCell.col,
                num
            );
            /* debugger
            if (penActive) handlePenInput(globalThis.selectedCell.row, globalThis.selectedCell.col, num); */
        }
    };
    function handlePenInput(row: number, col: number, guess: number, event: React.MouseEvent) {
        // event.stopPropagation();
        if(!penGuesses) return
        //console.log(event.view.document.)
        setPenGuesses(prevGuesses => {
            const newGuesses = [ ...prevGuesses ];
            debugger
            // Check if the guess is already in the array
            const guessIndex = newGuesses[row][col].indexOf(guess);

            console.log(guessIndex, guess);
            
            if (guess !== -1) {
                if (!newGuesses[ row ][ col ].includes(guess)) {
                       newGuesses[ row ][ col ].push(guess);
                   } else {
                    newGuesses[row][col].splice(guessIndex,1);
                   }
             
               // if (guessIndex === -1) {
                    // If the guess is not present, add it
                 //   newGuesses[row][col].push(guess);
                //} //else {
                    // If the guess is present, remove it
                   // newGuesses[row][col].splice(guessIndex, 1);
                //}
            }

            /* if (!newGuesses[ row ][ col ].includes(guess) || !newGuesses[ row ][ col ].includes(-1)) {
                newGuesses[ row ][ col ].push(guess);
            } else {
                /* const index = newGuesses[row][col].indexOf(guess);
                console.log(index) */
            //newGuesses[row][col].pop();


            newGuesses[row][col].sort((a: number, b:number) => a - b); 
            return newGuesses;
        });
        globalThis.guesses = penGuesses;
        guesses(penGuesses);

        console.log(penGuesses);


    }


    return (
        <>
        <div className={`flex flex-row justify-between text-3xl font-semibold ${penActive ? 'dark:text-slate-500 text-slate-500' : 'dark:text-teal-700' } cursor-pointer`}>
            {CONSTANT_GAME.NUMBERS.map((num: any) => (
                <p
                    key={num}
                    onClick={(e) => {penActive ? handlePenInput(globalThis.selectedCell.row, globalThis.selectedCell.col, num, e) :
                        insertNumber(num)
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
                <AiOutlineUndo className="rotate-90"  />
                <p>Clean All</p>
            </div>
            <div
                className="flex flex-col items-center dark:text-white cursor-pointer"
                onClick={() => insertNumber(-1)}
            >
                <TfiEraser className="" />
                <p>Clean</p>
            </div>            
            <div className={`flex flex-col items-center ${penActive ? 'font-bold dark:text-black text-slate-700' : 'dark:text-white'} cursor-pointer w-4`} onClick={()=> {changeMode()}}>
                <BsPencil />
                <p>Pen</p>
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
        
        </>
    );
});

export default FooterGame;