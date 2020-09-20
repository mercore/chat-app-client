import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Join from './views/Join';
import Chat from './views/Chat';
import io from 'socket.io-client';
import config from './utils/config';

var socket

const App = () => {

  // this emit is just to wakeup server on heroku
  useEffect(() => {
    socket = io(config.SERVER)
    socket.emit('start-server')
    socket.on('start-server', () => {
      console.log('Starting server...')
    })
  })

  return (
    <BrowserRouter>
      <Route path="/" exact component={ Join } />
      <Route path="/chat" component={ Chat } />
    </BrowserRouter>
  )
}

export default App