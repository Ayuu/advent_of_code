
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

const intParser = data => data.map(depth => parseInt(depth))

// #endregion

// #region PART 1

const countDepthIncreases = (data) => {
  let last = undefined
  let count = 0
  data.forEach(depth => {
    if (last && depth > last) count++
    last = depth
  })
  return count
}

readAndRun('part1 - test', './input_test.txt', [intParser, countDepthIncreases])
readAndRun('part1 - run', './input.txt', [intParser, countDepthIncreases])

// #endregion

// #region PART 2

const three_sum = (data) => {
  let res = []
  if (data.length < 3) return res
  for (let i = 2; i < data.length; i++) {
    res.push(data[i] + data[i - 1] + data[i - 2])
  }
  return res
}

readAndRun('part2 - test', './input_test.txt', [intParser, three_sum, countDepthIncreases])
readAndRun('part2 - run', './input.txt', [intParser, three_sum, countDepthIncreases])

// #endregion
