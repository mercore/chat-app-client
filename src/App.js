import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Join from './views/Join';
import Chat from './views/Chat';

const App = () => (
  <BrowserRouter>
    <Route path="/" exact component={ Join } />
    <Route path="/chat" component={ Chat } />
  </BrowserRouter>
)

export default App