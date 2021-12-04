const fs = require('fs')

// #region UTILS

const readAndRun = (name, file, runs) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let res = data.split('\r\n')
    runs.forEach(run => {
      res = run(res)
    })
    console.log(`${name.padEnd(20, ' ')}:: ${res}`)
  })
}

const parser = data => {
  const randomNums = data[0].split(',')
  const boards = {}
  data.shift()
  let boardCount = 0
  while (data.length > 0) {
    data.shift()
    boards[boardCount++] = new Board(data.splice(0, 5))
  }
  return [randomNums, boards]
}

// #endregion

// #region PART 1
class Cell {
  constructor(value) {
    this.value = value
    this.marked = false
  }
}

class Board {
  constructor(rows) {
    this.board = new Array(5).fill().map(() => new Array(5))
    this.boardVal = {}
    rows.forEach((row, i) => {
      row = row.trim()
      row = row.split(/\s+/)
      row.forEach((v, j) => {
        this.board[i][j] = new Cell(v)
        this.boardVal[v] = { i, j }
      })
    })
  }

  play(v) {
    if (this.boardVal[v]) {
      const { i, j } = this.boardVal[v]
      this.board[i][j].marked = true
    }
    return this.check()
  }

  check() {
    for (let i = 0; i < 5; i++) {
      let j = 0
      for (; j < 5 && this.board[i][j].marked; j++) { }
      if (j === 5) {
        return true
      }
    }

    for (let i = 0; i < 5; i++) {
      let j = 0
      for (; j < 5 && this.board[j][i].marked; j++) { }
      if (j === 5) {
        return true
      }
    }

    return false
  }

  compute(lastVal) {
    let sum = 0
    this.board.forEach(row => {
      row.forEach(cell => {
        if (!cell.marked) {
          sum += parseInt(cell.value)
        }
      })
    })
    return sum * parseInt(lastVal)
  }
}

const bingo = ([inputs, boards]) => {
  let winner, lastVal
  let keys = Object.keys(boards)
  for (let i = 0; i < inputs.length && !winner; i++) {
    lastVal = inputs[i]
    for (let j = 0; j < keys.length; j++) {
      const board = boards[keys[j]]
      if (board.play(lastVal)) {
        winner = board
        break
      }
    }
  }
  return winner.compute(lastVal)
}

readAndRun('part1 - test', './input_test.txt', [parser, bingo])
readAndRun('part1 - run', './input.txt', [parser, bingo])

// #endregion

// #region PART 2

const bingoLose = ([inputs, boards]) => {
  let loser, lastVal
  let keys = Object.keys(boards)
  for (let i = 0; i < inputs.length && Object.values(keys).length > 0; i++) {
    lastVal = inputs[i]
    let valToRemove = {}
    for (let j = 0; j < keys.length; j++) {
      const board = boards[keys[j]]
      if (board.play(lastVal)) {
        valToRemove[keys[j]] = true
      }
    }
    if (keys.length === 1) loser = keys[0]
    keys = keys.filter(v => !valToRemove[v])
  }
  return boards[loser].compute(lastVal)
}

readAndRun('part2 - test', './input_test.txt', [parser, bingoLose])
readAndRun('part2 - run', './input.txt', [parser, bingoLose])

// #endregion
