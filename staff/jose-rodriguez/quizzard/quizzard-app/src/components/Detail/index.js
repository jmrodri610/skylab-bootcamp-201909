import React, {useEffect, useState} from 'react'
import './index.sass'
import { retrieveQuiz } from '../../logic'

export default function ({ onStart, quizId }) {

    const [quiz, setQuiz] = useState()

        useEffect(() => {

            (async () => {
                try {
                    const quiz = await retrieveQuiz(quizId)
                    setQuiz(quiz)

                } catch (error) {
                    console.log(error)
                }
            })()

    }, [setQuiz])

    return     <section className="detail">
        <h1 className="quizTitle" >{quiz && quiz.title}</h1>
        <div className="detail__info">
            <p className="detail__questions">Number of questions</p>
            <p className="detail__numQuestions">{quiz && quiz.questions.length}</p>
        </div>
        <form onSubmit={ event => {
            event.preventDefault();
            onStart()
        }}>
            <input className="startbutton" type="submit" value="Start Game"></input>
        </form>

</section>

}