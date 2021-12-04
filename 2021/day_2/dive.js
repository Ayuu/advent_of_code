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

const parser = (data) => data.map(actions => {
  const [action, incrValue] = actions.split(' ')
  return [action, parseInt(incrValue)]
})

const runWithClass = (diveClass, data) => {
  data.forEach(([action, incr]) => {
    diveClass[action](incr)
  })
  return diveClass.mult()
}

// #endregion

// #region PART 1

class Dive {
  constructor() {
    this.x = 0
    this.y = 0
  }
  forward(x) {
    this.x += x
  }
  up(y) {
    this.y += y
  }
  down(y) {
    this.y -= y
  }
  mult() {
    return Math.abs(this.x * this.y)
  }
}

const dive = (data) => runWithClass(new Dive(), data)

readAndRun('part1 - test', './input_test.txt', [parser, dive])
readAndRun('part1 - run', './input.txt', [parser, dive])

// #endregion

// #region PART 2

class DiveAndAim extends Dive {
  constructor() {
    super()
    this.aim = 0
  }
  forward(x) {
    this.x += x
    this.y += x * this.aim
  }
  up(aim) {
    this.aim -= aim
  }
  down(aim) {
    this.aim += aim
  }
}

const diveAndAim = (data) => runWithClass(new DiveAndAim(), data)

readAndRun('part2 - test', './input_test.txt', [parser, diveAndAim])
readAndRun('part2 - run', './input.txt', [parser, diveAndAim])

// #endregion