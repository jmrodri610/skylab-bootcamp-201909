import React, { useState, useEffect } from 'react';
import './index.sass'
import Landing from '../Landing'
import Register from '../Register'
import Login from '../Login'
import Board from '../Board'
import { Route, withRouter } from 'react-router-dom'

export default withRouter(function ({history}) {

    function handleGoToRegister () {
        history.push('/register')
    }

    function handleGoToLogin () {
        history.push('/login')
    }

    function handleRegister () {
        console.log('registered')
    }

    function handleLogin () {
        console.log('login successfull')
    }


return <>
    <Route exact path='/' render={() => <Landing onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
    <Route path='/register' render={() => <Register onRegister={handleRegister}  />} />
    <Route path='/login' render={() => <Login onLogin={handleLogin} />} />
    <Route path='/board' render={() => <Board />} />
  </>
  
})


