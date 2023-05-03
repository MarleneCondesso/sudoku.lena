

export class GridNavigation {

   //CHECK VALUE ROW BY ROW
   equals = (gridRow: any, sudokuSolutionRow: any) =>
      gridRow.length === sudokuSolutionRow.length &&
      gridRow.every((value: any, i: any) => value === sudokuSolutionRow[i]);

}