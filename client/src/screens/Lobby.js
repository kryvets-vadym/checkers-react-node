import React, { useContext, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'

import { Context as ConnectionContext } from '../Context/ConnectionContext'

const Lobby = () => {
  const [name, setUsername] = useState('')

  const {
    state: { username, roomId },
    createRoom,
    joinRoom,
  } = useContext(ConnectionContext)

  const submitHandler = (e) => {
    e.preventDefault()
    if (!roomid) {
      createRoom(name)
    } else {
      joinRoom(name, roomid)
    }
  }

  const { roomid } = useParams()

  return (
    <>
      {username ? (
        <Redirect to={`/room/${roomId}`} />
      ) : (
        <form className="form" onSubmit={submitHandler}>
          <div>
            <h1>Ready to play?</h1>
          </div>

          <div>
            <label htmlFor="username">Username: </label>
            <input
              id="username"
              placeholder="Enter username"
              required
              value={name}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div>
            <button
              className={name.length > 0 ? 'primary' : 'disabled'}
              type="submit"
            >
              {roomid ? 'Join Room' : 'Create Room'}
            </button>
          </div>
          <div></div>
        </form>
      )}
    </>
  )
}

export default Lobby
