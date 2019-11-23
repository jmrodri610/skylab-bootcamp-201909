import React from 'react'
import './index.sass'

export default function ({ onLogin }) {
    return <section className="login">
        <h2 className="login__title">Sign In</h2>
        <form className="login__form" onSubmit={function (event) {
            event.preventDefault()

            const { username: { value: username }, password: { value: password } } = event.target

            onLogin(username, password)
        }}>
            <input type="text" className="login__input" name="username" placeholder="username"></input>
            <input type="password" className="login__input" name="password" placeholder="password"></input>
            <button className="login__submit" type="submit">🔑</button>
        </form>
    </section>
}