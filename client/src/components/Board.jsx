import React from 'react'
import Square from './Square'
import PropTypes from 'prop-types'

const Board = ({ squares, onClick, selectedPiece }) => {
  return (
    <div className="board">
      {squares.map((row, i) =>
        row.map((square, j) => {
          return (
            <Square
              key={`${i}-${j}`}
              square={square}
              isSelected={
                selectedPiece != null &&
                  selectedPiece.i === i &&
                  selectedPiece.j === j
              }
              onClick={() => onClick(i, j)}
            />
          )
        })
      )}
    </div>
  )
}

Board.propTypes = {
  squares: PropTypes.array,
  onClick: PropTypes.func,
  selectedPiece: PropTypes.objectOf(PropTypes.number),
}
export default Board
