import React from 'react'
import './index.sass'

export default function ({ onBack, onLogin, onRegister }) {
    return <section className="login">
        <div className="login__header">
            <div className="login__logo">Quizzard!</div>
            <div className="login__signup" onClick={event => {
                event.preventDefault(); onRegister()
            }}>Sign Up</div>
        </div>
        <div className="login__main">
            <h1 className="login__title">Login</h1>
            <form className="login__form" onSubmit={function (event) {
                event.preventDefault()

                const { username: { value: username }, password: { value: password } } = event.target

                onLogin(username, password)
            }}>
                <input type="text" className="login__input" name="username" placeholder="username"></input>
                <input type="password" className="login__input" name="password" placeholder="password"></input>
                <div className="login__options">
                    <button className="login__submit" type="submit">Enjoy!</button>
                    <div className="login__back" onClick={event => {
                        event.preventDefault(); onBack()
                    }}><img src="../../../back.png" className="login__back"></img></div>
                </div>
            </form>
        </div>
    </section>
}