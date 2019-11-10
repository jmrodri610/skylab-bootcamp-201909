
const queryString = require('querystring')

module.exports = function (req,callback){
    let content = ''
    req.on('data', chunk => { content += chunk})
    req.on('end', () => {
        const body = queryString.parse(content)
        callback(body)
    })

}