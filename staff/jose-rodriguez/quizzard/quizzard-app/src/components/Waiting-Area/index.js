import React, {useState, useEffect } from 'react'
import './index.sass'

export default function ({ quizId }) {

    let [counter, setCounter] = useState(5)

    useEffect(() => {
        if (!counter) return
        const interval = setInterval(() => {
            setCounter(counter--)
        }, 500)
        return () => clearInterval(interval)
    }, [counter])


    return <section className="ready">
        <header className="ready__header">
            <p className="ready__gamepin">Game PIN: {quizId}</p>
        </header>
        <div className="ready__timer">
            <div className="ready__timer__text">Are you ready?</div>
            <div className="ready__timer__sec">{counter}</div>
        </div>

    </section>

}