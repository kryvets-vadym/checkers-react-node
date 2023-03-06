import createDataContext from './createDataContext'
import { createNewRoom } from '../connection/socket'
import { v4 as uuid } from 'uuid'

const initialState = {
  username: '',
  roomId: '',
  isPlayer1: false,
  status: '',
  opponentName: '',
}

const connReducer = (state, action) => {
  switch (action.type) {
    case 'set_connection_info':
      return { ...state, ...action.payload }
    case 'set_status':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const createRoom = (dispatch) => async (username) => {
  try {
    const roomId = uuid()
    dispatch({
      type: 'set_connection_info',
      payload: { username, roomId, isPlayer1: true },
    })

    createNewRoom(roomId)
  } catch (error) {
    alert(error.message)
  }
}

const joinRoom = (dispatch) => async (username, roomid) => {
  try {
    dispatch({
      type: 'set_connection_info',
      payload: { username, roomId: roomid, isPlayer1: false },
    })
  } catch (error) {
    alert(error.message)
  }
}

const updateConnData = (dispatch) => async (data) => {
  try {
    dispatch({ type: 'set_status', payload: { ...data } })
  } catch (error) {
    alert(error.message)
  }
}

export const { Provider, Context } = createDataContext(
  connReducer,
  {
    createRoom,
    joinRoom,
    updateConnData,
  },
  initialState
)
