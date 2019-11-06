const express = require('express')
const Landing = require('./components/landing')

const { argv: [, , port = 8080] } = process

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Duck App</title>
        <link rel="stylesheet" href="index.css">
        <link rel="shortcut icon" href="icon.png" type="image/x-icon">
    </head>
    
    <body>
        ${Landing()}
    </body>
</html>`) // TODO
})

app.listen(port, () => console.log(`server running on port ${port}`))

