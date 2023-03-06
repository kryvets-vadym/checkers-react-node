import React, { useContext } from 'react'
import { Route, Switch } from 'react-router-dom'

import { Context as ConnectionContext } from './Context/ConnectionContext'
import GameScreen from './screens/GameScreen'
import Lobby from './screens/Lobby'

const App = () => {
  const {
    state: { username },
  } = useContext(ConnectionContext)

  return (
    <div className="app">
      <Switch>
        <Route exact path="/">
          <Lobby />
        </Route>
        <Route path="/room/:roomid" exact>
          {username ? <GameScreen /> : <Lobby />}
        </Route>
      </Switch>
    </div>
  )
}

export default App
