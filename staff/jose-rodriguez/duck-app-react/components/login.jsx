function Login({ onLogin }) {
    return <section className="view login _hide">
        <form onSubmit={function (event) {
            event.preventDefault()
            const { email: { value: email }, password: { value: password } } = event.target
            onLogin(email, password)
        }}>
            <h1 className="login__title">Login</h1>
            <input type="email" className="login__field" name="email" placeholder="e-mail" />
            <input type="password" className="login__field" name="password" placeholder="password" />
            <button className="login__submit">Sign in</button>
            <a href="" className="login__back">Go back</a>
        </form>
        <section className="feedback hide">
            <span className="feedback__icon">🤡</span>
            <p className="feedback__message">Come with me...</p>
            <span className="feedback__icon">🎈</span>
        </section>
    </section>

}