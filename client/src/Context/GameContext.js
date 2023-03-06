import { checkAvailableMoves } from '../code/GameLogic'
import createDataContext from './createDataContext'
import { gameOver } from '../connection/socket'

const initialState = {
  isGameStarted: false,
  board: [],
  isMyTurn: false,
  maxEatingPossible: 0,
  eatenSize: 0,
  moveMessage: '',
  isWon: false,
  isGameOver: false,
  selectedPiece: null,
}

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'start_game':
      return { ...state, ...action.payload }
    case 'update_data':
      return { ...state, ...action.payload }
    case 'player_move':
      return { ...state, ...action.payload }
    case 'game_over':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const startGame =
  (dispatch) =>
  async ({ board, isMyTurn }) => {
    try {
      const initGameData = {
        board,
        isGameStarted: true,
        isMyTurn,
        maxEatingPossible: 0,
        eatenSize: 0,
        moveMessage: '',
        isWon: false,
        isGameOver: false,
        selectedPiece: null,
      }
      dispatch({ type: 'start_game', payload: initGameData })
    } catch (error) {
      alert(error.message)
    }
  }

const updateData = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'update_data', payload: { ...data } })
  } catch (error) {
    alert(error.message)
  }
}

const playerMove = (dispatch) => async (board, isPlayer1, roomId) => {
  try {
    dispatch({ type: 'player_move', payload: { board, isMyTurn: true } })
    let boardDuplicate = board.map((row, i) =>
      row.map((square, j) => Object.assign({}, square))
    )
    const res = checkAvailableMoves(boardDuplicate, isPlayer1)
    dispatch({
      type: 'update_data',
      payload: { maxEatingPossible: res.maxEatingSizeGlobal },
    })
    if (!res.isLeftMoves) {
      dispatch({
        type: 'game_over',
        payload: { isGameOver: true, isWon: false },
      })
      gameOver(roomId)
    }
    dispatch({ type: 'update_data', payload: { eatenSize: 0 } })
  } catch (error) {
    alert(error.message)
  }
}

const setGameOver =
  (dispatch) =>
  async ({ isWon }) => {
    try {
      dispatch({ type: 'game_over', payload: { isGameOver: true, isWon } })
    } catch (error) {
      alert(error.message)
    }
  }

export const { Provider, Context } = createDataContext(
  gameReducer,
  {
    startGame,
    playerMove,
    setGameOver,
    updateData,
  },
  initialState
)
