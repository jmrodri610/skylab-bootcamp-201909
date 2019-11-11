const express = require('express')
const { View, Landing, Register, Login, Search, Detail } = require('./components')
const { registerUser, authenticateUser, searchDucks, retrieveUser, toggleFavDuck, retrieveDuck } = require('./logic')
const { bodyParser, cookieParser } = require('./utils/middlewares')

const sessions = {}

const { argv: [, , port = 8080] } = process

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send(View({ body: Landing({ register: '/register', login: '/login' }) }))

})

app.get('/register', (req, res) => {
    res.send(View({ body: Register() }))
})



app.post('/register', bodyParser, (req, res) => {
    const { body: { name, surname, email, password } } = req

    try {
        registerUser(name, surname, email, password)
            .then(res.redirect('/login'))
            .catch(() => { res.send('TODO MAL EN REGISTEEEEEER PROMISEEEEE') })

    } catch (error) {
        res.send('TODO MAAAAAAAL')
    }

})

app.get('/login', (req, res) => {
    res.send(View({ body: Login() }))
})

app.post('/login', bodyParser, (req, res) => {
    const { body: { email, password } } = req
    try {
        authenticateUser(email, password)
            .then(credentials => {

                const { id, token } = credentials

                sessions[id] = { token }

                res.setHeader('set-cookie', `id=${id}`)

                res.redirect('./search')
            })
            .catch(() => { res.send('ESTA TODO MAAAAAAAAL EN AUNTHENTICATE USEEEEEEER') })
    } catch (error) {
        res.send('ESTA TODO MAAAAAAL EN EL LOGIIIIIIN!!')
    }
})

app.get('/search', cookieParser, (req, res) => {
    try {
        const { cookies: { id }, query: { query: query } } = req

        if (!id) return res.redirect('/')

        const session = sessions[id]

        if (!session) return res.redirect('/')

        const {token} = session

        if (!token) res.redirect('/')

        let name

        retrieveUser(id, token)
            .then(user => {

                name = user.name

                if (!query) res.send(View({ body: Search({ path: '/search', name, logout: '/logout' }) }))

                session.query = query

                return searchDucks(id, token, query)
                    .then(ducks => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks' }) })))
            })
            .catch(() => { res.send('search, peta aqui, TODO MAAAAAAL EN EL PROMISE DE RETRIEVE USEEER') })
    } catch (error) {
        res.send('TODO MAAAAAAL EN RETRIVE USEEEEEEEEER 2')
    }
})

app.post('/logout', cookieParser, (req, res) => {
    res.setHeader('set-cookie', 'id=""; expires=Thu, 01 Jan 1970 00:00:00 GMT')

    const { cookies: { id } } = req

    if (!id) return res.redirect('/')

    delete sessions[id]

    res.redirect('/')
})

app.post('/fav', cookieParser, bodyParser, (req, res) => {
    try {
        const { cookies: { id }, body: { id: duckId } } = req

        if (!id) return res.redirect('/')

        const session = sessions[id]

        if (!session) return res.redirect('/')

        const { token, query } = session

        if (!token) return res.redirect('/')

        toggleFavDuck(id, token, duckId)
            .then(() => res.redirect(`/search?query=${query}`))
            .catch(() => { res.send('TODO MAAAAAAL EN TOOGLE FAV PROMISEEEE!!!') })

    } catch (error) {
        res.send(error.message)
    }
})

app.get('/ducks/:id', cookieParser, (req, res) => {
    try {
        debugger
        const {cookies: {id}, params: { id: duckId }} = req
    
        if (!id) return res.redirect('/')
    
        const session = sessions[id]
    
        if (!session) return res.redirect('/')
    
        const { token, query } = session
    
        if (!token) return res.redirect('/')
    
        const prevPath = `/search?query=${query}`
        retrieveDuck(id, token, duckId)
            .then(item => {
                res.send(View({ body: Detail({ path: '/ducks', item , logout: '/logout', favPath: '/fav', prevPath }) }))
            })
            .catch(error => res.send(error.message+'detail, peta aqui, MAAAAAL PROMISE RETRIEVE DUUCK'))
        
    } catch (error) {
        res.send(error.message)
    }
}) 

app.listen(port, () => console.log(`server running on port ${port}`))