/*function display_theme () {
    const div = document.getElementById('custom-options');
    div.style.display = div.style.display == "block" ? "none" : "block";
} */

//El parametro trigger es el disparador del evento, es decir el elemento a clickear que hará que se muestre lo que deseamos.
//El parametro wanted es el que deseamos mostrar. Para ocultarlo clickeamos cualquier lugar que no fuesen el trigger ni wanted.
let hideOrShow = (trigger, wanted) => { 
    document.addEventListener('click', function(event) {
        isTriggered = trigger.contains(event.target);
        if (isTriggered) {
            wanted.style.display = 'block';
        } else {
            wanted.style.display = 'none';
            
        }
    })
}
//Utilizamos la funcion hideOrShow para mostrar/ocultar el desplegable de seleccion de temas.
const thButton = document.getElementById("theme-select");
const showOptions = document.getElementById("custom-options");
thButton.addEventListener ('click', hideOrShow(thButton, showOptions));

//utilizamos la funcion hideOrShow para mostrar/ocultar el desplegable de sugerencias al clikear la barra de busqueda.
const focusSearch = document.getElementById("searchbox");
showSuggestions = document.getElementById("focus_suggested");
focusSearch.addEventListener('click', hideOrShow(focusSearch, showSuggestions));

//-------------------------------------------------------------------------
//esta funcion establece/remueve las clases del contenedor general para aplicar los estilos del tema Sailor Night
const mainColor = document.getElementById("main");
let setNightTheme = () => {
    mainColor.classList.remove('light');
    mainColor.classList.add('night');
}
 //verificamos el boton clickeado para aplicar el estilo correspondiente y guardamos en local storage el valor para recordar el tema aplicado
const night = document.getElementById("night-theme")
night.addEventListener('click', function(){
    if (mainColor.classList.contains('light')) {
        setNightTheme();
        window.localStorage.setItem("theme", "night");
    }
});

//esta funcion establece/remueve las clases del contenedor general para aplicar los estilos del tema Sailor Night
let setLightTheme = () => {
    mainColor.classList.remove('night');
    mainColor.classList.add('light');
}
//verificamos el boton clickeado para aplicar el estilo correspondiente y guardamos en local storage el valor para recordar el tema aplicado
const day = document.getElementById("day-theme");
day.addEventListener('click', function(){
    if (mainColor.classList.contains('night')) {
        setLightTheme();
        window.localStorage.setItem("theme", "light");
    }
});

//la funcion "recuerda" el tema aplicado si la pagina se recarga o si se vuelve a ingresar luego de cerrarla.
let remember_color = () => {
    let storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light") {
        setLightTheme();
    } else { if (storedTheme ==="night") {
        setNightTheme();
    }}
}

window.onload = remember_color();
//-----------------------------------------------------------------------------------



//traigo los gifs para mostrar hasta 4 en la seccion de "hoy te recomendamos"
let suggestedGifs = fetch("https://api.giphy.com/v1/gifs/trending?api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf&offset=20&limit=4");
suggestedGifs
    .then(response => response.json())
    .then(datos => {
        for (let i = 0; i < datos.data.length; i++) {
            let url = (datos.data[i].images.original.url);
            let window = document.createElement('div');
            let bar = document.createElement('div');
            let title = document.createElement('h4');
            let closeBtn = document.createElement('img');
            let gifCont = document.createElement('div');
            let newGif = document.createElement('img');
            let moreBtn = document.createElement('button');
            let gifSuggest = document.getElementsByClassName('today-display')[0];
            window.className = 'window';
            bar.className = 'bar';
            closeBtn.src = './assets/button3.svg';
            closeBtn.className = 'closeBtn';
            gifCont.className = 'gif';
            newGif.setAttribute('style', 'height: 280px');
            newGif.id = 'newGif'+[i];
            moreBtn.className = 'more';
            gifSuggest.appendChild(window);
            window.appendChild(bar);
            window.appendChild(gifCont);
            bar.appendChild(title);
            bar.appendChild(closeBtn);
            gifCont.appendChild(newGif);
            gifCont.appendChild(moreBtn);
            moreBtn.setAttribute('type', 'button');
            let btnText = document.createElement('p');
            btnText.innerHTML = 'Ver más...';
            moreBtn.appendChild(btnText);
            document.getElementById('newGif'+[i]).src = url;
            console.log(url);
            titleString = datos.data[i].title;
            titleArray = titleString.split(' ');
            title.innerHTML = '#' + titleArray[0] + '#' + titleArray[1] + '#' + titleArray[2];
        };
        console.log(datos);
    })
    .catch(error => console.log(error))


//llamamos a la API de trending, pasamos a json, y con el forEach creamos el grid con los gif.
function recommendedGifs () {
    let j = 0
    const gifSource = 'https://api.giphy.com/v1/gifs/trending?api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf&tag=&rating=g&limit=35';
    const dataFetch = fetch(gifSource)
    .then(response => response.json())
    .then (datajson => datajson.data.forEach(item => {
        gridContainer = document.getElementById ("trending-container");
        const innerGrid = document.createElement('div');
        innerGrid.classList.add('trending-grid');
        let window = document.createElement('div');
        window.classList.add('frame');
        const gif = document.createElement('img');
        let title = document.createElement('h4');
        gif.setAttribute('src', item.images.original['url']);
        gif.setAttribute('style', 'height: 280px');
        console.log(gif);
        window.appendChild(gif);
        window.appendChild(title);
        innerGrid.appendChild(window);
        gridContainer.appendChild(innerGrid);
        titleString = datajson.data[j].slug;
        titleArray = titleString.split('-');
        title.innerHTML = '#' + titleArray[0] + '#' + titleArray[1] + '#' + titleArray[2];
        j++;
    }))
    .catch(error => console.log(error))
    console.log(dataFetch);
    
}
recommendedGifs();

       
 //En base a lo que se ingrese en el input, y una vez se presione el botón de busqueda o "enter", se mostrarán los gifs relacionados.
 let search = () => {
    for (let n=0; n<=3; n++) {
        document.getElementsByClassName('window')[n].style.display = 'none';
    } 
    let searchTerm = document.getElementById('searchbox').value;
    let searchTermClean = searchTerm.replace(' ','+')
    console.log(searchTermClean);
    let searchGif = fetch('https://api.giphy.com/v1/gifs/search?&api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf&q='+searchTermClean+'&limit=12')
    searchGif
        .then(response => response.json())
        .then(datos => {
            console.log(datos);
            for (let i = 0; i < datos.data.length; i++){
                let url = (datos.data[i].images.downsized_large.url);
                let newDiv = document.createElement('div');
                let newGif = document.createElement('img');
                let gifResults = document.getElementById('today-display');
                newGif.id = 'newGifSearch'+[i];
                newDiv.className = 'gifCont';
                newDiv.appendChild(newGif);
                gifResults.appendChild(newDiv);
                document.getElementById('newGifSearch'+[i]).src = url;
                //document.getElementById('searchResults').style.display = 'block';
                //document.getElementById('trending').style.display = 'none';
                document.querySelector('.section-title').innerHTML = 'Resultados para: ' + searchTerm;
                console.log(searchTerm);
                document.getElementById('searchbox').value = '';
                //document.getElementsByClassName('autocomplete')[0].classList.remove('display');
            }
        })
        .catch(error => console.log(error))
}
document.getElementById('search').addEventListener('click',search); //execute function on search button press
document.getElementById('searchbox').addEventListener("keyup", function(event) { //execute function if enter is pressed instead
    if (event.key === "Enter") {
        search();
    }
})


//según lo ingresado en el input, se muestran palabras sugeridas para la busqueda.
document.getElementById('searchbox').addEventListener('input',autocomplete);
function autocomplete() {
    let auto = document.getElementsByClassName('suggestion-bar');
    let searchTerm = document.getElementById('searchbox').value;
    console.log(searchTerm);
    let searchTermClean = searchTerm.replace(' ','+')
    console.log(searchTermClean);
    url = 'https://api.giphy.com/v1/gifs/search/tags?&api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf&q='+searchTermClean+'&limit=3'
    let autocompleteSugg = fetch(url);
    autocompleteSugg
        .then(response => response.json())
        .then(datos => {
            console.log(datos);
            for (let i = 0; i < datos.data.length; i++) {
                auto[i].innerHTML = datos.data[i].name;

            }
        })
}

//after the suggestion is clicked, the input will be autocompleted with the word suggested...
let autoFill = (a) => {
    console.log(a);
    let searchInput = document.getElementById('searchbox');
    suggName = document.getElementsByClassName('suggestion-bar')[a];
    console.log(suggName);
    searchInput.value = suggName.innerText;
}

//Click autocomplete
document.getElementsByClassName('suggestion-bar')[0].addEventListener('click',() => autoFill(0));
document.getElementsByClassName('suggestion-bar')[1].addEventListener('click',() => autoFill(1));
document.getElementsByClassName('suggestion-bar')[2].addEventListener('click', () => autoFill(2)); 

//traigo los gifs de trending para mostrar en la seccion que se encuentra abajo de todo.
   /* let trendingGifs = fetch("https://api.giphy.com/v1/gifs/trending?api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf&tag=&rating=g");
    trendingGifs
        .then(response => response.json())
        .then(datos => {
            for (let i = 0; i < datos.data.length; i++) {
                let url = (datos.data[i].images.original.url);
                let window = document.createElement('div');
                let bar = document.createElement('div');
                let title = document.createElement('h4');
                let gifCont = document.createElement('div');
                let newGif = document.createElement('img');
                let gifTrending = document.getElementsByClassName('trending-container')[0];
                window.className = 'trending-window';
                bar.className = 'bar';
                gifCont.className = 'gif';
                newGif.setAttribute('style', 'height: 280px');
                newGif.id = 'newGif'+[i];
                gifTrending.appendChild(window);
                window.appendChild(bar);
                window.appendChild(gifCont);
                bar.appendChild(title);
                gifCont.appendChild(newGif);
                document.getElementById('newGif'+[i]).src = url;
                console.log(url);
                titleString = datos.data[i].title;
                titleArray = titleString.split(' ');
                title.innerHTML = '#' + titleArray[0] + '#' + titleArray[1] + '#' + titleArray[2];
            };
            console.log(datos);
        })
        .catch(error => console.log(error))

*/

//---------------------------------
/* 
document.querySelector('.custom-select-wrapper').addEventListener('click', function() {
    this.querySelector('.custom-select').classList.toggle('open');
})
for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select_trigger span').textContent = this.textContent;
        }
    })
}
window.addEventListener('click', function(e) {
    const select = document.querySelector('.custom-select')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
    }
}); */

/* https://api.giphy.com/v1/gifs/dog?api_key=eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf */

/*https://api.giphy.com/v1/gifs/search/tags?api_key={tu api key aqui}&q={lo que quieran autocompletar}*/

/*
function getSearchResults(search) {
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            return error;
        });
    return found;
}
*/ 