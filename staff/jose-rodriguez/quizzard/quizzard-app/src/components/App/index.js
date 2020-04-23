import React, { useState, useEffect } from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import './index.sass'
import Landing from '../Landing'
import Home from '../Home'
import Register from '../Register'
import Login from '../Login'
import Profile from '../Profile'
import CreateQuiz from '../Create-Quiz'
import Detail from '../Detail'
import Lobby from '../Lobby'
import PlayerLobby from '../Player-Lobby'
import WaitingArea from '../Waiting-Area'
import Question from '../Question'
import Admin from '../Admin'
import Results from '../Results'
import GameOver from '../GameOver'
import Feedback from '../Feedback'
import Context from '../Context'

import {
  authenticateUser, registerUser,
  retrieveUser, listQuizs, createQuiz, retrieveQuiz, startQuiz,
  enrollGame, retrieveQuestion, nextQuestion, disableQuestion, retrieveResults, resetQuiz
} from '../../logic'



export default withRouter(function ({ history }) {

  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [id, setId] = useState()
  const [quizs, setQuizs] = useState()
  const [quiz, setQuiz] = useState()
  const [results, setResults] = useState()
  const [players, setPlayers] = useState()
  const [timer, setTimer] = useState()
  const [currentQuestion, setCurrentQuestion] = useState()
  const [feed, setFeed] = useState()

  useEffect(() => {

    const { token } = sessionStorage;

    (async () => {
      try {
        if (token) {
          const { user: { username, email, id } } = await retrieveUser(token)

          setUsername(username)
          setEmail(email)
          setId(id)

          await retrieveQuizs(token)

        }
      } catch (error) {
        setFeed({ title: "Session Expired!", message: "You'll be redirect to Home" })
        setTimeout(() => {
          setFeed(undefined)
          sessionStorage.clear()
          history.push('/')
        }, 3000)
      }
    })()

  }, [sessionStorage.token])

  async function retrieveQuizs(token) {
    const quizs = await listQuizs(token)

    setQuizs(quizs)
  }

  async function handleStartGame() {

    const { token } = sessionStorage

    const quizId = history.location.pathname.slice(6)

    const quiz = await startQuiz(token, quizId)

    setQuiz(quiz)
    history.push(`/lobby/${quizId}`)

  }

  async function handleEnrollGame(quizId, nickname) {

    const quiz = await enrollGame(quizId, nickname)

    setQuiz(quiz)

    const playerId = quiz.player

    sessionStorage.playerId = playerId

    history.push(`/lobby/${quizId}`)
  }

  function handleGoToLanding() { history.push('/') }

  function handleGoToHome() { history.push('/home') }

  function handleGoToRegister() { history.push('/register') }

  function handleGoToLogin() { history.push('/login') }

  function handleGoBack() { history.push('/home') }

  function handleGoToCreate() { history.push('/create') }

  function handleGoEnd() { history.push('/gameover') }

  function handleCloseError() { setFeed(undefined) }

  function handleGoToDetail(id) { history.push(`/quiz/${id}`) }

  function handleLogout() {
    sessionStorage.clear()
    history.push('/')
  }



  async function handleRegister(name, surname, email, username, password) {
    try {
      await registerUser(name, surname, email, username, password)

      history.push('/login')
    } catch ({ message }) {
      setFeed({ title: "Oops!", message })
    }
  }

  async function handleLogin(username, password) {
    try {
      const token = await authenticateUser(username, password)

      sessionStorage.token = token

      history.push('/profile')

    } catch ({ message }) {
      setFeed({ title: "Oops!", message })
    }
  }

  async function handleCreate(title, description, questions) {

    try {

      const { token } = sessionStorage

      const quiz = await createQuiz(token, title, description, questions)

      const quizId = quiz.id

      history.push(`/quiz/${quizId}`)
    } catch ({ message }) {

      setFeed({ title: "Oops!", message })
    }

  }

  async function handleGoToQuestion(quizId) {

    const quiz = await retrieveQuiz(quizId)
    const { currentQuestion } = quiz
    setQuiz(quiz)
    setCurrentQuestion(currentQuestion)


    if (token) {
      history.push(`/admin/${quizId}`)
    } else {
      try {
        const { playerId } = sessionStorage
        const question = await retrieveQuestion(playerId, quizId)
        const timer = question.timing_
        setTimer(timer)
        history.push(`/waiting/${quizId}`)
        setTimeout(function () { return history.push(`/game/${quizId}`) }, 5000)

      } catch ({ message }) {

        setFeed({ title: "Oops!", message })

      }
    }
  }

  async function handleNextQuestion(quizId) {

    await disableQuestion(quizId)

    const results = await retrieveResults(quizId)

    setResults(results)

    setTimeout(async function () { await nextQuestion(quizId) }, 3000)

    history.push(`/lobby/${quizId}`)

  }


  async function handleGoToResults(quizId) {

    await disableQuestion(quizId)

    setTimeout(async function() {
      
      const quiz = await retrieveQuiz(quizId)
      const { players } = quiz
      setPlayers(players)
    
    }, 3000)

    debugger

    setTimeout(function () { return history.push(`/results/${quizId}`) }, 3000)
    setTimeout(function () { return history.push(`/lobby/${quizId}`) }, 10000)
  }

  async function handleResetGame(quizId){

      try {

        const { token } = sessionStorage
    
        await resetQuiz(token, quizId)

        history.push(`/quiz/${quizId}`)
        
      } catch ({message}) {
        
        setFeed({ title: "Oops!", message })
        
      }

  }

  const { token } = sessionStorage


  return <>
    <Context.Provider value={{ feed, setFeed }}>
      <Route exact path="/" render={() => token ? <Redirect to="/profile" /> : <Landing onHome={handleGoToHome} onPinCode={handleEnrollGame} />} />
      <Route path="/home" render={() => <Home onLanding={handleGoToLanding} onRegister={handleGoToRegister} onLogin={handleGoToLogin} />} />
      <Route path="/register" render={() => token ? <Redirect to="/profile" /> : <Register onRegister={handleRegister} onBack={handleGoBack} onLogin={handleGoToLogin} />} />
      <Route path="/login" render={() => token ? <Redirect to="/profile" /> : <Login onLogin={handleLogin} onBack={handleGoBack} onRegister={handleGoToRegister} />} />
      <Route path="/profile" render={() => token ? <Profile user={username} email={email} userId={id} quizs={quizs} onCreate={handleGoToCreate} onDetail={handleGoToDetail} onLogout={handleLogout} /> : <Redirect to="/" />} />
      <Route path="/create" render={() => true ? <CreateQuiz onCreate={handleCreate} /> : <Redirect to="/" />} />
      <Route path="/quiz/:id" render={props => token ? <Detail quiz={quiz} onStart={handleStartGame} quizId={props.match.params.id} onReset={handleResetGame}/> : <Redirect to="/" />} />
      <Route path="/lobby/:id" render={props => <Lobby quiz={quiz} quizId={props.match.params.id} handleGoToQuestion={handleGoToQuestion} goEnd={handleGoEnd} />} />
      <Route path="/instructions" render={() => <PlayerLobby quiz={quiz} />} />
      <Route path="/waiting/:id" render={props => <WaitingArea quiz={quiz} quizId={props.match.params.id} />} />
      <Route path="/game/:id" render={props => <Question quizId={props.match.params.id} timer={timer} goToResults={handleGoToResults} />} />
      <Route path="/admin/:id" render={props => <Admin currentQuestion={currentQuestion} quizId={props.match.params.id} nextQuestion={handleNextQuestion} />} />
      <Route path="/results/:id" render={props => <Results quizId={props.match.params.id} players={players} />} />
      <Route path="/gameover" render={() => <GameOver onBack={handleGoToLanding} />} />
      {feed && <Feedback title={feed.title} message={feed.message} onClose={handleCloseError} />}
    </Context.Provider>
  </>
})
