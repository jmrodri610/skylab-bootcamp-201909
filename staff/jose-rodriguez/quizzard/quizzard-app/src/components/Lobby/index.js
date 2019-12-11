import React, { useEffect, useState } from 'react'
import './index.sass'
import ListPlayers from '../List-Players'
import Question from '../Question'
import { retrieveQuiz, enableQuestion, hasbeenlaunched } from '../../logic'


export default function ({ quizId, handleGoToQuestion }) {
    const { token } = sessionStorage

    const [quiz, setQuiz] = useState()
    let interval

    useEffect(() => {

        if (typeof interval !== 'number') interval = setInterval(() => {

            (async () => {
                try {
                    const quiz = await retrieveQuiz(quizId)
                    setQuiz(quiz)


                    const launched = await hasbeenlaunched(quizId)


                    if (launched) {

                        handleGoToQuestion(quizId)


                    }

                } catch (error) {
                    console.log(error)
                }
            })()
        }, 500)

        return () => clearInterval(interval)
    }, [setQuiz])

    async function handleEnableQuestion(quizId) {

        try {
            
            const quiz = await enableQuestion(quizId)

            setQuiz(quiz)

        } catch (error) {
            console.error(error)
        }

    }

    return <section className="lobby">
        {quiz && <>

            <header className="lobby__header">
                <h2 className="lobby__title">Join at quizzard.com with</h2>
                <p className="lobby__gamepin">Game PIN: {quizId}</p>
            </header>
            <div className="lobby__info">
                <div className="lobby__counter">
                    <p className="lobby__numPlayers">{quiz.players ? quiz.players.length : 0}</p>
                    <p className="lobby__numPlayers--players">Players</p>
                </div>
                <div className="lobby__logo">Quizzard!</div>
                <div className="lobby__start">
                    <form className="lobby__form" onSubmit={event => {
                        event.preventDefault();
                        handleEnableQuestion(quizId)
                    }}>
                        { token && <input type="submit" className="lobby__submit" value="Next"></input>}
                    </form>
                </div>
            </div>
            <div className="lobby__content">
                {quiz.players && <ListPlayers players={quiz.players} />}
            </div>
            <div className="lobby__waiting">
                <p className="lobby__waiting--text">Waiting for other players...</p>
            </div>
        </>}
    </section>


}