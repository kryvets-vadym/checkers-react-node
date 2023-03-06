import io from 'socket.io-client'

const socket = io()

socket.on('create-new-room', (roomId) => {
  console.log(
    `New game room created, room Id: ${roomId}`
  );
})

export const onOpponentJoined = (data, action) => {
  socket.on('opponent-join-room', ({ roomId, username }) => {
    socket.emit('send-to-opponent', data)
    action({ opponentName: username })

  })
}

export const onReceiveOpponentName = (action) => {
  socket.on('receive-opponent-name', (username) => {
    action({ opponentName: username })
  })
}

export const createNewRoom = (roomId) => {
  socket.emit('create-new-room', roomId)
}

export const joinRoom = (roomId, username, isPlayer1) => {
  const data = {
    roomId,
    username,
    isPlayer1,
  }
  socket.emit('player-join-room', data)
}

export const onUpdateStatus = (action) => {
  socket.on('status', (status) => {
    action({ status })
  })
}

export const onGameStarted = (action) => {
  socket.on('start', (board) => {
    action(board)
  })
}

export const onPartMove = (action) => {
  socket.on('part-move', (newBoard) => {
    action({ board: newBoard })
  })
}

export const onPlayerMove = (action) => {
  socket.on('player-move', (newboard) => {
    action(newboard)
  })
}

export const move = (move) => {
  socket.emit('move', move)
}

export const partMove = (move) => {
  socket.emit('part-move', move)
}

export const gameOver = (roomId) => {
  socket.emit('game-over', roomId)
}

export const onGameOver = (action) => {
  socket.on('game-over', () => {
    action()
  })
}

export const onPlayerDisconnect = (action) => {
  socket.on('player-disconnect', () => {
    action()
  })
}

export const restartGame = (roomId) => {
  socket.emit('restart-game', roomId)
}

export const removeAllListeners = () => {
  socket.removeAllListeners()
}
