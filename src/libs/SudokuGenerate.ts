import { CONSTANT_GAME } from "./Modules";

interface UnassignedPos {
    row: number,
    col: number
}
interface SudokuGeneration {
    solution: any,
    question: any
}

export class SudokuGenerate {

    newGrid = (size: number) => {
        const arr: Array<number[]> = new Array(size);

        for (var i = 0; i < size; i++) {
            arr[i] = new Array(size);
        }

        for (var j = 0; j < Math.pow(size, 2); j++) {

            arr[Math.floor(j / size)][j % size] = CONSTANT_GAME.UNASSIGNED;
        }

        return arr;
    }

    /**
     * Checks if placing a value in a specific column is safe (no duplicates).
     * @param grid - The current Sudoku grid.
     * @param col - The column index to check.
     * @param value - The value to check for duplicates.
     * @returns True if safe, false if duplicate found.
     */
    isColSafe = (grid: Array<number>[], col: number, value: number) => {
        for (var row = 0; row < CONSTANT_GAME.GRID_SIZE; row++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    /**
     * Checks if placing a value in a specific row is safe (no duplicates).
     * @param grid - The current Sudoku grid.
     * @param row - The row index to check.
     * @param value - The value to check for duplicates.
     * @returns True if safe, false if duplicate found.
     */
    isRowSafe = (grid: Array<number>[], row: number, value: number) => {
        for (var col = 0; col < CONSTANT_GAME.GRID_SIZE; col++) {
            if (grid[row][col] === value) return false;
        }
        return true;
    }

    /**
     * Checks if placing a value in a specific 3x3 box is safe (no duplicates).
     * @param grid - The current Sudoku grid.
     * @param box_row - The starting row of the 3x3 box.
     * @param box_col - The starting column of the 3x3 box.
     * @param value - The value to check for duplicates.
     * @returns True if safe, false if duplicate found.
     */
    isBoxSafe = (grid: Array<number>[], box_row: number, box_col: number, value: number) => {
        for (var row = 0; row < CONSTANT_GAME.BOX_SIZE; row++) {
            for (var col = 0; col < CONSTANT_GAME.BOX_SIZE; col++) {
                if (grid[row + box_row][col + box_col] === value) return false;
            }
        }
        return true;
    }

    /**
     * Checks if placing a value at a specific position is safe in all Sudoku constraints.
     * Validates row, column, and 3x3 box constraints.
     * @param grid - The current Sudoku grid.
     * @param row - The row index.
     * @param col - The column index.
     * @param value - The value to place.
     * @returns True if safe to place, false otherwise.
     */
    isSafe = (grid: Array<number>[], row: number, col: number, value: number) => {
        return this.isColSafe(grid, col, value) && this.isRowSafe(grid, row, value) && this.isBoxSafe(grid, row - row % 3, col - col % 3, value) && value !== CONSTANT_GAME.UNASSIGNED;
    }

    /**
     * Finds the first unassigned (empty) position in the grid.
     * Searches row by row, left to right, and updates the pos object with the coordinates.
     * @param grid - The current Sudoku grid.
     * @param pos - Object to store the row and col of the unassigned position.
     * @returns True if an unassigned position is found, false if the grid is full.
     */
    findUnassignedPos = (grid: Array<number>[], pos: UnassignedPos) => {
        for (var row = 0; row < CONSTANT_GAME.GRID_SIZE; row++) {
            for (var col = 0; col < CONSTANT_GAME.GRID_SIZE; col++) {
                if (grid[row][col] === CONSTANT_GAME.UNASSIGNED) {
                    pos.row = row;
                    pos.col = col;
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Shuffles the elements of an array in place using the Fisher-Yates algorithm.
     * Ensures randomness for Sudoku number placement to avoid predictable patterns.
     * @param arr - The array to shuffle.
     * @returns The shuffled array.
     */
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

    /**
     * Checks if the Sudoku grid is completely filled (no unassigned cells).
     * @param grid - The Sudoku grid to check.
     * @returns True if all cells are filled, false otherwise.
     */
    isFullGrid = (grid: Array<number>[]) => {
        return grid.every((row: any, i: any) => {
            return row.every((value: any, j: any) => {
                return value !== 0;
            });
        });
    }

    /**
     * Recursively fills the Sudoku grid using backtracking algorithm.
     * Finds an empty cell, tries numbers 1-9 in random order, and recurses.
     * If a number leads to a solution, returns true; otherwise backtracks.
     * Logic example: For an empty grid, it starts at (0,0), tries 5 (if safe), places it, moves to next empty cell, etc.
     * If no number works, backtracks by resetting the cell and trying next number.
     * @param grid - The Sudoku grid to fill (modified in place).
     * @returns True if the grid is successfully filled, false otherwise.
     */
    sudokuCreate = (grid: Array<number>[]) => {
        const unassigned_pos: UnassignedPos = {
            row: -1,
            col: -1
        }

        if (!this.findUnassignedPos(grid, unassigned_pos)) return true;

        const number_list = this.shuffleArray([...CONSTANT_GAME.NUMBERS]);

        const row = unassigned_pos.row;
        const col = unassigned_pos.col;

        number_list.forEach((num: number) => {
            if (this.isSafe(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.isFullGrid(grid)) {
                    return true;
                } else {
                    if (this.sudokuCreate(grid)) {
                        return true;
                    }
                }

                grid[row][col] = CONSTANT_GAME.UNASSIGNED;
            }
        });

        return this.isFullGrid(grid);
    }

    /**
     * Validates if the current grid state is a valid Sudoku solution.
     * Checks each filled cell against Sudoku rules, but doesn't fill empty cells.
     * Note: This method seems incomplete as it doesn't properly validate; it may need refactoring.
     * @param grid - The Sudoku grid to check.
     * @returns True if valid, false otherwise.
     */
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

    /**
     * Generates a random index between 0 and GRID_SIZE-1.
     * Used for randomly selecting rows/columns when removing cells.
     * @returns A random integer from 0 to 8.
     */
    rand = () => Math.floor(Math.random() * CONSTANT_GAME.GRID_SIZE);

    /**
     * Removes a specified number of cells from the grid to create the puzzle.
     * Randomly selects filled cells and sets them to unassigned, based on difficulty level.
     * Ensures the removed cells were originally filled.
     * Logic example: For level 2, removes 2 cells by picking random filled positions.
     * @param grid - The complete Sudoku solution grid.
     * @param level - The number of cells to remove (difficulty level).
     * @returns A new grid with cells removed.
     */
    removeCells = (grid: any, level: any) => {
        const res = [...grid];
        var attempts = level;
        while (attempts > 0) {
            var row = this.rand();
            var col = this.rand();
            while (res[row][col] === 0) {
                row = this.rand();
                col = this.rand();
            }
            res[row][col] = CONSTANT_GAME.UNASSIGNED;
            attempts--;
        }
        return res;
    }

    /**
     * Generates a complete Sudoku puzzle with solution and question based on difficulty level.
     * Creates a full solution, then removes cells to create the puzzle.
     * Logic example: For easy level (2 cells removed), generates a full 9x9 grid, copies it as solution, removes 2 random cells for the question.
     * @param level - The difficulty level (number of cells to remove).
     * @returns An object with 'solution' (full grid) and 'question' (puzzle with cells removed).
     */
    sudokuGen = (level: any) => {
        const sudoku = this.newGrid(CONSTANT_GAME.GRID_SIZE);

        const check = this.sudokuCreate(sudoku);

        const sudokuSolution = new Array(CONSTANT_GAME.GRID_SIZE);

        let res: SudokuGeneration = {
            solution: [],
            question: []
        };
        // Create empty array for solution
        for (var i = 0; i < CONSTANT_GAME.GRID_SIZE; i++) {
            sudokuSolution[i] = new Array(CONSTANT_GAME.GRID_SIZE);
        }

        // Populate solution array
        for (var row = 0; row < CONSTANT_GAME.GRID_SIZE; row++) {
            for (var col = 0; col < CONSTANT_GAME.GRID_SIZE; col++) {
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