import React from 'react'
import './index.sass'

export default function ({ onRegister }) {

    return <section class="register">
        <h2 class="register__title">Sign Up</h2>
        <form class="register__form" onSubmit={function (event) {
            event.preventDefault()

            const { name: { value: name }, surname: { value: surname }, email: { value: email }, username: { value: username }, password: { value: password } } = event.target

            onRegister(name, surname, email, username, password)
        }}>
            <input type="text" class="register__input" name="name" placeholder="name"></input>
            <input type="text" class="register__input" name="surname" placeholder="surname"></input>
            <input type="email" class="register__input" name="email" placeholder="email"></input>
            <input type="text" class="register__input" name="username" placeholder="username"></input>
            <input type="password" class="register__input" name="password" placeholder="password"></input>
            <button type="submit" class="register__submit">⛩</button>
        </form>
    </section>

}
