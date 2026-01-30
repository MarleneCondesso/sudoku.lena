
/**
 * Game constants used throughout the Sudoku application.
 * Defines grid properties, difficulty levels, and UI elements.
 */
export const CONSTANT_GAME = {
    UNASSIGNED: 0, // Represents an empty cell in the Sudoku grid
    GRID_SIZE: 9, // Standard 9x9 Sudoku grid
    BOX_SIZE: 3, // Size of each 3x3 subgrid
    NUMBERS: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Valid numbers for Sudoku
    LEVEL_NAME: ["Easy", "Medium", "Hard", "Expert"], // Human-readable level names
    LEVEL: [2, 38, 47, 56], // Number of pre-filled cells for each difficulty level
};

/**
 * Constants for border types in the UI.
 * Used to indicate normal or error states for cell borders.
 */
export const CONSTANT_TYPE_BORDER = {
    normalBorder: 0, // Default border style
    errorBorder: 1 // Border style for incorrect inputs
}
