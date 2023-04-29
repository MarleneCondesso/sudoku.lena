import { debug } from "console";
import { Sudoku } from "./GamePage";
import { CONSTANT } from "./HomePage";

interface Unassigned_pos{
    row: number,
    col: number
}
interface SudokuGeneration{
    solution: any,
    question: any
}

export class SudokuGenerate {

    newGrid = (size: number) => {
        const arr: Array<number[]> = new Array(size);

        for (var i = 0; i < size; i++) {
            arr[i] = new Array(size);
        }
        
        for (var i = 0; i < Math.pow(size, 2); i++) {
            
            arr[Math.floor(i / size)][i % size] = CONSTANT.UNASSIGNED;
        }
       
        return arr;
    }

    //check duplicate number in col

    isColSafe = (grid: Array<number>[], col: number, value: number) => {
        for (var row = 0; row < CONSTANT.GRID_SIZE; row++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    //check duplicate number in row

    isRowSafe = (grid: Array<number>[], row: number, value: number) => {
        for (var col = 0; col < CONSTANT.GRID_SIZE; col++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    //check duplicate number in 3x3 box

    isBoxSafe = (grid: Array<number>[], box_row: number, box_col: number, value: number) => {
        for (var row = 0; row < CONSTANT.BOX_SIZE; row++) {
            for (var col = 0; col < CONSTANT.BOX_SIZE; col++) {
                if (grid[row + box_row][col + box_col] === value) return false;
            }
        }
        return true;
    }

    //check duplicate number in row, col and 3x3 box

    isSafe = (grid: Array<number>[], row: number, col: number, value: number) => {

        return this.isColSafe(grid, col, value) && this.isRowSafe(grid, row, value)  && this.isBoxSafe(grid, row - row % 3, col - col % 3, value) && value !== CONSTANT.UNASSIGNED;
    }

    // find unassigned cell 
    findUnassignedPos = (grid: Array<number>[], pos: Unassigned_pos) => {
        
        for (var row = 0; row < CONSTANT.GRID_SIZE; row++) {
            for (var col = 0; col < CONSTANT.GRID_SIZE; col++) {
                if (grid[row][col] === CONSTANT.UNASSIGNED) {
                    pos.row = row;
                    pos.col = col;
                    return true;
                }
            }
        }
        return false;
    }


    //suffle arr
    shuffleArray = (arr: number[]) => {
        var curr_index = arr.length;
        while (curr_index !== 0) {
            const rand_index = Math.floor(Math.random() * curr_index);
            curr_index -= 1;

            const temp = arr[curr_index];
            arr[curr_index] = arr[rand_index];
            arr[rand_index] = temp;
        }
        
        return arr;
    }


    //check puzzle is complete
    isFullGrid = (grid: Array<number>[]) => {
        return grid.every((row: any, i: any) => {
            return row.every((value: any, j: any) => {
                return value !== 0;
            });
        });
    }

    sudokuCreate = (grid: Array<number>[]) => {
        const unassigned_pos: Unassigned_pos = {
            row: -1,
            col: -1
        }

        if (!this.findUnassignedPos(grid, unassigned_pos)) return true;
        
        const number_list = this.shuffleArray([...CONSTANT.NUMBERS]);
        
        const row = unassigned_pos.row;
        const col = unassigned_pos.col;

        number_list.forEach((num: number) => { //CHECK IF THIS NEEDS A INDEX I
            if (this.isSafe(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.isFullGrid(grid)) {
                    return true;
                } else {
                    if (this.sudokuCreate(grid)) {
                        return true;
                    }
                }

                grid[row][col] = CONSTANT.UNASSIGNED;
            }
        });
        
        return this.isFullGrid(grid);

    }


    sudokuCheck = (grid: Array<number>[]) => {

        const unassigned_pos = {
            row: -1,
            col: -1
        }

        if (!this.findUnassignedPos(grid, unassigned_pos)) return true;

        grid.forEach((row: number[], i: number) => {
            row.forEach((num: number, j: number) => {
                if (this.isSafe(grid, i, j, num)) {
                    
                    if (this.isFullGrid(grid)) {
                        return true;
                    } else {
                        if (this.sudokuCreate(grid)) {
                            return true;
                        }
                    }
                }
            })
        })



        return this.isFullGrid(grid);
    }


    rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);

    removeCells = (grid: any, level: any) => {
        //console.log(grid);
        const res = [...grid];
        var attemps = level;
        while (attemps > 0) {
            var row = this.rand();
            var col = this.rand();
            while (res[row][col] === 0) {
                row = this.rand();
                col = this.rand();
            }
            res[row][col] = CONSTANT.UNASSIGNED;
            attemps--;
        }
        return res;
    }

    //GENERATE SUDOKU base on level

    sudokuGen = (level: any) => {
        
        const sudoku = this.newGrid(CONSTANT.GRID_SIZE);
        
        const check = this.sudokuCreate(sudoku);

        const sudokuSolution = new Array(CONSTANT.GRID_SIZE);

        let res: SudokuGeneration = {
            solution: [],
            question: []
        }; 
        //cREATE ARRAY EMPTY
        for (var i = 0; i < CONSTANT.GRID_SIZE; i++) {
            sudokuSolution[i] = new Array(CONSTANT.GRID_SIZE);
        }
      
        //POPULATE ARRAY
        for (var row = 0; row < CONSTANT.GRID_SIZE; row++) {
            for (var col = 0; col < CONSTANT.GRID_SIZE; col++) {
                sudokuSolution[row][col] = sudoku[row][col]!;
            }
        }
 
        if (check) {
            const sudokuQuestion = this.removeCells(sudoku, level);
            
            res.solution = sudokuSolution;
            res.question = sudokuQuestion;

            return res;
        }

        return res;
    }
}