import React, { useEffect, useState } from 'react'
import './index.sass'
import { retrieveQuestion, retrieveQuiz, submitAnswers, retrieveResults } from '../../logic'


export default function ({ quizId, goToResults, showResults }) {

    const [question, setQuestion] = useState()
    let [counter, setCounter] = useState()
    let [answers, setAnswers] = useState([])
    let [answereds, setAnswered] = useState([false,false, false, false])
    

    let interval
    useEffect(() => {
        const { playerId } = sessionStorage;

        if (typeof interval !== 'number') interval = setInterval(() => {
            (async () => {
                try {

                    const question = await retrieveQuestion(playerId, quizId)

                    // if (question.status === 'finished') {
                        

                    //     goToResults(quizId, results)

                    // }

                    setQuestion(question)

                    const quiz = await retrieveQuiz(quizId)

                    const { currentQuestion, questions } = quiz

                    let { timing, startTime: startTime_ } = questions[currentQuestion]

                    let date = new Date() / 1000
                    startTime_ = Date.parse(startTime_) / 1000

                    let counter = timing - Math.floor(date - startTime_) + 6

                    setCounter(counter)

                    if (counter < 0) {

                        clearInterval(interval)

                         await submitAnswers(playerId, quizId, answers)
                        debugger
                        const results = await retrieveResults(playerId, quizId)

                        goToResults(quizId, results)

                    }


                } catch (error) {
                    console.log(error)
                }
            })()


        }, 1000)
        return () => clearInterval(interval)

    }, [setQuestion, counter])

    function selectAnswer1() {
            const id = question.answer[0].id
            answers.push(id)
            setAnswers(answers)
            setAnswered([true, answereds[1], answereds[2], answereds[3]])
        
    }

    function selectAnswer2() {
        const id = question.answer[1].id
        answers.push(id)
        setAnswers(answers)
        setAnswered([answereds[0], true, answereds[2], answereds[3]])
    }

    function selectAnswer3() {
        const id = question.answer[2].id
        answers.push(id)
        setAnswers(answers)
        setAnswered([answereds[0], answereds[1], true, answereds[3]])
    }

    function selectAnswer4() {
        const id = question.answer[3].id
        answers.push(id)
        setAnswers(answers)
        setAnswered([answereds[0], answereds[1], answereds[2], true])
    }



    return <section className="session">
        <div className="session__header">
            <p className="session__title">{question && question.text_}</p>
        </div>

        <div className="session__timer">
            <p className="session__timer--sec">{counter}</p>
        </div>
        <div className="session__control">
            <div className="session__answers">
    
                {answereds[0] ? <div className="session__answer session__answer--text session__answer--answered">
                                    <p className="session__answer--text" >{question && question.answer[0].text}</p>
                                </div>
                    :
                    <div className="session__answer session__answer--text session__answer--1" onClick={event => {
                    event.preventDefault();
                    selectAnswer1()
                }} >
                    <p className="session__answer--text" >{question && question.answer[0].text}</p>
                </div>}

                {answereds[1] ? <div className="session__answer session__answer--text session__answer--answered">
                                    <p className="session__answer--text" >{question && question.answer[1].text}</p>
                                </div>
                    :
                    <div className="session__answer session__answer--text session__answer--2" onClick={event => {
                    event.preventDefault();
                    selectAnswer2()
                }} >
                    <p className="session__answer--text" >{question && question.answer[1].text}</p>
                </div>}
                {answereds[2] ? <div className="session__answer session__answer--text session__answer--answered">
                                    <p className="session__answer--text" >{question && question.answer[2].text}</p>
                                </div>
                    :
                    <div className="session__answer session__answer--text session__answer--3" onClick={event => {
                    event.preventDefault();
                    selectAnswer3()
                }} >
                    <p className="session__answer--text" >{question && question.answer[2].text}</p>
                </div>}
                {answereds[3] ? <div className="session__answer session__answer--text session__answer--answered">
                                    <p className="session__answer--text" >{question && question.answer[3].text}</p>
                                </div>
                    :
                    <div className="session__answer session__answer--text session__answer--4" onClick={event => {
                    event.preventDefault();
                    selectAnswer4()
                }} >
                    <p className="session__answer--text" >{question && question.answer[3].text}</p>
                </div>}

            </div>
        </div>
        <div className="session__footer">
            <p className="session__footer--text">Create your own Quizzard at Quizzard.com</p>
        </div>

    </section>

}