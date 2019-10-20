
//instancias de view para abrir y cerrar paneles
var views = document.getElementsByClassName('view');
var searchView = new View(views[0]);
var detailView = new View(views[1]);

//panel para el registro de usuario

var register = new Register(document.getElementsByClassName('register__form')[0]);

register.onSubmit(function (name, surname, email, password) {
   
   try {
       registerUser(name, surname, email, password, function(){
           document.getElementsByClassName('register')[0].classList.add('hide')
           document.getElementsByClassName('search')[0].classList.remove('hide')
           document.getElementsByClassName('ducks')[0].classList.remove('hide')
       });
   } catch (error) {
       feedback.render(error.message);
       document.getElementsByClassName('feedback')[0].classList.remove('hide')
       document.getElementsByClassName('main')[0].classList.add('hide')
   }
});

//panel de login

// var login = new Login(document.getElementsByClassName('login__button')[0]);
// var message = document.getElementById('message');

// login.onSubmit(function (username, password){
//     retrieveUser(username, password, function(error, username){
//         if(username !== mail && pass !== password){
//             feedback.render(error.message);
    
//             feedback.show();
//         } else {
//             event.preventDefault();
//             login.hide();
//             searchView.show();            
//             message.innerHTML = "Hello " + event.target.username.value;
//             message.style.display = 'block';
//         }

//     })

// });


//funcion para que salgan patos random al cargar la pagina
(function () {
    searchDucks('', function (error, ducks) {
        if (error) {
            feedback.render(error.message);

            results.hide();
            feedback.show();
        } else {
            ducks = ducks.shuffle().splice(0, 3);

            results.render(ducks);
        }
    });
})();


//panel de búsqueda, si se introduce algun input que no concuerda con ningun pato
//saltará error, sino la lista con todos los patos que cumplan
var button = new Search(document.getElementsByClassName('search__form')[0]);
button.onSubmit(function (query) {
    searchDucks(query, function (error, ducks) {
        if (error) {
            feedback.render(error.message);

            results.hide();
            feedback.show();
        } else {
            results.render(ducks);

            feedback.hide();
            results.show();
        }
    });
});

//panel para mostrar los resultados de búsqueda, añadiendo el onclick para que cada pato pueda ser pulsado

var results = new Results(document.getElementsByClassName('item-list')[0]);
results.onItemRender = function () {
    var item = new ResultItem(document.createElement('li'));
    
    item.onClick = function (id) {
        retrieveDuck(id, function (error, duck) {
            if (error) {
                feedback.render(error.message);

                results.hide();
                feedback.show();
            } else {
                detail.render(duck);
                document.getElementsByClassName('ducks')[0].classList.add('hide')
                document.getElementsByClassName('detail')[0].classList.remove('hide')
                // searchView.hide();
                // detailView.show();
            }
        });
    };

    return item;
};

//panel de detalles, cuando un pato es pulsado se abre un nuevo panel con los detalles
var detail = new Detail(document.getElementsByClassName('result')[0]);

detail.onBack = function () {
    document.getElementsByClassName('ducks')[0].classList.remove('hide')
    document.getElementsByClassName('detail')[0].classList.add('hide')
    // detailView.hide();
    // searchView.show();
};

//panel de feedback
var feedback = new Feedback(document.getElementsByClassName('feedback')[0]);


//botones para cambiar de registro a login y viceversa 
var gologin = document.getElementsByClassName('register__gologin')[0];
var goregistrer = document.getElementsByClassName('login__goregistrer')[0];

goregistrer.addEventListener('click', function(){  
    document.getElementsByClassName('login')[0].classList.add('hide')
    document.getElementsByClassName('register')[0].classList.remove('hide')
})
gologin.addEventListener('click', function(){    
    document.getElementsByClassName('login')[0].classList.remove('hide')
    document.getElementsByClassName('register')[0].classList.add('hide')
})