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

const parser = data => data.map(report => report.split(''))

const runWithClass = (cls, data) => {
  cls.compute(data)
  return cls.mult()
}

// #endregion

// #region PART 1

class DiagnosticReport {
  constructor() {
    this.values = new Array(2).fill(0)
  }
  count(data) {
    const count = new Array(data[0].length).fill().map(Object)
    data.forEach(report => {
      report.forEach((bit, i) => {
        count[i][bit] = (count[i][bit] || 0) + 1
      })
    })
    return count
  }
  compute(data) {
    this.define(this.count(data))
  }
  define(count) {
    let gammaBits = '', epsilonBits = ''
    count.forEach(report => {
      if (report['0'] > report['1']) {
        gammaBits += '0'
        epsilonBits += '1'
      } else {
        gammaBits += '1'
        epsilonBits += '0'
      }
    })
    this.values = [parseInt(gammaBits, 2), parseInt(epsilonBits, 2)]
  }
  mult() {
    return this.values[0] * this.values[1]
  }
}

const report = (data) => runWithClass(new DiagnosticReport(), data)

readAndRun('part1 - test', './input_test.txt', [parser, report])
readAndRun('part1 - run', './input.txt', [parser, report])

// #endregion

// #region PART 2

class DiagnosticReportOC extends DiagnosticReport {
  constructor() {
    super()
  }
  compute(data) {
    let res = data
    // find oxygen bits
    for (let step = 0; res.length > 1; step++) {
      const count = this.count(res)
      res = res.filter(v => v[step] === (count[step]['1'] >= count[step]['0'] ? '1' : '0'))
    }
    let oxygenBits = res[0]

    res = data
    // find carbon bits
    for (let step = 0; res.length > 1; step++) {
      const count = this.count(res)
      res = res.filter(v => v[step] === (count[step]['1'] >= count[step]['0'] ? '0' : '1'))
    }
    let carbonBits = res[0]
    this.define(oxygenBits.join(''), carbonBits.join(''))
  }
  define(oxygenBits, carbonBits) {
    this.values = [parseInt(oxygenBits, 2), parseInt(carbonBits, 2)]
  }
}

const reportOC = (data) => runWithClass(new DiagnosticReportOC(), data)

readAndRun('part2 - test', './input_test.txt', [parser, reportOC])
readAndRun('part2 - run', './input.txt', [parser, reportOC])

// #endregion
