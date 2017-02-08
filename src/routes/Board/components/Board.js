import React from 'react'
import './Board.scss'

export const Board = (props) => {
  const gameBoard = props.board.map((column, y) => {
    let rows = column.map((cell, i) => {
      if (cell === 0) {
        return (<div key={i} className='cell eligible-cell'></div>)
      } else if (cell === 'X') {
        return (<div key={i} className='cell missed-cell' />)
      } else if (typeof cell === 'number') {
        return (<div key={i} className='cell hit-cell' />)
      }
    })
    return (<div key={y}>{rows}</div>)
  })

  return (
    <div style={{ margin: '0 auto' }} className='board-wrapper' >
      {gameBoard}
    </div>
  )
}

export default Board
