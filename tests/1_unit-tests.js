const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver()

const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
const unsolvablePuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.35.';
const invalidCharPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3b.';
const invalidLengthPuzzle = '1.5..2.84..63.12.7.2..5.....9..1.'

suite('Unit Tests', () => {
  suite('Solver.validate()', () => {
    test('(U_1)a valid puzzle', (done) => {
      const input = validPuzzle
      const result = solver.validate(input)
      const expected = true
      assert.equal(expected, result)
      done()
    })
    test('(U_2)puzzle with invalid char', (done) => {
      const input = invalidCharPuzzle
      const result = solver.validate(input)
      const expected = { error: 'Invalid characters in puzzle' }
      assert.deepEqual(expected, result)
      done()
    })
    test('(U_3)an invalid string that is not 81 characters', (done) => {
      const input = invalidLengthPuzzle
      const result = solver.validate(input)
      const expected = { error: 'Expected puzzle to be 81 characters long' }
      assert.deepEqual(expected, result)
      done()
    })
  })
  suite('Solver.CheckRowPlacement()', () => {
     const input = solver.stringToSudokuBoard(validPuzzle)
    test('(U_4)check valid row placement', (done) => {
      const result = solver.checkRowPlacement(input, 1, 4)
      const expected = true
      assert.equal(result, expected)
      done()
    })
    test('(U_5)check invalid row placement', (done) => {
      const result = solver.checkRowPlacement(input, 1, 2)
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })
  suite('Solver.checkColPlacement', () => {
     const input = solver.stringToSudokuBoard(validPuzzle)
    test('(U_6)check valid col placement', (done) => {
      const result = solver.checkColPlacement(input, 1, 4)
      const expected = true
      assert.equal(result, expected)
      done()
    })
    test('(U_7)check invalid col placement', (done) => {
      const result = solver.checkColPlacement(input, 1, 2)
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })

  suite('Solver.checkRegionPlacement', () => {
     const input = solver.stringToSudokuBoard(validPuzzle)
    test('(U_8)check valid region placement', (done) => {
      const result = solver.checkRegionPlacement(input, 1, 1, 4)
      const expected = true
      assert.equal(result, expected)
      done()
    })
    test('(U_9)check invalid region placement', (done) => {
      const result = solver.checkRegionPlacement(input, 1, 1, 5)
      const expected = false
      assert.equal(result, expected)
      done()
    })
  })
  suite('Solver.solve()', () => {
    test('(U_10)solver a valid puzzle', (done) => {
      const result = solver.solveSudoku(validPuzzle)
      const expected = solution
      assert.deepEqual(result, expected)
      done()
    })
    test('(U_11)solver fails an invalid puzzle', (done) => {
      // Invalid puzzle strings fail the solver
      const result = solver.solveSudoku(unsolvablePuzzle)
      const expected = { error: 'Puzzle cannot be solved' }
      assert.deepEqual(result, expected)
      done()
    })
    test('solver a valid puzzle', (done) => {
      const input = validPuzzle
      const result = solver.solveSudoku(input)
      const expected = solution
      assert.deepEqual(result, expected)
      done()
    })
  })
});
