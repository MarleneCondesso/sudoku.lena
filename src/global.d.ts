import { Game } from "./pages/GamePage";
import { SelectedCell } from "./pages/GamePage";
declare global {
    var game: Game = null;
    var selectedCell: SelectedCell = nul;
}