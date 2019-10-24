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

    handleDetail(id) {
        retrieveDuck(id, (error, duck) => {
            if (error) {
                this.setState({error: error.message})
                
            } else {
                this.setState({ view: 'detail', duck })
            }
        })
    }

    render() {

        const { state: { view, ducks, duck, error }, handleGoToRegister, handleBackFromRegister, handleGoToLogin, handleBackFromLogin, handleRegister, handleLogin, handleSearch, handleDetail, handleBackToSearch } = this
        return <>
            {view === 'landing' && <Landing onLogin={handleGoToLogin} onRegister={handleGoToRegister} />}
            {view === 'register' && <Register onRegister={handleRegister} onBack={handleBackFromRegister} error={error} />}
            {view === 'login' && <Login onLogin={handleLogin} onBack={handleBackFromLogin} error={error} />}
            {view === 'search' && <Search onSearch={handleSearch} results = {ducks} error={error} onResultsRender = {results => <Results items={results} onItemRender={item => <ResultItem item={item} key={item.id} onClick={handleDetail} />} />} />}
            {view === 'detail' && <Detail item={duck} onBack = {handleBackToSearch}/>}
        </>

    }
}
ReactDOM.render(<App />, document.getElementById('root'))