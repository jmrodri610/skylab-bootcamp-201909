import React, { useState, useEffect } from 'react'
import './index.sass'
import Landing from '../Landing'
import Home from '../Home'
import Register from '../Register'
import Login from '../Login'
import Profile from '../Profile'
import CreateQuiz from '../Create-Quiz'
import Detail from '../Detail'
import Lobby from '../Lobby'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { authenticateUser, registerUser, retrieveUser, listQuizs, createQuiz, retrieveQuiz, startQuiz, enrollGame } from '../../logic'

export default withRouter(function ({ history }) {

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [id, setId] = useState()
  const [quizs, setQuizs] = useState()
  const [quiz, setQuiz] = useState()
  const [player, setPlayer] = useState()
  const [quizId, setQuizId] = useState()



  useEffect(() => {
    const { token } = sessionStorage;

    (async () => {
      if (token) {
        const { user: { username, email, id } } = await retrieveUser(token)

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

  async function handleStartGame() {
debugger
    const {token} = sessionStorage

    const quizId = history.location.pathname.slice(6)

    const quiz = await startQuiz(token, quizId)

    setQuiz(quiz)
    history.push(`/lobby/${quizId}`)

  }

  async function handleEnrollGame(quizId, nickname) {
debugger
    const quiz = await enrollGame(quizId, nickname)

    setQuiz(quiz)

    history.push(`/lobby/${quizId}`)
  }

  function handleGoToLanding() { history.push('/') }

  function handleGoToHome() { history.push('/home') }

  function handleGoToRegister() { history.push('/register') }

  function handleGoToLogin() { history.push('/login') }

  function handleGoBack() { history.push('/home') }

  function handleGoToCreate() { history.push('/create') }

  function handleGoToDetail(id) {
    history.push(`/quiz/${id}`)
  
    setQuizId(id)
  }



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

      const quiz = await createQuiz(token, title, description, questions)

      const quizId = quiz.id

      history.push(`/quiz/${quizId}`)
    } catch (error) {
      console.error(error)
    }

  }



  const { token } = sessionStorage


  return <>
    <Route exact path="/" render={() => token ? <Redirect to="/profile" /> : <Landing onHome={handleGoToHome} onPinCode={handleEnrollGame} />} />
    <Route path="/home" render={() => <Home onLanding={handleGoToLanding} onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
    <Route path="/register" render={() => token ? <Redirect to="/profile" /> : <Register onRegister={handleRegister} onBack={handleGoBack} onLogin={handleGoToLogin} />} />
    <Route path="/login" render={() => token ? <Redirect to="/profile" /> : <Login onLogin={handleLogin} onBack={handleGoBack} onRegister={handleGoToRegister} />} />
    <Route path="/profile" render={() => token ? <Profile user={username} email={email} userId={id} quizs={quizs} onCreate={handleGoToCreate} onDetail={handleGoToDetail} /> : <Redirect to="/" />} />
    <Route path="/create" render={() => true ? <CreateQuiz onCreate={handleCreate} /> : <Redirect to="/" />} />
    <Route path="/quiz" render={() => token ? <Detail onStart={handleStartGame} /> : <Redirect to="/" />} />
    <Route path="/lobby/:id" render={props => <Lobby quiz={quiz} quizId={props.match.params.id} />} />
    
  </>
})
