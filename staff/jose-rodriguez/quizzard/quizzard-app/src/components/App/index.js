import React, {useState, useEffect} from 'react'
import './index.sass'
import Landing from '../Landing'
import Home from '../Home'
import Register from '../Register'
import Login from '../Login'
import Profile from '../Profile'
import CreateQuiz from '../Create-Quiz'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { authenticateUser, registerUser, retrieveUser, listQuizs, createQuiz } from '../../logic'

export default withRouter(function ({ history }) {

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [id, setId] = useState()

  const [quizs, setQuizs] = useState()



  useEffect( ()=> {
    const { token } = sessionStorage;

    (async () => {
      if (token) {
        const {user: {username, email, id}} = await retrieveUser(token)


        debugger
        setUsername(username)
        setEmail(email)
        setId(id)

        await retrieveQuizs(token)
      }
    })()
  }, [sessionStorage.token])

  async function retrieveQuizs(token) {
    const quizs = await listQuizs(token)

    setQuizs(quizs)
}



  function handleGoToLanding() { history.push('/') }

  function handleGoToHome() { history.push('/home') }

  function handleGoToRegister() { history.push('/register') }

  function handleGoToLogin() { history.push('/login') }

  function handleGoBack() { history.push('/home') }

  function handleGoToCreate() { history.push('/create')}

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

  async function handleCreate(title, description, questions) {

    try {

      const { token } = sessionStorage
      debugger
      
      const quiz = await createQuiz(token, title, description, questions)

      debugger

      const quizId = quiz.id

      history.push(`/quiz/${quizId}`)
  } catch (error) {
      console.error(error)
  }

  }

  
  
  const { token } = sessionStorage


  return <>
      <Route exact path="/" render={() => token ? <Redirect to="/profile" /> : <Landing onHome={handleGoToHome}  />} />
      <Route path="/home" render={() =>  <Home  onLanding={handleGoToLanding} onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
      <Route path="/register" render={() => token ? <Redirect to="/profile" /> : <Register  onRegister={handleRegister} onBack={handleGoBack} onLogin={handleGoToLogin} />} />
      <Route path="/login" render={() => token ? <Redirect to="/profile" /> : <Login  onLogin={handleLogin} onBack={handleGoBack} onRegister={handleGoToRegister} />} />
      <Route path="/profile" render={()=> token ? <Profile user={username} email={email} userId={id} quizs={quizs} onCreate={handleGoToCreate} /> : <Redirect to="/" />} />
      <Route path="/create" render={()=> true ? <CreateQuiz onCreate={handleCreate} /> : <Redirect to="/" />} />


  </>
})
