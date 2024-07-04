class SudokuSolver {
  validate(puzzleString) {
    let regex = /^[1-9\.]*$/;
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (!regex.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  // принимает строку cудоку и преобразует её в двумерный массив
  stringToSudokuBoard(str) {
    let board = [];
    let row = [];
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ".") {
        row.push(0);
      } else {
        row.push(parseInt(str[i]));
      }
      if ((i + 1) % 9 === 0) {
        board.push(row);
        row = [];
      }
    }
    return board;
  }
  //Рекурсивная функция, которая пытается заполнить доску
  solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(board, row, col, num)) {
              board[row][col] = num;
              if (this.solve(board)) {
                return true;
              } else {
                board[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  //Проверяет, можно ли поставить число num в ячейку (row, col)
  isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (
        board[row][i] === num ||
        board[i][col] === num ||
        board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
          Math.floor(col / 3) * 3 + (i % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  }
  //Главная функция
  solveSudoku(puzzleString) {
    if (this.validate(puzzleString) !== true) {
      return this.validate(puzzleString);
    }
    let board = this.stringToSudokuBoard(puzzleString);
    if (this.solve(board)) {
      return board.flat().join("");
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }
  /*
/
/
/
*/
  //Проверяет валидность координат
  validateCoordinate(coordinate) {
    let regex = /^[a-iA-I][1-9]$/;
    if (regex.test(coordinate) != true) {
      return { error: "Invalid coordinate" };
    }
    return true;
  }
  //Проверяет валидность значения
  validateValue(value) {
    let regex = /^[1-9]$/;
    if (regex.test(value) != true) {
      return { error: "Invalid value" };
    }
    return true;
  }
  // Проверка строки
  checkRowPlacement(board, row, num) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) {
        return false;
      }
    }
    return true;
  }
  // Проверка столбца
  checkColPlacement(board, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num) {
        return false;
      }
    }
    return true;
  }
  // Проверка блока 3x3
  checkRegionPlacement(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (
        board[row][i] === num ||
        board[i][col] === num ||
        board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
          Math.floor(col / 3) * 3 + (i % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  }

  //Проверяет возможность существования значения по заданным координатам
  checkPlacement(puzzleString, coord, val) {
    
    if (this.validate(puzzleString) !== true) {
      return this.validate(puzzleString);
    }
    if (this.validateCoordinate(coord) !== true) {
      return this.validateCoordinate(coord);
    }
    if (this.validateValue(val) !== true) {
      return this.validateValue(val);
    }
    let board = this.stringToSudokuBoard(puzzleString);
    let row = coord.toUpperCase().charCodeAt(0) - 65;
    let col = parseInt(coord[1]) - 1;
    let num = parseInt(val);
    console.log(typeof num);
    let conflict = [];
    if (this.checkRowPlacement(board, row, num) == false) {
      conflict.push("row");
    }
    if (this.checkColPlacement(board, col, num) == false) {
      conflict.push("column");
    }
    if (this.checkRegionPlacement(board, row, col, num) == false) {
      conflict.push("region");
    }
    if (conflict.length > 0) {
      return { valid: false, conflict: conflict };
    }
    return { valid: true };
  }
}

module.exports = SudokuSolver;
