import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import config from '../utils/config';
import ScrollToBottom from 'react-scroll-to-bottom';
import ReactEmoji from 'react-emoji';

var socket, timer

const Chat = ({ location }) => {

  const [typing, setTyping] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // get name from query param
  useEffect(() => {
    const { name } = queryString.parse(location.search)
    setName(name)

    socket = io(config.SERVER);
    socket.emit('join', name)

    // componentdidunmount leave chat
    return () => {
      socket.emit('leave', name)
    }
  }, [location.search])

  // when receive message, add it to messages state
  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message])
    })
    setTyping('')
  }, [messages])

  // show / hide typing message
  useEffect(() => {
    socket.on('typing', message => {
      setTyping(message)
    })

    socket.on('removeTyping', () => {
      setTyping('')
    })
  }, [typing])

  // before refresh page, remove user
  window.onbeforeunload = () => {
    socket.emit('leave', name)
  }

  // when start typing emit typing message
  window.onkeypress = () => {
    clearTimeout(timer)
    socket.emit('typing', name)
  }

  // when message is deleted from input then remove typing message
  window.onkeyup = e => {
    if(e.key === 'Backspace' && !message) {
      socket.emit('removeTyping')
    }
  }

  // send message
  const handleSendMessage = e => {
    e.preventDefault()

    if(message) {
      socket.emit('removeTyping')
      socket.emit('sendMessage', { name, message })
      setMessage('')
    }
  }

  return (
    <div className="chat">
      <div className="container">
        <div className="content">
          <div className="info-bar">
            <h3>Chat App</h3>
            <a href="/">&times;</a>
          </div>
          <ScrollToBottom className="messages-container">
            <div className="messages">
              {
                messages.length ?
                  messages.map((message, id) => (
                    <div key={ id } className={ message.user === name ? 'message right' : message.user === 'admin' ? 'message center' : 'message left' }>
                      {
                        message.user === 'admin' ?
                          <div className="message-inner">
                            <p className="message-admin">{ message.text }</p>
                          </div>
                        :
                          <div className="message-inner">
                            <p className="message-user">{ message.user }</p>
                            <p className="message-text">{ ReactEmoji.emojify(message.text) }</p>
                          </div>
                      }
                    </div>
                  ))
                :
                  null
              }
              {
                typing ? 
                  <p className="message-typing">{ typing }</p>
                :
                  null
              }
            </div>
          </ScrollToBottom>
          <form onSubmit={ e => handleSendMessage(e) }>
            <div className="input-field">
              <input type="text" value={ message } onChange={ e => setMessage(e.target.value) } />
              <button type="submit" className="button">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat