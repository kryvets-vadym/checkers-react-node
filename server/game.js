const boardSize = 8;
let board = [];
class Square {
  player;
  constructor(isValid, player) {
    this.isValid = isValid;
    this.player = player;
    this.isKing = false;
  }
}

export const initializeGame = (io, socket) => {
  let sRoomId;

  socket.on('create-new-room', (roomId) => {
    socket.emit('create-new-room', roomId);
    socket.join(roomId);
  });

  socket.on('player-join-room', (data) => {
    let room = io.sockets.adapter.rooms.get(data.roomId);

    if (room === undefined) {
      socket.emit('status', 'not exists');
      return;
    }
    if (room.size < 2) {
      sRoomId = data.roomId;

      socket.join(data.roomId);

      if (room.size === 2) {
        initBoard();
        io.to(data.roomId).emit('start', board);
      }

      socket.broadcast.to(sRoomId).emit('opponent-join-room', data);
    } else {
      socket.emit('status', 'full');
    }
  });

  socket.on('move', (move) => {
    socket.broadcast.to(move.roomId).emit('player-move', move.board);
  });

  socket.on('part-move', (move) => {
    socket.broadcast.to(move.roomId).emit('part-move', move.board);
  });

  socket.on('send-to-opponent', (data) => {
    socket.broadcast
      .to(data.roomId)
      .emit('receive-opponent-name', data.username);
  });

  socket.on('game-over', (roomId) => {
    socket.broadcast.to(roomId).emit('game-over');
  });

  socket.on('disconnect', (data) => {
    if (sRoomId) {
      socket.broadcast.to(sRoomId).emit('player-disconnect');
    }
  });

  socket.on('restart-game', (roomId) => {
    initBoard();
    io.to(roomId).emit('start', board);
  });
};

const initBoard = () => {
  board = [];
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      if (i % 2 == 0) {
        if (j % 2 !== 0) {
          if (i < 3) {
            board[i][j] = new Square(true, 2);
          } else if (i > boardSize - 4) {
            board[i][j] = new Square(true, 1);
          } else {
            board[i][j] = new Square(true, 0);
          }
        } else {
          board[i][j] = new Square(false, 0);
        }
      } else {
        if (j % 2 == 0) {
          if (i < 3) {
            board[i][j] = new Square(true, 2);
          } else if (i > boardSize - 4) {
            board[i][j] = new Square(true, 1);
          } else {
            board[i][j] = new Square(true, 0);
          }
        } else {
          board[i][j] = new Square(false, 0);
        }
      }
    }
  }
};
