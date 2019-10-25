function searchDucks(query, id, token, callback) {
    if (typeof query !== 'string') throw new TypeError(query + ' is not a string');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
    
    call('GET', undefined, query ? 'https://duckling-api.herokuapp.com/api/search?q=' + query : 'https://duckling-api.herokuapp.com/api/search', undefined, function (result) {
        if (result.error) {
            
        callback(new Error(result.error))
        }
        else {
            
            call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, user => {
              
            if(user.error)  callback(new Error(user.error))
            else {
                const { favs } = user.data

                result.forEach(duck => {
                    debugger
                    if(favs.includes(duck.id)) {
                        duck.isFav = true
                    } else {
                        duck.isFav = false
                    }
                    
                });
             
                
            }

            })
            
            result.map(duck => { // normalize image url to image
                duck.image = duck.imageUrl

                delete duck.imageUrl
            })

            callback(undefined, result)
        }
    });
}