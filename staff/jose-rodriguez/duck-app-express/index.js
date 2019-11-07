const express = require('express')
const View = require('./components/view')
const Landing = require('./components/landing')
const Register = require('./components/register')
const Login = require('./components/login')
const Search = require('./components/search')
const querystring = require('querystring')
const registerUser = require('./logic/register-user')
const authenticateUser = require('./logic/authenticate-user')
const searchDucks = require('./logic/search-ducks')
const retrieveUser =  require('./logic/retrieve-user')

const { argv: [, , port = 8080] } = process

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send(View({ body: Landing({ register: '/register', login: '/login' }) }))

})

app.get('/register', (req, res) => {
    res.send(View({ body: Register() }))
})

app.post('/register', (req, res) => {
    let content = ''
    req.on('data', chunk => content += chunk)
    req.on('end', () => {
        const { name, surname, email, password } = querystring.parse(content)

        try {
            registerUser(name, surname, email, password, error => {
                if (error) res.send('bad request')
                else res.redirect('/login')
                // else res.send('ok')
            })
        } catch (error) {
            //something
        }
    })
})

app.get('/login', (req, res) => {
    res.send(View({ body: Login() }))
})

app.post('/login', (req,res) => {
    let content = ''
    req.on('data', chunk => content += chunk)
    req.on('end', () => {
        const {email, password} = querystring.parse(content)
        try {
            authenticateUser(email,password, (error, data) => {
                const {id,token} = data

                retrieveUser(id,token, (error, data)=>{
                    if(error) return res.send(error)
                    res.send(data)
                })
                

                if (error) res.send('user or password incorrect')
                else res.redirect('/search')
                // else res.send(`login ok. id: ${id} and token: ${token}`)
            })

        } catch (error) {
            //something
        }
    })
})

app.get('/search', (req, res) => {
    const {query: {q}}=req

    if (!q) res.send(View({ body: Search({path: '/search'}) }))
    else {
        try {
            searchDucks(q, (error,ducks) => {
                if (error) return res.send('error')
                res.send(View({ body: Search({path:'/search',query}) }))
            })
        }catch(error) {

        }
    }
})

app.listen(port, () => console.log(`server running on port ${port}`))