// console.log('hola mundo!');
// const noCambia = "Leonidas";

// let cambia = "@LeonidasEsteban"

// function cambiarNombre(nuevoNombre) {
//     cambia = nuevoNombre
// }

// const getUserAll = new Promise(function(todoBien, todoMal) {
//     // llamar a un api
//     setTimeout(function() {
//         // luego de 3 segundos
//         todoBien('se acabó el tiempo');
//     }, 5000)
// })

// const getUser = new Promise(function(todoBien, todoMal) {
//     // llamar a un api
//     setTimeout(function() {
//         // luego de 3 segundos
//         todoBien('se acabó el tiempo 3');
//     }, 3000)
// })

// // getUser
// //   .then(function() {
// //     console.log('todo está bien en la vida')
// //   })
// //   .catch(function(message) {
// //     console.log(message)
// //   })

// Promise.race([
//         getUser,
//         getUserAll,
//     ])
//     .then(function(message) {
//         console.log(message);
//     })
//     .catch(function(message) {
//         console.log(message)
//     })



// // CON JQUERY XMLHttpRequest
// // $.ajax('url', {
// $.ajax('https://randomuser.me/api/', {
//     method: 'GET',
//     //   Tenemos cuatro métodos method:
//     // • GET: traemos datos desde alguna API.
//     // • PUSH: enviamos datos a algún servidor.
//     // • PUT: Actualizar datos.
//     // • DELETE: borrar datos.
//     success: function(data) {
//         // sirve como una funcion cuando todo esta bien
//         console.log(data)
//     },
//     error: function(error) {
//         // sirve como una funcion cuando todo esta mal
//         console.log(error)
//     }
// })

// // CON VANILLA JS
// fetch('https://randomuser.me/api/')
//     // elemento de fetch debuelve una promesa
//     // por defecto usa el metodo get
//     .then(function(response) {
//         // console.log(response)
//         return response.json()
//     })
//     .then(function(user) {
//         console.log('user', user.results[0].name.first)
//     })
//     .catch(function() {
//         console.log('algo falló')
//     });
// // para acabar una promesa se indioca con ;


// Funciones asincronas
(async function load() {
    // hace que las peticiones esperen
    // await 
    // action
    // terror
    // animation
    async function getData(url) {
        // fetch de algun servicio y esperamos a que se resuelva
        const response = await fetch(url)
            // invocamos a su metodo json
        const data = await response.json()
            // para retornar datos y evitar errores de busquenas no existentes, es decir
            // cuando data.data.movie_count es 0 significa que no devuelve ningun array porque no 
            // existe ninguna pelicula con ese nombre por lo tanto si es > 0 significa que si encontro peliculas
        if (data.data.movie_count > 0) {
            // aqui se acaba
            return data
        }
        // si no hay pelis aqui continua
        // throw new Error('No se encontro nigun resultado'), manda el mensaje personalizado, esta conectado con el catch(error)
        throw new Error('No se encontró nigun resultado')
    }

    // selector de form para poder buscar en el inicio
    const $form = document.querySelector('#form')
        // y uno ultimo pra toda la home
    const $home = document.getElementById('home')
        // necesitamos un selector para nuestro formulario (toda la home)
    const $featuringContainer = document.querySelector('#featuring')



    // funcion para poner multiples atributos de una sola pasada y que la utilizamos en el loader del submit
    // recibe de parametros al elemento que le voy a cambiar los atributos y luego recibe un objeto con los atributos
    function setAttributes($element, attributes) {
        // for in el cual sera un ciclo que iterara n veces dependiendo del numero de elementos que tenga dentro del objeto
        // tendremos una constante llamada atribute que recibira los valores del src del height y del width
        for (const attribute in attributes) {
            // llamamos a $element.setAttribute funcion de mi elemnteo html como parametro que elento quiero manipular attribute, y que quiero pnerle de valor a este atributo pues attributes[attributes]
            $element.setAttribute(attribute, attributes[attribute])
        }
    }

    // constante de la api del inicio porque siempre inicia igual
    const BASE_API = 'https://yts.lt/api/v2/'


    // renderizado de la pelicula con un template en base texto

    function featuringTemplate(peli) {
        return (
            `
            <div class="featuring">
                <div class="featuring-image">
                    <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
                </div>
                <div class="featuring-content">
                    <p class="featuring-title">Pelicula encontrada</p>
                    <p class="featuring-album">${peli.title}</p>
                </div>
            </div>
            `
        )
    }


    // asignamos un evento formulario con una funcion que encuentre peliculas
    $form.addEventListener('submit', async(event) => {
        // para evitar que la pagina se recargue ya que es una caracteristica de submit
        event.preventDefault()
        $home.classList.add('search-active')
            // creacion de elementos y asignacion de atribtutos
            // para crear un documento html desde cero se hace con document.createElement ('')
            // img de cargando louder
        const $loader = document.createElement('img')
            // invocando funcion de setAttributes- le pasamos el $loader, y los atributos que yo quiera ponerle {que sera un objeto}
        setAttributes($loader, {
                src: 'src/images/loader.gif',
                height: 50,
                width: 50,
            })
            // ponemos el $loader dentro del emento que se ve cuando busco algo
        $featuringContainer.append($loader)

        // formularios
        // para obtener el dato del texto de la pelicula que estoy buscando
        // con FormData podremos hacer un formulario al cual le pasamos como parametro un elemento html de formulario
        // este tambien tiene seters y geters para enviar y obtener datos
        const data = new FormData($form)
            // nueva peticion en este elemento (pericion asincrona poniendo async en  async(event))  y await abajo para que una se haga despues de la otra

        // try ---catch marca un bloque de instrucciones para intentar(try), y especifica una respuesta si se produce una excepcion(catch)  
        // lo que significa vamos a volar un bleque de codigo y si hay algun problema entramos a otra parte para manejar esa excepcion
        try {
            // query_term= para llamar a als peliculas por su nombre
            // limit=1& para limitar el numero de peliculas que de como resultado

            // desestructuracion de objetos
            const {
                // busca el key data
                data: {
                    // busca el key movies y le pone el nombre pelis
                    movies: pelis
                }
            } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`)
                // dato que necesitamos obtener name
                // data.get('name')
                // esto nos devuelve un HTMLString
            const HTMLString = featuringTemplate(pelis[0])
                // tomamos este template  y combertirlo en html pero como se reemplaza por un nuevo contenido hacemos un hack con innerHTML para remmplazar directamente un HTMLString en un elemento
            $featuringContainer.innerHTML = HTMLString
        } catch (error) {
            // mandamos alerta con el mensaje de error.message para que no aparesca error:
            alert(error.message)
                // removemos el $loader
            $loader.remove()
                // quitarle la clase al home para que la parte blanca no aparesca
                // nota classList clases de $home
            $home.classList.remove('search-active')
        }
    })



    // console.log(actionList, dramaList, animationList)
    // debugger
    // creamos una funcion solo para el template
    function videoItemTemplate(movie, category) {
        // category, movie-id, se agregan para que salga la info de cada pelicula  en el modal category se agraga tambien en renderMovieList como parametro
        return (
            `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
              <div class="primaryPlaylistItem-image">
                <img src="${movie.medium_cover_image}">
              </div>
            <h4 class="primaryPlaylistItem-title">
              ${movie.title}
            </h4>
          </div>`
        )
    }
    // funcion para crear el template

    function createTemplate(HTMLString) {
        // crearemos un DOM a partir de un HTMLString, crearemos dentro de memoria de js un documento html, con una funcion de document
        const html = document.implementation.createHTMLDocument()
            // metodo innerHTML mete los documentos html y lo comvierte y lo pega dentro de si mismo 
        html.body.innerHTML = HTMLString
            // html.body.children[0] es el elemnto que acabamos de agregar y el queremos 
            // children devuelve un arrar una lista y el elemento cero en el que acabamos de agregar 

        // para poder guardarla tenemos que retornar el valor de html.body.children[0]
        return html.body.children[0]
    }

    function addEventClick($element) {
        $element.addEventListener('click', () => {
            // alert('click')
            // showModal() para que se active cuando se activa el evento
            // le pasamos $element para que muestre la info de la peli y en videoTemplate se le agregan mas cosas
            showModal($element)
        })
    }

    // funcion para el renderizado de las peliculas
    function renderMovieList(list, $container, category) {
        // para quitar el logo de cargando, buscamos el elemento dentro del container, en su hijo 0 porque es el unico elemnto que tenia hasta antes de imprimir las peliculas
        $container.children[0].remove()
            // iterando las listas de peliculas
            // actionList.data.movies
        list.forEach((movie) => {
            // forEach hace que el elemento sea iterable
            // crea un template de la pelicula
            // enviamos la categoria a el elemnto que crea el videoItemTemplate
            const HTMLString = videoItemTemplate(movie, category)
            const movieElement = createTemplate(HTMLString)
                // metodo append agrega el elemento al final del contenedor
            $container.append(movieElement)
                //  dentro de este buscamos el tag img movieElement y lo asignamos a un evento que se lanzara cuando se hallan cargado todos los datos de la imagen
            const image = movieElement.querySelector('img')
            image.addEventListener('load', (event) => {
                // animando las peliculas despues de que $container se halla pegado a la interface
                // movieElement = event.srcElement, debido a que event tiene muchos elementos como quien lo lanzo, donde, etc
                event.srcElement.classList.add('fadeIn')
            })
            addEventClick(movieElement)
        })
    }

    // si hay datos alamcenados hay que traerlos y si no hay datos almacenados tenemos que pedirlos
    // pregunta a la funcion si existe
    async function cacheExist(category) {
        // por categoria que reciva y lo conviete en List gracias a los template literals
        const listName = `${category}List`
            // validar si el elemnto existe o no existe dentro del localStorage
        const cacheList = window.localStorage.getItem(listName)
            // y si existe la retornara convertida en un objeto
        if (cacheList) {
            // si ya tengo cache le retornamos los datos del cacheList pero hay que convertirlo a objeto ya que lo que esta dentro de un localStorage es texto
            return JSON.parse(cacheList)
        }
        // y si no hay info hacemos la peticion, 
        // obtiene los datos
        // ${category} lo volvemos dinamico para cada categoria
        const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`)
            //  setea los datos, cuando no encuentro datos tenemos que setear ese cache
        window.localStorage.setItem(listName, JSON.stringify(data))
            // retorna los datos
        return data
    }
    // gracias a esta funcion cambiaremos los datos de abajo en dondepide la api para cada categoria




    // 1peticion
    // 2renderizado

    // con await
    // desestructurando actionList {data: {movies: actionList}} des
    // const { data: { movies: actionList } } = await getData(`${BASE_API}list_movies.json?genre=action`)  --- se cambia por que ya lo sacamos en cacheExist
    // la linea de arriba cambia a la de abajo para poder uusar la funcion cacheExist
    const actionList = await cacheExist('action')
        // localStorage solo se puede guardar texto plana no datos 
        // setItem setea un nuevo dato
        // JSON.stringify(actionList)) objeto a texto  volverlo String
        // JSON.parse() convertitlo de texto a objeto
        // window.localStorage.setItem('actionList', JSON.stringify(actionList))---- lo quitamos ya que en la funcion cacheExist ya lo estamos realizando para cada categoria
        // selectores 
    const $actionContainer = document.querySelector('#action')
        // action parametro dinamico
    renderMovieList(actionList, $actionContainer, 'action')
        // selectores


    // const { data: { movies: dramaList } } = await getData(`${BASE_API}list_movies.json?genre=drama`) --- se cambia por que ya lo sacamos en cacheExist
    const dramaList = await cacheExist('drama')
        // localStorage
        // JSON.stringify(actionList)) para volverlo String
        // window.localStorage.setItem('dramaList', JSON.stringify(dramaList)) ---- lo quitamos ya que en la funcion cacheExist ya lo estamos realizando para cada categoria
    const $dramaContainer = document.getElementById('drama')
        // drama parametro dinamico
    renderMovieList(dramaList, $dramaContainer, 'drama')
        // querySelector y getElementById hacen lo mismo


    // const { data: { movies: animationList } } = await getData(`${BASE_API}list_movies.json?genre=animation`) --- se cambia por que ya lo sacamos en cacheExist
    const animationList = await cacheExist('animation')
        // localStorage
        // JSON.stringify(actionList)) para volverlo String
        // window.localStorage.setItem('animationList', JSON.stringify(animationList)) ---- lo quitamos ya que en la funcion cacheExist ya lo estamos realizando para cada categoria
    const $animationContainer = document.getElementById('animation')
        // animation parametro dinamico
    renderMovieList(animationList, $animationContainer, 'animation')

    // 1peticion
    // 2renderizado


    // // con promesas
    // let terrorList;
    // getData('https://yts.lt/api/v2/list_movies.json?genre=terror')
    //     .then(function(data) {
    //         console.log('terrorList', data)
    //         terrorList = data
    //     })
    //     // y con la respuesta hacemos el console log

    // selectores-------
    // en jquery
    // const $home = $('home .list #item')

    // en js
    // los selectores seran los contenedores de las listas de accion, drama y animacion
    // const $actionContainer = document.querySelector('#action')
    // lo pasamos para arriba porque ahi es donde evita errores ya que no estaria definido


    // $modal y $overlay
    const $modal = document.getElementById('modal')
        // necesitamos los selectores que tengan que ver con mi modal
    const $overlay = document.getElementById('overlay')
    const $hideModal = document.getElementById('hide-modal')

    // buscamos elementos destro de mi modal $modal (buscar dentro de modal)
    const $modalTitle = $modal.querySelector('h1')
    const $modalImage = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')
        // selectores----

    // funcion que hace solo el filtrado en el momento de encontrar la pelicula
    function findById(list, id) {
        return list.find(movie => movie.id === parseInt(id, 10))
    }


    // funcion para encontrar pelicula
    function findMovie(id, category) {
        // switch es para que la busqueda de la categoria se dinamica ya sea actionList, drama o animation
        switch (category) {
            case 'action':
                {
                    //     // filtrado de datos para enconrar algo en especial con find
                    //     // debemos tener una lista
                    //     actionList.find(movie => movie.id === parseInt(id, 10))
                    // se paso para arriba para hacer reutilizables las funciones
                    return findById(actionList, id)
                }
            case 'drama':
                {
                    return findById(dramaList, id)
                }
            default:
                {
                    return findById(animationList, id)
                }
        }
    }

    // es lo mismo pero lo de arriba es una arrow function simplificada
    // actionList.find((movie) => {
    //     // parseInt para convertir un string a una numero y recibe el numero a cambiar, y despues en que base se cambiara
    //     return movie.id === parseInt(id, 10)
    // })



    // seleccion de pelicula y mostrar en modal
    // ponemos aqui la funcion ya que todos los selectores de $modal y de $overlay
    function showModal($element) {
        // lo primero que hara sera agregarle el overlay
        $overlay.classList.add('active')
            // cambiamos el estilo del modal para que se muestre
            // $modal.style.animation = 'modalIn .8s fordwars' agregamos una animacion de nombre modalIn que dura 800 ms y que cuando acabe se quede en su estado final
        $modal.style.animation = 'modalIn .8s forwards'
            // para mostrar la informacion que esta dentro del modal
        const id = $element.dataset.id
        const category = $element.dataset.category
        const data = findMovie(id, category)

        // poniendo la informacion en el modal
        $modalTitle.textContent = data.title
        $modalImage.setAttribute('src', data.medium_cover_image)
        $modalDescription.textContent = data.description_full
    }

    // evento de click de $hideModal
    $hideModal.addEventListener('click', hideModal)

    function hideModal() {
        // lo primero que hara sera  quitarle el overlay
        $overlay.classList.remove('active')
            // animacion Out para que salga
        $modal.style.animation = 'modalOut .8s forwards'
    }
    // seleccion de pelicula y mostrar en modal
    // -----------------------------------------------------------------------------------------
    // ---------------------------------reto playlis de amigoss--------------------------------------

    async function getUsersData(url) {
        const response = await fetch(url);
        const data = await response.json();
        if (data.info.results > 0) {
            return data;
        }
        throw new Error('No hay amigos conectados!')
    }

    // declaracion de la api
    const USERS_API = 'https://randomuser.me/api/?results=20';

    const { results: usersList } = await getUsersData(USERS_API);
    const $friendsListContainer = document.querySelector('#friendsList');

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function friendTemplate(user) {
        const { name, picture } = user
        return (
            `<li class="playlistFriends-item" data-firstname="${name.first}">
          <a href="#">
            <img src="${picture.thumbnail}" alt="${name.first} ${name.last} avatar" />
            <span>
              ${capitalize(name.first)} ${capitalize(name.last)}
            </span>
          </a>
        </li>`
        )
    }

    function findByName(name, list) {
        return list.find(element => element.name.first === name)
    }

    function showFriendModal($element) {
        $overlay.classList.add('active');
        $modal.style.animation = 'modalIn .8s forwards';
        const { firstname } = $element.dataset;
        const {
            name,
            picture,
            email,
            dob,
            location,
            phone
        } = findByName(firstname, usersList);
        $modalTitle.textContent = `${capitalize(name.first)} ${capitalize(name.last)}`;
        $modalImage.setAttribute('src', picture.large);
        $modalDescription.innerHTML = `
          <strong>Email:</strong> ${email}<br>
          <strong>Phone:</strong> ${phone}<br>
          <strong>Age:</strong> ${dob.age}<br>
          <strong>Location:</strong> ${capitalize(location.city)}. ${capitalize(location.state)}
        `;
    }

    function userClick($container) {
        const friendsList = Array.from($container.children);
        friendsList.forEach(($element) => {
            $element.addEventListener('click', function() {
                showFriendModal($element);
            })
        })
    }

    function renderFriendsList($container, list) {
        $container.children[0].remove();
        list.forEach((user) => {
            const HTMLString = friendTemplate(user);
            $container.innerHTML += HTMLString;
        })
        userClick($container)
    }

    renderFriendsList($friendsListContainer, usersList);


    // ----------------------------reto Top Ten Mejores Peliculas---------------
    const $myPlaylistContainer = document.querySelector('#myPlaylist');

    function itemTemplate(movie, category) {
        return (
            `<li class="myPlaylist-item" data-id="${movie.id}" data-category="${category}">
      <a href="#">
        <span>
        ${movie.title}
        </span>
      </a>
    </li>`
        )
    }

    function renderFavoriteList(list, $container, category) {
        $container.children[0].remove();
        list.forEach(movie => {
            const HTMLString = itemTemplate(movie, category);
            $container.innerHTML += HTMLString;
        })
        movieClick($container);
    }

    const { data: { movies: scifiList } } = await getData(`${BASE_API}list_movies.json?genre=sci-fi&limit=10`)
    renderFavoriteList(scifiList, $myPlaylistContainer, 'scifi');

})()