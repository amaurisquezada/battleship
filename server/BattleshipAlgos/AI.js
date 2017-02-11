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

  const findIndex = (number, board) => {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board.length; x++) {
        if (board[y][x] === number) return [y, x]
      }
    }
    return null
  }

  const randomCoordinate = (shipSize, board, normalVariation = true) => {
    let eligible = allZeros(board)
    let location = _.shuffle(eligible).pop()
    let hSpace = spaceToLeft(location[0], location[1], board) + spaceToRight(location[0], location[1], board)
    let vSpace = spaceAboveCell(location[0], location[1], board) + spaceBelowCell(location[0], location[1], board)

    while (hSpace < shipSize - 1 && vSpace < shipSize - 1 && eligible.length) {
      eligible = _.reject(eligible, location)
      location = _.shuffle(eligible).pop()
      hSpace = spaceToLeft(location[0], location[1], board) + spaceToRight(location[0], location[1], board)
      vSpace = spaceAboveCell(location[0], location[1], board) + spaceBelowCell(location[0], location[1], board)
    }
    return location
  }

  const surroundingCells = (y, x, board) => {
    let sc = { left:'', right: '', above: '', below: '' }
    sc.left = x > 0 ? board[y][x - 1] : null
    sc.right = x < 9 ? board[y][x + 1] : null
    sc.above = y > 0 ? board[y - 1][x] : null
    sc.below = y < 9 ? board[y + 1][x] : null
    return sc
  }

  const spaceToLeft = (y, x, board) => {
    let spaceLeft = 0
    for (let i = x - 1; i >= 0 && board[y][i] === 0; i--) {
      spaceLeft++
    }
    return spaceLeft
  }

  const spaceToRight = (y, x, board) => {
    let spaceRight = 0
    for (let i = x + 1; i <= board.length - 1 && board[y][i] === 0; i++) {
      spaceRight++
    }
    return spaceRight
  }

  const spaceAboveCell = (y, x, board) => {
    let spaceAbove = 0
    for (let i = y - 1; i >= 0 && board[i][x] === 0; i--) {
      spaceAbove++
    }
    return spaceAbove
  }

  const spaceBelowCell = (y, x, board) => {
    let spaceBelow = 0
    for (let i = y + 1; i <= board.length - 1 && board[i][x] === 0; i++) {
      spaceBelow++
    }
    return spaceBelow
  }

  const trackRight = (number, y, x, board) => {
    let xCoord = x
    let xDrift = 0
    while (board[y][xCoord] === number) {
      if (board[y][xCoord + 1] === number) {
        xDrift++
      }
      xCoord++
    }
    return xDrift
  }

  const trackLeft = (number, y, x, board) => {
    let xCoord = x
    let xDrift = 0
    while (board[y][xCoord] === number && xCoord > 0) {
      if (board[y][xCoord - 1] === number) {
        xDrift++
      }
      xCoord--
    }
    return xDrift
  }

  const trackAbove = (number, y, x, board) => {
    let yCoord = y
    let yDrift = 0
    while (board[yCoord][x] === number && yCoord > 0) {
      if (board[yCoord - 1][x] === number) {
        yDrift++
      }
      yCoord--
    }
    return yDrift
  }

  const trackBelow = (number, y, x, board) => {
    let yCoord = y
    let yDrift = 0
    while (board[yCoord][x] === number && yCoord < board.length - 1) {
      if (board[yCoord + 1][x] === number) {
        yDrift++
      }
      yCoord++
    }
    return yDrift
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
        const coordinates = randomCoordinate(shipSize, board)
        const y = coordinates[0]
        const x = coordinates[1]
        let spaceLeft = spaceToLeft(y, x, board)
        let spaceRight = spaceToRight(y, x, board)
        let spaceAbove = spaceAboveCell(y, x, board)
        let spaceBelow = spaceBelowCell(y, x, board)
        const hSpace = spaceLeft + spaceRight
        const vSpace = spaceAbove + spaceBelow
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
        console.log(guess)
        return board
      } else {
        const index = findIndex(shipToSearch, board)
        const y = index[0]
        const x = index[1]
        const sCells = surroundingCells(y, x, board)
        let direction = null
        let guess = []
        if (sCells.left === shipToSearch || sCells.right === shipToSearch) {
          direction = 'HORIZONTAL'
        } else if (sCells.above === shipToSearch || sCells.below === shipToSearch) {
          direction = 'VERTICAL'
        }
        if (direction === 'HORIZONTAL') {
          let leftDrift = trackLeft(shipToSearch, y, x, board)
          let rightDrift = trackRight(shipToSearch, y, x, board)
          let cellToLeft = leftDrift ? surroundingCells(y, x - leftDrift, board).left : sCells.left
          let cellToRight = rightDrift ? surroundingCells(y, x + rightDrift, board).right : sCells.right
          if (cellToLeft === 0) guess.push([y, (x - leftDrift - 1)])
          if (cellToRight === 0) guess.push([y, (x + rightDrift + 1)])
        } else if (direction === 'VERTICAL') {
          let aboveDrift = trackAbove(shipToSearch, y, x, board)
          let belowDrift = trackBelow(shipToSearch, y, x, board)
          let cellAbove = aboveDrift ? surroundingCells(y - aboveDrift, x, board).above : sCells.above
          let cellBelow = belowDrift ? surroundingCells(y + belowDrift, x, board).below : sCells.below
          if (cellAbove === 0) guess.push([(y - aboveDrift - 1), x])
          if (cellBelow === 0) guess.push([(y + belowDrift + 1), x])
        } else {
          if (sCells.left === 0) guess.push([y, (x - 1)])
          if (sCells.right === 0) guess.push([y, (x + 1)])
          if (sCells.above === 0) guess.push([(y - 1), x])
          if (sCells.below === 0) guess.push([(y + 1), x])
        }
        const guessCoord = _.sample(guess)
        board[guessCoord[0]][guessCoord[1]] = 'X'
        return board
      }
    }
  }
}

// var wb = [
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

// var ships = {5:5, 4:4, 3:3, 2:2, 1:1}
// var fiveShips = [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6]]
// var fourShips = [[6, 9], [7, 9], [8, 9], [9, 9]]
// var threeShips = [[2, 5], [3, 5], [4, 5]]
// var twoShips = [[8, 2], [8, 3]]
// var oneShip = [[2, 7]]
// var counter = 0
// var result

// while((!_.isEmpty(fiveShips)  ||
//        !_.isEmpty(fourShips)  ||
//        !_.isEmpty(threeShips) ||
//        !_.isEmpty(twoShips)   ||
//        !_.isEmpty(oneShip))   &&
//        counter <= 100) {
//   wb = regularAI().makeGuess(wb, ships)
//   console.log(wb, "WB")
//   var guess = (function(){
//     for (var i = 0; i < wb.length; i++){
//       for (var l = 0; l < wb.length; l++){
//         if(wb[i][l] === "X"){
//           return [i, l]
//         }
//       }
//     }
//   })()
//   for (var i = 0; i < fiveShips.length; i++){
//     if (fiveShips[i][0] === guess[0] && fiveShips[i][1] === guess[1]){
//       console.log(wb.length)
//       fiveShips.splice(i, 1)
//       ships["5"]--
//       wb[guess[0]][guess[1]] = 5
//     }
//   }
//   for (var i = 0; i < fourShips.length; i++){
//     if (fourShips[i][0] === guess[0] && fourShips[i][1] === guess[1]){
//       console.log(wb.length)
//       fourShips.splice(i, 1)
//       ships["4"]--
//       wb[guess[0]][guess[1]] = 4
//     }
//   }
//   for (var i = 0; i < threeShips.length; i++){
//     if (threeShips[i][0] === guess[0] && threeShips[i][1] === guess[1]){
//       console.log(wb.length)
//       threeShips.splice(i, 1)
//       ships["3"]--
//       wb[guess[0]][guess[1]] = 3
//     }
//   }
//   for (var i = 0; i < twoShips.length; i++){
//     if (twoShips[i][0] === guess[0] && twoShips[i][1] === guess[1]){
//       console.log(wb.length)
//       twoShips.splice(i, 1)
//       ships["2"]--
//       wb[guess[0]][guess[1]] = 2
//     }
//   }
//   for (var i = 0; i < oneShip.length; i++){
//     if (oneShip[i][0] === guess[0] && oneShip[i][1] === guess[1]){
//       console.log(wb.length)
//       oneShip.splice(i, 1)
//       ships["1"]--
//       wb[guess[0]][guess[1]] = 1
//     }
//   }

//   var dust = wb.map(function(column, y){
//     return (column.map(function(row, x){
//       if (row === "X"){
//         return row = "N"
//       } else {
//         return row
//       }
//     }))
//   })

//   wb = dust

//   counter++

//   console.log(wb, "after guess number " + counter)

// }
