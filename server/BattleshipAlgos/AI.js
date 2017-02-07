const regularAI = (settings = { normalVariation: true, normalAttack: true, shipReveal: true }) => {
  const normalVaritaion = settings.normalVaritaion
  const normalAttack = settings.normalAttack
  const shipReveal = settings.shipReveal

  const allZeros = (board) => {
    let res = board.reduce((final, column, y) => {
      column.forEach((row, x) => { if (row === 0) final.push([y, x]) })
      return final
    }, [])
    return res
  }

  const randomCoordinate = (shipSize, board, normalVariation) => {
      let eligible = allZeros(board)
      let location = eligible[Math.floor(Math.random() * eligible.length)]
      let nc = neighboringSpace(location[0], location[1], board)
      let hSpace = nc[0] + nc[1]
      let vSpace = nc[2] + nc[3]

      while (hSpace < shipSize - 1 && vSpace < shipSize - 1 && eligible.length) {
        eligible.splice(eligible.indexOf(location), 1)
        location = eligible[Math.floor(Math.random() * eligible.length)]
        nc = neighboringSpace(location[0], location[1], board)
        hSpace = nc[0] + nc[1]
        vSpace = nc[2] + nc[3]
      }
      return [location, nc]
    },

    surroundingCells = (y, x, board) => {
      let sc = { left:'', right: '', above: '', below: '' }
      sc.left = x > 0 ? board[y][x - 1] : null
      sc.right = x < 9 ? board[y][x + 1] : null
      sc.above = y > 0 ? board[y - 1][x] : null
      sc.below = y < 9 ? board[y + 1][x] : null
      return sc
    },

    neighboringSpace = (y, x, board) => {
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
    allZeros: (board) => {
      let res = board.reduce((final, column, y) => {
        column.forEach((row, x) => { if (row === 0) final.push([y, x]) })
        return final
      }, [])
      return res
    },
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
        let rc = randomCoordinate(shipSize, board)
        let coordinates = rc[0]
        let y = coordinates[0]
        let x = coordinates[1]
        let nc = rc[1]
        let hSpace = nc[0] + nc[1]
        let vSpace = nc[2] + nc[3]
        let direction

        if (board[y][x] === 0 && shipSize === 1) { board[y][x] = shipSize; return board }
        if (hSpace >= shipSize - 1 && vSpace >= shipSize - 1) {
          direction = Math.floor(Math.random() * 2) === 0 ? 'VERTICAL' : 'HORIZONTAL'
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
                if (Math.floor(Math.random() * 2) === 0) {
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
                if (Math.floor(Math.random() * 2) === 0) {
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
      let shipSizes = Object.keys(ships)
      let shipCount = { ...ships }
      let board = targetingBoard.slice()
      let searching = 0
      let surrounding

      for (let i = 0; i < shipSizes.length; i++) {
        if (shipCount[shipSizes[i]] < shipSizes[i] && shipSizes[i] !== 0) {
          searching = shipSizes[i]
          break
        }
      }

      if (!searching) {
        let eligible = allZeros(board)

        return eligible[Math.floor(Math.random() * eligible.length)]
      } else {
        for (let y = 0; y < board.length; y++) {
          for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === searching) {
              surrounding = surroundingCells(y, x, targetingBoard)
              for (let j = 0; j < Object.keys(surrounding); j++) {
                if (surrounding[Object.keys(surrounding)[j]] === searching) {

                }
              }
            }
          }
        }
      }
    }
  }
}
