function handleGoToLogin() {
    debugger
}

function handleGoToRegister() {
    debugger
}

function handleRegister(name, surname, email, password) {
    debugger
}

function handleLogin(email,password) {
    debugger
}

function handleSearch (query) {
    debugger
}


// TODO login and search

ReactDOM.render(<>
    <Landing onLogin={handleGoToLogin} onRegister={handleGoToRegister}  />
    <Register onRegister={handleRegister} />
    <Login onLogin={handleLogin} />
    <Search onSearch={handleSearch} />
</>, document.getElementById('root'))