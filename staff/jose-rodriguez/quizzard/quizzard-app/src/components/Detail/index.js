import React, { useEffect, useState } from 'react'
import './index.sass'
import { retrieveQuiz, retrieveUser } from '../../logic'

export default function ({ onStart, quizId, onLogout, onCreate, onReset }) {

    const [quiz, setQuiz] = useState()
    const [user, setUser] = useState()
    const [questions, setQuestions] = useState()

    useEffect(() => {

        (async () => {
            const { token } = sessionStorage

            try {
                const quiz = await retrieveQuiz(quizId)
                const { user } = await retrieveUser(token)

                const { questions } = quiz

                setQuiz(quiz)
                setUser(user)
                setQuestions(questions)

            } catch (error) {
                console.log(error)
            }
        })()

    }, [setQuiz])

    return <section className="detail">
        <div className="detail__header">
            <div className="detail__logo">Quizzard!</div>
            <div className="detail__logout" onClick={event => {
                event.preventDefault();
                onLogout()
            }}>Logout</div>
            <div className="detail__addquiz" onClick={event => {
                event.preventDefault(); onCreate()
            }}>+</div>
        </div>
        <div className="detail__userinfo">

            <div className="detail__quizinfo_title">
                <p className="detail__username">{quiz && quiz.title}</p>
            </div>
            <div className="detail__quizinfo">
                <p className="detail__quizs">Plays of this quiz</p>
                <p className="detail__numquizs">{quiz && quiz.games}</p>
            </div>
            {/* <div className="detail__quizinfo">
            <p className="detail__quizs">Total Players</p>
            <p className="detail__numquizs">{quizs && acc_players}</p>
        </div> */}
        </div>
        <div className="detail__list">
            <div className="detail__listinfo">
                <p className="detail__resetQuiz" onClick={event => {
                    event.preventDefault(); onReset()
                }}>Reset Quiz</p>
                <p className="detail__startQuiz" onClick={event => {
                    event.preventDefault(); onStart()
                }}>Start Quiz</p>
            </div>
            <ul className="detail__questions">
                {questions && questions.map(question => <li className="detail__item" key={question.id}>
                    <div className="detail__questionList">
                        <p className="detail__questionText">{question.text}</p>
                        <ul className="detail__answersList">
                            {question.answers.map(answer =>
                                <li className="detail__answer " key={answer.id}>
                                    {answer.valid ? <p className="detail__answer--correct">{answer.text}</p> : <p className="detail__answer--wrong">{answer.text}</p> }
                                </li>
                            )}
                        </ul>
                    </div>
                </li>)}
            </ul>
        </div>

    </section>

}