import React, { useEffect, useState } from 'react'
import './index.sass'
import { retrieveQuiz } from '../../logic'

export default function ({ currentQuestion, quizId, nextQuestion }) {
    const [quiz, setQuiz] = useState()
    let interval
    const curQuest = currentQuestion

    useEffect(() => {

        if (typeof interval !== 'number') interval = setInterval(() => {

            (async () => {
                try {

                    const quiz = await retrieveQuiz(quizId)
                    setQuiz(quiz)

                    const { currentQuestion } = quiz

                    if (curQuest < currentQuestion) {

                        nextQuestion(quizId)

                    }

                } catch (error) {
                    console.log(error)
                }
            })()
        }, 500)

        return () => clearInterval(interval)
    }, [setQuiz])

    return <section className="instructions">
        <header className="instructions__header">
            <p className="instructions__gamepin">Game PIN: {quizId}</p>
        </header>
        <div className="instructions__joinArea">
            <div className="instructions__text">Current Question running</div>
            <div className="instructions__name">{currentQuestion + 1}</div>
            <div className="instructions__next" onClick={event => {
                event.preventDefault();
                nextQuestion(quizId)
            }}>
                <p className="instructions__next--text">Next Question</p>
            </div>
        </div>
    </section>

}