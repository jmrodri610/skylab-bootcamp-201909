import React from 'react'
import './index.sass'
import Landing from '../Landing'
import Home from '../Home'
import Register from '../Register'
import Login from '../Login'
import Profile from '../Profile'
import { Route, withRouter } from 'react-router-dom'
import { authenticateUser, registerUser } from '../../logic'

export default withRouter(function ({ history }) {
  
  function handleGoToLanding() { history.push('/') }

  function handleGoToHome() { history.push('/home') }

  function handleGoToRegister() { history.push('/register') }

  function handleGoToLogin() { history.push('/login') }

  function handleGoBack() { history.push('/home') }

  async function handleRegister(name, surname, email, username, password) {
      try {
          await registerUser(name, surname, email, username, password)

          history.push('/login')
      } catch (error) {
          console.error(error)
      }
  }

  async function handleLogin(username, password) {
      try {
          const token = await authenticateUser(username, password)

          sessionStorage.token = token

          history.push('/profile')
      } catch (error) {
          console.error(error)
      }
  }
  

  return <>
      <Route exact path="/" render={() => <Landing onHome={handleGoToHome}  />} />
      <Route path="/home" render={() =>   <Home  onLanding={handleGoToLanding} onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
      <Route path="/register" render={() =>   <Register  onRegister={handleRegister} onBack={handleGoBack} onLogin={handleGoToLogin} />} />
      <Route path="/login" render={() =>  <Login  onLogin={handleLogin} onBack={handleGoBack} onRegister={handleGoToRegister} />} />
      <Route path="/profile" render={()=> <Profile />} />


  </>
})
