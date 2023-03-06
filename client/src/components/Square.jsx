import Piece from './Piece'
import PropTypes from 'prop-types'
import React from 'react'

const Square = ({ square, onClick, isSelected }) => {
  let style = square.isValid ? `square valid` : 'square'
  return (
    <div className={style} onClick={onClick}>
      {square.player !== 0 && <Piece piece={square} isSelected={isSelected} />}
    </div>
  )
}
Piece.propTypes = {
  square: PropTypes.object,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
}
export default Square
