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
  const board = new Board()
  data.forEach(row => {
    const coords = row.split(' -> ')
    board.addCoords(coords)
  })
  return board
}

// #endregion

// #region PART 1
class Board {
  constructor() {
    this.board = []
    this.segments = []
    this.boardSize = [0, 0]
    this.maxCount = 1
  }

  parseCoord(coord) {
    return coord.split(',').map(v => parseInt(v))
  }

  addCoords(coords) {
    const [coord1, coord2] = coords
    const pc1 = this.parseCoord(coord1)
    const pc2 = this.parseCoord(coord2)

    // set board size
    this.boardSize[0] = Math.max(pc1[0], pc2[0], this.boardSize[0])
    this.boardSize[1] = Math.max(pc1[1], pc2[1], this.boardSize[1])

    this.segments.push([pc1, pc2])
  }

  gt(v) {
    let sum = 0
    this.board.forEach(row => {
      row.forEach(cell => {
        if (cell > v) sum++
      })
    })
    return sum
  }

  buildBoard(handleDiag) {
    this.board = new Array(this.boardSize[1] + 1).fill()
      .map(() => new Array(this.boardSize[0] + 1).fill(0))

    this.segments.forEach(([[x1, y1], [x2, y2]]) => {
      const diffY = Math.abs(y2 - y1)
      const diffX = Math.abs(x2 - x1)
      const minY = Math.min(y1, y2)
      const minX = Math.min(x1, x2)

      if (x1 === x2) {
        const max = minY + diffY + 1
        for (let j = minY; j < max; j++) {
          this.board[j][x1] += 1
        }
      } else if (y1 === y2) {
        const max = minX + diffX + 1
        for (let i = minX; i < max; i++) {
          this.board[y1][i] += 1
        }
      } else if (handleDiag && Math.abs(y2 - y1) / Math.abs(x2 - x1) === 1) {
        for (let i = 0; i <= diffX; i++) {
          this.board[y1 + i * (y1 > y2 ? -1 : 1)][x1 + i * (x1 > x2 ? -1 : 1)] += 1
        }
      }
    })
  }

  printBoard() {
    console.log()
    this.board.forEach(row => {
      let logRow = ''
      row.forEach(col => {
        logRow += !col ? '.'.padStart(this.maxCount, '.') : `${col}`.padStart(this.maxCount, ' ')
      })
      console.log(logRow)
    })
    console.log()
  }
}

const part1 = (board) => {
  board.buildBoard(false)
  return board.gt(1)
}

readAndRun('part1 - test', './input_test.txt', [parser, part1])
readAndRun('part1 - run', './input.txt', [parser, part1])

// #endregion

// #region PART 2

const part2 = (board) => {
  board.buildBoard(true)
  return board.gt(1)
}

readAndRun('part2 - test', './input_test.txt', [parser, part2])
readAndRun('part2 - run', './input.txt', [parser, part2])

// #endregion
