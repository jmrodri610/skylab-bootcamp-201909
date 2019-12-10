import React from 'react'
import './index.sass'

export default function ({ quiz }) {

    return <section className="instructions">
        <header className="instructions__header">
            <p className="instructions__gamepin">Game PIN: 123456</p>
        </header>
        <div className="instructions__joinArea">
            <div className="instructions__text">You're in!</div>
            <div className="instructions__name">See your nickname on screen?</div>
        </div>
        <div className="instructions__footer">
            <p className="instructions__footer--text">{sessionStorage.nickname}</p>
        </div>

    </section>
}