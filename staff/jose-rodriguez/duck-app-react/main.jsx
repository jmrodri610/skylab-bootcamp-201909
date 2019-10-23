const { Component } = React

class App extends Component {
    constructor() {
        super()
        this.state = { view: 'landing', error: undefined, ducks: [] }

        this.handleGoToRegister = this.handleGoToRegister.bind(this)
        this.handleGoToLogin = this.handleGoToLogin.bind(this)
        this.handleRegister = this.handleRegister.bind(this)
        this.handleLogin = this.handleLogin.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleBackFromRegister = this.handleBackFromRegister.bind(this)
        this.handleBackFromLogin = this.handleBackFromLogin.bind(this)
        this.handleDetail = this.handleDetail.bind(this)
        this.handleBackToSearch = this.handleBackToSearch.bind(this)
    }

    handleGoToRegister() {
        this.setState({ view: 'register' })
    }

    handleBackFromRegister() {
        this.setState({ view: 'landing' })
    }

    handleGoToLogin() {
        this.setState({ view: 'login' })
    }

    handleBackFromLogin() {
        this.setState({ view: 'landing' })
    }

    handleRegister(name, surname, email, password) {
        try {
            registerUser(name, surname, email, password, error => {
                if (error) this.setState({ error: error.message })
                else this.setState({ view: 'landing' })
            })
        } catch (error) {
            this.setState({ error: error.message })
        }

    }

    handleLogin(email, password) {
        try {
            authenticateUser(email, password, error => {
                if (error) this.setState({ error: error.message })
                else {
                    this.setState({ view: 'search' })
                    this.handleSearch("")
                }

            })
        } catch (error) {
            this.setState({ error: error.message })
        }

    }

    handleSearch(query) {
        try {
            searchDucks(query, (error, ducks) => {
                if (error) {
                    this.setState({ error: error.message })

                } else {
                    debugger
                    if (!(query)) {
                        ducks = ducks.shuffle().splice(0, 3)
                        this.setState({ ducks })
                    } else {
                        this.setState({ ducks })
                    }
                }
            })

        } catch (error) {
            this.setState({ error: error.message })
        }
    }

    handleBackToSearch() {
        this.setState({ view: 'search' })
    }

    handleDetail() {
        this.setState({ view: 'detail' })
    }

    render() {

        const { state: { view, ducks, error }, handleGoToRegister, handleBackFromRegister, handleGoToLogin, handleBackFromLogin, handleRegister, handleLogin, handleSearch, handleDetail, handleBackToSearch } = this
        return <>
            {view === 'landing' && <Landing onLogin={handleGoToLogin} onRegister={handleGoToRegister} />}
            {view === 'register' && <Register onRegister={handleRegister} onBack={handleBackFromRegister} error={error} />}
            {view === 'login' && <Login onLogin={handleLogin} onBack={handleBackFromLogin} error={error} />}
            {view === 'search' && <Search onSearch={handleSearch} results = {ducks}/>}
            {view === 'search' &&
                <section className="view ducks">
                    <ul className="results" key={Math.random()} >
                        {ducks.map(duck => <Results onResult={duck} />)}
                    </ul>
                </section>}
            {view === 'detail' && <Detail onDetail={handleDetail} onBack={handleBackToSearch} onStore={handleGoToStore} error={error} />}
        </>

    }
}


ReactDOM.render(<App />, document.getElementById('root'))