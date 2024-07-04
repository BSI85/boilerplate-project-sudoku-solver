"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coordinate = req.body.coordinate;
    const value = req.body.value;
    if(!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }
    const valid = solver.checkPlacement(puzzle, coordinate, value);
    /*if (valid.error) {
      return res.json(valid);
    }*/
    return res.json(valid);
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    const solution = solver.solveSudoku(puzzle);
    if (solution.error) {
      return res.json(solution);
    }
    return res.json({solution});
  });
};
