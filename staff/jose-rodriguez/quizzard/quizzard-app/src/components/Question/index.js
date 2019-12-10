import React, { useEffect, useState } from 'react'
import './index.sass'
import { retrieveQuestion } from '../../logic'

export default function ({ quizId, timer, goToResults }) {

    const [question, setQuestion] = useState()
    let [counter, setCounter] = useState(timer)
    let interval
    useEffect(() => {
        const { playerId } = sessionStorage;

        (async () => {
            try {
                
                const question = await retrieveQuestion(playerId, quizId)
                
                setQuestion(question)


            } catch (error) {
                console.log(error)
            }
        })()
        if (typeof interval !== 'number') interval = setInterval(() => {

            setCounter(counter--)
        }, 500)
        return () => clearInterval(interval)

    }, [setQuestion, counter])

    if (counter === 0) {
        clearInterval(interval)
        
        
        goToResults(quizId)
    }

    return <section className="session">
        <div className="session__header">
            <p className="session__title">{question && question.text_}</p>
        </div>
        <div className="session__next">
            <p className="session__next--text">Next</p>
        </div>
        <div className="session__timer">
            <p className="session__timer--sec">{counter}</p>
        </div>
        <div className="session__control">
            <div className="session__answers">
                <form className="session__form">
                    <input type="button" className="session__answer session__answer--1" value={question && question.answer[0]} />
                    <input type="button" className="session__answer session__answer--2" value={question && question.answer[1]} />
                    <input type="button" className="session__answer session__answer--3" value={question && question.answer[2]} />
                    <input type="button" className="session__answer session__answer--4" value={question && question.answer[3]} />
                </form>
            </div>
        </div>
        <div className="session__footer">
            <p className="session__footer--text">PIN CODE: {quizId}</p>
        </div>

    </section>

}