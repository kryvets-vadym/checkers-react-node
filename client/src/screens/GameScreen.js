import React, { useContext, useEffect } from 'react'
import { gameRules, handleClickMove } from '../code/GameLogic'
import {
  joinRoom,
  move,
  onGameOver,
  onGameStarted,
  onOpponentJoined,
  onPartMove,
  onPlayerDisconnect,
  onPlayerMove,
  onReceiveOpponentName,
  onUpdateStatus,
  partMove,
  removeAllListeners,
  restartGame,
} from '../connection/socket'

import Board from '../components/Board'
import { Context as ConnectionContext } from '../Context/ConnectionContext'
import { Context as GameContext } from '../Context/GameContext'
import { Link } from 'react-router-dom'
import MessageBoard from '../components/MessageBoard'

const GameScreen = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

  const {
    state: { username, roomId, isPlayer1, status, opponentName },
    updateConnData,
  } = useContext(ConnectionContext)

  const {
    state: {
      isGameStarted,
      board,
      isMyTurn,
      eatenSize,
      selectedPiece,
      maxEatingPossible,
      isGameOver,
      moveMessage,
      isWon,
    },
    startGame,
    playerMove,
    setGameOver,
    updateData,
  } = useContext(GameContext)

  const handleNewRoomClick = () => {
    updateConnData({ isPlayer1: false, username: '', roomId: '', status: '' })
    updateData({ isGameStarted: false })
  }

  const opponentDisconnect = () => {
    updateData({ isGameStarted: false })
    updateConnData({ isPlayer1: true })
  }

  useEffect(() => {
    joinRoom(roomId, username, isPlayer1)
    onOpponentJoined({ username, roomId }, updateConnData)

    onReceiveOpponentName(updateConnData)

    return () => {
      removeAllListeners()
    }
  }, [isPlayer1, roomId, username])

  useEffect(() => {
    onUpdateStatus(updateConnData)

    onGameStarted((initBoard) => {
      startGame({ board: initBoard, isMyTurn: isPlayer1 })
    })

    onPartMove(updateData)

    onPlayerMove((board) => playerMove(board, isPlayer1, roomId))

    onPlayerDisconnect(opponentDisconnect)

    onGameOver(() => setGameOver({ isWon: true }))
  }, [isPlayer1])

  const handleClick = (i, j) => {
    if (board[i][j].isValid && isMyTurn) {
      if (board[i][j].player === 1 && isPlayer1 && !eatenSize) {
        updateData({ selectedPiece: { i, j } })
      } else if (board[i][j].player === 2 && !isPlayer1 && !eatenSize) {
        updateData({ selectedPiece: { i, j } })
      } else if (board[i][j].player === 0 && selectedPiece) {
        let isBoardChange = false
        let newBoard = []
        let tempEatenSize = eatenSize
        const res = handleClickMove(
          board,
          selectedPiece,
          { i, j },
          isPlayer1,
          tempEatenSize,
          maxEatingPossible
        )
        updateData({ eatenSize: res.eatenSize })
        isBoardChange = res.isBoardChange
        newBoard = res.newBoard

        if (isBoardChange) {
          updateData({ board: newBoard })
          updateData({ moveMessage: '' })

          if (res.eatenSize !== maxEatingPossible) {
            partMove({ roomId, board: newBoard })

            updateData({ selectedPiece: { i, j } })
          } else {
            move({ roomId, board: newBoard, isPlayer1 })
            updateData({ isMyTurn: false })
            updateData({ selectedPiece: null })
          }
        } else {
          if (res.isValid) {
            updateData({
              moveMessage: 'You must capture as much pieces as possible!',
            })
          } else {
            updateData({ moveMessage: 'Not a valid move.' })
          }
        }
      }
    }
  }

  return (
    <div className="app-container">
      <MessageBoard tick bold>
        {status === 'full' || status === 'not exists'
          ? [
              status === 'full'
                ? 'Room is full, try again later'
                : 'Room with this id does not exist',
              <Link to="/">
                <button className="primary" onClick={handleNewRoomClick}>
                  Create New Room
                </button>
              </Link>,
            ]
          : [
              <>
                <span>Hello</span>{' '}
                <span style={{ color: 'blue' }}>{username}</span>
              </>,

              isGameStarted && (
                <>
                  <span>Opponent's name: </span>{' '}
                  <span style={{ color: 'red' }}>{opponentName}</span>
                </>
              ),
              isPlayer1 ? 'You are the Red player' : 'You are the White player',
              isGameStarted
                ? !isGameOver &&
                  (isMyTurn ? "It's your turn" : "Opponent's turn...")
                : 'Waiting for a second player...',

              moveMessage && (
                <span style={{ color: 'red' }}>{moveMessage}</span>
              ),

              isGameOver &&
                (isWon ? (
                  <span style={{ color: 'Green' }}>You Won!</span>
                ) : (
                  <span style={{ color: 'Red' }}>You Lost!</span>
                )),
              isGameOver && (
                <button className="primary" onClick={() => restartGame(roomId)}>
                  Restart Game
                </button>
              ),
            ]}
      </MessageBoard>

      {status !== 'full' &&
        status !== 'not exists' &&
        (isGameStarted ? (
          <Board
            squares={board}
            onClick={handleClick}
            selectedPiece={selectedPiece}
          />
        ) : (
          <div className="link">
            <h2>
              Hi {username}! copy and paste the URL below to send to your
              friend:
            </h2>
            <textarea
              onFocus={(event) => {
                event.target.select()
              }}
              defaultValue={`${BASE_URL}/#/room/${roomId}`}
              type="text"
            ></textarea>
          </div>
        ))}
      <MessageBoard>{gameRules}</MessageBoard>
    </div>
  )
}

export default GameScreen
