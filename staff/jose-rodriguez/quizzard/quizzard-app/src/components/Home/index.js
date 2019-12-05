import React from 'react'
import './index.sass'

export default function ({ onRegister, onLanding, onLogin }) {

    return      <section className="home">
    <div className="home__header">
        <div className="home__logo">Q!</div>
        <div className="home__pincode" onClick={event =>{
            event.preventDefault(); onLanding()
        }}>Enter pincode</div>
        <div className="home__signup" onClick={event =>{
            event.preventDefault(); onRegister()
        }}>Sign Up</div>
        <div className="home__sigin" onClick={event =>{
            event.preventDefault(); onLogin()
        }}>Sign In</div>
    </div>
    <div className="home__main">
        <div className="home__main__content">
            <h1 className="home__title">Let's play Quizzard!</h1>
            <p className="home__description"><em>Quizzard!</em> is a game dedicated to those who want to have a good time with
                family
                or friends trying to answer the questions of your quiz! Sign Up and create an endless number of
                impossible quizzes! Have fun!</p>
        </div>
    </div>
</section>

}
