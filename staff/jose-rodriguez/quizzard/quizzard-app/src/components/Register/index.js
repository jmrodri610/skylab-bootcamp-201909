import React from 'react'
import './index.sass'

export default function ({ onBack, onLogin, onRegister }) {

    return <section className="register">
        <div className="register__header">
            <div className="register__logo">Quizzard!</div>
            <div className="register__signin" onClick={event => {
                event.preventDefault(); onLogin()
            }}>Sign In</div>
        </div>

        <div className="register__main">
        <h1 className="register__title">Register</h1>
            <form className="register__form" onSubmit={function (event) {
                event.preventDefault();
                const { name: { value: name }, surname: { value: surname }, email: { value: email }, username: { value: username }, password: {
                    value: password } } = event.target;
                onRegister(name, surname, email, username, password)
            }}>
                <input type="text" className="register__input" name="name" placeholder="name"></input>
                <input type="text" className="register__input" name="surname" placeholder="surname"></input>
                <input type="email" className="register__input" name="email" placeholder="email"></input>
                <input type="text" className="register__input" name="username" placeholder="username"></input>
                <input type="password" className="register__input" name="password" placeholder="password"></input>
                <div className="register__options">
                    <button type="submit" className="register__submit">Join!</button>
                    <div className="register__back" onClick={event => {
                        event.preventDefault(); onBack()
                    }}><img src="../../../back.png" className="login__back"></img></div>
                </div>
            </form>
        </div>
    </section>

}




