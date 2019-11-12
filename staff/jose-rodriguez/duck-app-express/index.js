const express = require('express')
const { View, Landing, Register, Login, Search, Detail } = require('./components')
const { registerUser, authenticateUser, searchDucks, retrieveUser, toggleFavDuck, retrieveDuck, retrieveFavDucks } = require('./logic')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)


const { argv: [, , port = 8080] } = process

const app = express()

app.set('view engine', 'pug') /* para utilizar el pug */
app.set('views', 'components') 

app.use(express.static('public'))

app.use(session({
    store: new FileStore({
    }),
    secret: 'a super secret thing',
    saveUninitialized: true,
    resave: true
}))

const formBodyParser = bodyParser.urlencoded({ extended: false})

app.get('/', (req, res) => {
    res.send(View({ body: Landing({ register: '/register', login: '/login' }) }))

})

app.get('/register', (req, res) => {
    res.send(View({ body: Register({path: '/register'}) }))
})



app.post('/register', formBodyParser, (req, res) => {
    const { body: { name, surname, email, password } } = req

    try {
        registerUser(name, surname, email, password)
            .then(res.redirect('/login'))
            .catch(() => { res.send(error.message) })

    } catch (error) {
        res.send(error.message)
    }

})

app.get('/login', (req, res) => {
    res.send(View({ body: Login( {path: '/login'}) }))
})

app.post('/login', formBodyParser, (req, res) => {
    const { session, body: { email, password } } = req
    try {
        authenticateUser(email, password)
            .then(credentials => {

                const { id, token } = credentials

                session.userId = id
                session.token = token

                session.save( ()=> res.redirect('/search'))

            })
            .catch(() => { res.send(error.message) })
    } catch (error) {
        res.send(error.message)
    }
})

app.get('/search', (req, res) => {
    try {
        const { session , query: { query: query } } = req

        if (!session) return res.redirect('/')

        const {userId: id, token} = session

        if (!token) res.redirect('/')

        let name

        retrieveUser(id, token)
            .then(user => {
                name = user.name

                if (!query) res.send(View({ body: Search({ path: '/search', name, logout: '/logout', myFavs: '/favlist' }) }))

                
                return searchDucks(id, token, query)
                    .then(ducks => {
                        session.query = query
                        session.view = 'search'

                        session.save( ()=> res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks', myFavs: '/favlist' }) })))})
                   
            })
            .catch(() => { res.send('error.message') })
    } catch (error) {
        res.send(error.message)
    }
})

app.post('/logout', (req, res) => {

    const { session } = req

    session.destroy( () => {
        res.clearCookie('connect.sid', { path: '/'})
        res.redirect('/')
    })
})

app.post('/fav', formBodyParser, (req, res) => {
    try {
        const { session, body: { id: duckId } } = req

        if (!session) return res.redirect('/')

        const { userId: id, token, query } = session

        if (!token) return res.redirect('/')

        toggleFavDuck(id, token, duckId)
            .then(() => res.redirect(`/search?query=${query}`))
            .catch(() => { res.send(error.message) })

    } catch (error) {
        res.send(error.message)
    }
})

app.get('/ducks/:id', (req, res) => {
    try {
        const {session, params: { id: duckId }} = req
    
        if (!session) return res.redirect('/')

        const { userId: id, token, view, query } = session
    
        if (!token) return res.redirect('/')
    
        retrieveDuck(id, token, duckId)
            .then(duck => {
                res.send(View({ body: Detail({ item: duck, favPath: '/fav', backPath: view === 'search' ? `/search?query=${query}` : '/' }) }))
            })
            .catch(error => res.send(error.message))
        
    } catch (error) {
        res.send(error.message)
    }
}) 

app.get('/favlist', (req,res) => {
    debugger
    try {
        const {session} = req

        if(!session) return res.redirect('/')

        const {userId: id, token} = session

        if(!token) res.redirect('/')

        let name

        retrieveUser(id, token)
            .then(user => {
                name = user.name

            retrieveFavDucks(id,token) 
                .then(ducks => {
                    res.send(View({ body: Search({ results: ducks, favPath: '/fav', name, logout: '/logout', detailPath: '/ducks', myFavs: '/favlist' })}))
                })
                .catch( ()=> res.send('error in async favList'))
            })
            .catch(()=> res.send('error'))


        
    } catch (error) {
        res.send(error.message + ' sync favList')
        
    }
})

app.listen(port, () => console.log(`server running on port ${port}`))