import _ from 'lodash'

const regularAI = (settings = { normalVariation: true, normalAttack: true, shipReveal: true }) => {
  const normalVaritaion = settings.normalVaritaion
  const normalAttack = settings.normalAttack
  const shipReveal = settings.shipReveal

  const priorityOrder = (ships) => {
    const shipToSearch = _(ships)
        .pickBy((val, key) => val != key && val != 0)
        .keys()
        .filter((val, i, arr) => val === _.min(arr))
        .value()

    return _.toInteger(shipToSearch[0])
  }

  const allZeros = (board) => {
    const res = board.reduce((final, column, y) => {
      column.forEach((row, x) => { if (row === 0) final.push([y, x]) })
      return final
    }, [])
    return res
  }

  const randomCoordinate = (shipSize, board, normalVariation = true) => {
    let eligible = allZeros(board)
    let location = _.shuffle(eligible).pop()
    let nc = neighboringSpace(location[0], location[1], board)
    let hSpace = nc[0] + nc[1]
    let vSpace = nc[2] + nc[3]

    while (hSpace < shipSize - 1 && vSpace < shipSize - 1 && eligible.length) {
      eligible = _.reject(eligible, location)
      location = _.shuffle(eligible).pop()
      nc = neighboringSpace(location[0], location[1], board)
      hSpace = nc[0] + nc[1]
      vSpace = nc[2] + nc[3]
    }
    return [location, nc]
  }

  const surroundingCells = (y, x, board) => {
    let sc = { left:'', right: '', above: '', below: '' }
    sc.left = x > 0 ? board[y][x - 1] : null
    sc.right = x < 9 ? board[y][x + 1] : null
    sc.above = y > 0 ? board[y - 1][x] : null
    sc.below = y < 9 ? board[y + 1][x] : null
    return sc
  }

  const neighboringSpace = (y, x, board) => {
    let spaceLeft = 0
    let spaceAbove = 0
    let spaceRight = 0
    let spaceBelow = 0

    for (let i = x - 1; i >= 0 && board[y][i] === 0; i--) {
      spaceLeft++
    }

    for (let i = x + 1; i <= board.length - 1 && board[y][i] === 0; i++) {
      spaceRight++
    }

    for (let i = y - 1; i >= 0 && board[i][x] === 0; i--) {
      spaceAbove++
    }

    for (let i = y + 1; i <= board.length - 1 && board[i][x] === 0; i++) {
      spaceBelow++
    }

    return [spaceLeft, spaceRight, spaceAbove, spaceBelow]
  }

  return {
    initialBoard: (ships = [5, 4, 3, 2, 1]) => {
      let workingBoard = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

      const shipPlacement = (shipSize, board) => {
        const rc = randomCoordinate(shipSize, board)
        const coordinates = rc[0]
        const y = coordinates[0]
        const x = coordinates[1]
        const nc = rc[1]
        const hSpace = nc[0] + nc[1]
        const vSpace = nc[2] + nc[3]
        let direction

        if (board[y][x] === 0 && shipSize === 1) { board[y][x] = shipSize; return board }
        if (hSpace >= shipSize - 1 && vSpace >= shipSize - 1) {
          direction = _.sample(['VERTICAL', 'HORIZONTAL'])
        } else if (hSpace >= shipSize - 1) {
          direction = 'HORIZONTAL'
        } else if (vSpace >= shipSize - 1) {
          direction = 'VERTICAL'
        }
        if (direction === 'HORIZONTAL') {
          let spaceLeft = nc[0]
          let spaceRight = nc[1]

          if (spaceLeft === 0) {
            for (let i = x; i < x + shipSize; i++) {
              board[y][i] = shipSize
              spaceRight--
            }
          } else if (spaceRight === 0) {
            for (let i = x; i > x - shipSize; i--) {
              board[y][i] = shipSize
              spaceLeft--
            }
          } else {
            board[y][x] = shipSize
            let counter = shipSize - 1
            let fromLeft = 0
            let fromRight = 0

            while (counter--) {
              if (spaceLeft && spaceRight) {
                if (_.sample([0, 1])) {
                  board[y][x - 1 - fromLeft] = shipSize
                  fromLeft++
                  spaceLeft--
                } else {
                  board[y][x + 1 + fromRight] = shipSize
                  fromRight++
                  spaceRight--
                }
              } else if (spaceLeft) {
                board[y][x - 1 - fromLeft] = shipSize
                fromLeft++
                spaceLeft--
              } else if (spaceRight) {
                board[y][x + 1 + fromRight] = shipSize
                fromRight++
                spaceRight--
              }
            }
          }
        } else if (direction === 'VERTICAL') {
          let spaceAbove = nc[2]
          let spaceBelow = nc[3]

          if (spaceAbove === 0) {
            for (let i = y; i < y + shipSize; i++) {
              board[i][x] = shipSize
            }
          } else if (spaceBelow === 0) {
            for (let i = y; i > y - shipSize; i--) {
              board[i][x] = shipSize
            }
          } else {
            board[y][x] = shipSize
            let count = shipSize - 1
            let fromAbove = 0
            let fromBelow = 0

            while (count--) {
              if (spaceAbove && spaceBelow) {
                if (_.sample([0, 1])) {
                  board[y - 1 - fromAbove][x] = shipSize
                  fromAbove++
                  spaceAbove--
                } else {
                  board[y + 1 + fromBelow][x] = shipSize
                  fromBelow++
                  spaceBelow--
                }
              } else if (spaceAbove) {
                board[y - 1 - fromAbove][x] = shipSize
                fromAbove++
                spaceAbove--
              } else if (spaceBelow) {
                board[y + 1 + fromBelow][x] = shipSize
                fromBelow++
                spaceBelow--
              }
            }
          }
        }
        return board
      }

      ships.forEach((shipSize) => {
        shipPlacement(shipSize, workingBoard)
      })

      return workingBoard
    },

    makeGuess: (targetingBoard, ships = { 5:5, 4:4, 3:3, 2:2, 1:1 }) => {
      const shipToSearch = priorityOrder(ships)
      let board = targetingBoard.slice()
      if (!shipToSearch) {
        const guess = _.shuffle(allZeros(targetingBoard)).pop()
        board[guess[0]][guess[1]] = 'X'
        return board
      }
    }
  }
}

let wb = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

console.log(regularAI().makeGuess(wb))

