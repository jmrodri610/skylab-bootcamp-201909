import React from 'react'
import './index.sass'

export default function ({onBack}) {

    return <section className="gameover">
        <h1 className="gameover__title">That's all!</h1>
        <div className="gameover__content">
            <p className="gameover__text">Thanks for playing Quizzard!<br></br> Come back soon!</p>
        </div>
        <div className="gameover__back">
            <p className="gameover__back--text" onClick={event => {
                event.preventDefault();
                onBack()
            }}>Exit</p>
        </div>
    </section>
}