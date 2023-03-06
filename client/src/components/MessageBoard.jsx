import PropTypes from 'prop-types'
import React from 'react'

const MessageBoard = ({ children, tick, bold }) => {
  let style = 'message '
  style += bold && 'bold '
  return (
    <div className="message-board">
      {children.map((message, idx) => {
        return (
          message && (
            <p key={idx} className={style}>
              {tick && '-'} {message}
            </p>
          )
        )
      })}
    </div>
  )
}
MessageBoard.propTypes = {
  children: PropTypes.array,
  tick: PropTypes.bool,
  bold: PropTypes.bool,
}
export default MessageBoard
