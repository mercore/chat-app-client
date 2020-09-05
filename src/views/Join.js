import React, { useState } from 'react';

const Join = ({ history }) => {

  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleChange = e => {
    setName(e.target.value)
    setError(false)
  }

  const handleSubmit = e => {
    e.preventDefault()
    
    if(name) {
      history.push(`/chat?name=${ name }`)
    } else {
      setError(true)
    }
  }

  return (
    <div className="join">
      <div className="container small">
        <div className="container inner">
          <h3>Enter your name to join</h3>
          <form onSubmit={ e => handleSubmit(e) }>
            <div className={ error ? 'input-field error' : 'input-field' }>
              <input type="text" placeholder="Name" onChange={ e => handleChange(e) } />
            </div>
            <button type="submit" className="button">Enter</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Join