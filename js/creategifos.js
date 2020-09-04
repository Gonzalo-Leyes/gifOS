//esta funcion recibe como parametros: el elemento a ocultar, y el elemento a mostrar, de manera que al clickear un boton ocultamos una ventana y se muestra la siguiente.
let choose_display = (hideElement, showElement) => {
    console.log("executed display/hide!");
    hideElement.style.display = "none";
    showElement.style.display = "block";
}

//al clickear el boton de cancelar, se redirecciona a la landing page
const quitCreation = document.getElementById('cancel-create');
quitCreation.addEventListener('click', function (){
    window.location.href = 'index.html';
});

//funcion que completa la barra de duración del gif (estática)
let fillDurationBar = () => {
    barContainer = document.getElementById('bar-container');
    barItem = document.getElementById('bar-item');
    for (let i = 0; i<17; i++) {
        const newItem = document.createElement('div');
        newItem.classList.add('bar-item');
        barContainer.appendChild(newItem);
        if (i>3) {
            newItem.setAttribute("style", "background-color: darkgray");
        }
    }
}
fillDurationBar();

//funcion que completa la barra de subida del gif (estática)
let fillUploadBar = () => {
    upBarContainer = document.getElementById('upbar-container');
    upBarItem = document.getElementById('upbar-item');
    for (let i = 0; i<23; i++) {
        const newItem = document.createElement('div');
        newItem.classList.add('upbar-item');
        upBarContainer.appendChild(newItem);
        if (i>7) {
            newItem.setAttribute("style", "background-color: darkgray");
        }
    }
}
fillUploadBar();


//se inicializa la variable global para luego reemplazarlo con la url del blob.
let blobData;
let myBlob = [];

//Esta funcion nos permite ver un live streaming de la camara. Recibe como parametro el elemento video para añadirle un source y poder visualizarlo.
let streamPreview = (videoTag) => {
    if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: {width:730, height: 450}, audio: false})
        .then (function (stream) {
            videoTag.srcObject = stream;
            console.log("Camera stream started");
        })
        .catch (function (error) {
            console.log("Error, couldn't acces camera!");
            alert('No se pudo obtener permiso para utilizar la camara, por favor vuelva a cargar la pagina');
        });
    }
}
//Esta funcion detiene el live streaming de la camara. Recibe como parametro el elemento video para añadirle un source y poder visualizarlo.
let stopStreamPreview = (videoTag) => {
    var stream = videoTag.srcObject;
    var tracks = stream.getTracks();
  
    for (var i = 0; i < tracks.length; i++) {
      var track = tracks[i];
      track.stop();
    }
  
    //videoTag.srcObject = null;
    console.log("camera stream stopped");
}

const triggerCamera = document.getElementById('start-create');
const testSection = document.querySelector('#camera-container');
testSection.style.display = "none";
let videoElement = document.querySelector('#videoElement');
const instructions = document.getElementById('instructions-window'); 

triggerCamera.addEventListener('click', ()=> {streamPreview(videoElement); choose_display(instructions, testSection);});

const recordSection = document.querySelector('#recording-container');
recordSection.style.display = "none";
let capture_button = document.getElementById('start-capture');
let streamGif = document.getElementById('videoBeforeGif');



capture_button.addEventListener('click', ()=> {stopStreamPreview(videoElement); choose_display (testSection, recordSection); streamPreview(streamGif);  recordGif();} );

const videoWindow = document.getElementById('recording-preview');
let gifElement = document.getElementById('gifElement');
gifElement.style.display = "none";
const stopGif = document.getElementById('stop-recording');

let recorderData = "";
 //Funcion que nos permite grabar nuestro gif hasta pulsar el boton para detener la grabacion y mostrarlo.
let recordGif = () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
    .then(async function(stream) {
        let recorder = RecordRTC(stream, {
            type: 'gif'
        });
        console.log('starting gif recording');
        recorder.startRecording();

        stopGif.addEventListener('click', () => {
        stopStreamPreview(streamGif);
        recordSection.style.display="none";

        recorder.stopRecording();
        console.log('gif recording stopped');
        let blob = recorder.getBlob();
        blobData = blob;
        recorderData = recorder;
        console.log(blob);
        let urlblob = recorder.toURL();
        console.log(urlblob);
        myBlob.push(urlblob)
        gifElement.setAttribute('src', urlblob);
        gifElement.style.display="block";  
        })
        
    })
    .catch (function (error) {
        console.log("Error, couldn't acces camera!");
        alert('No se pudo obtener permiso para utilizar la camara, por favor vuelva a cargar la pagina');
    });;  
}

//como indica el nombre de la funcion, guarda el gif en Local Storage para luego acceder a buscar allí los gifs a cargar en la seccion "Mis guifos".
let saveGifInLocalStorage=(data) => {
    const gifURL = data.data.images.downsized.url;
    if (localStorage.getItem("GifsURL")) {
        const currentGifsURL = JSON.parse(localStorage.getItem("GifsURL"));
        currentGifsURL.push(gifURL);
        localStorage.setItem("GifsURL", JSON.stringify(currentGifsURL));
    } else {
        localStorage.setItem("GifsURL", JSON.stringify([gifURL]));
    }
    console.log("gif saved in local storage");
}

//funcion que, una vez subido el gif a la API, lo trae con su URL para mostrar la vista previa junto con las opciones para copiar el enlace o descargar el gif.
let previewGif=(data) => {
    const gifPreviewUrl = data.data.images.downsized.url;
    console.log(gifPreviewUrl);
    const gifPreview = document.createElement("img");
    gifPreview.setAttribute("src", gifPreviewUrl);
    gifPreview.setAttribute("class", "gif-uploaded");
    gifPreview.setAttribute("id", "gif-uploaded");
    console.log("previewGif executed");
    let savedGifWindow = document.getElementById('savedgif-window');
    savedGifWindow.appendChild(gifPreview);
    //savedGifWindow.style.display = 'block';
    //const downloadUrl = document.getElementById("gif-uploaded").src;
    //console.log(downloadUrl);
    let downloadLink = document.getElementById("download-link");
    downloadLink.setAttribute("href", gifPreviewUrl);
    console.log("Enlace del gif", downloadLink);

    let copyBtn = document.getElementById("copylink-btn");
    copyBtn.addEventListener("click", function () {
        const copyText = document.createElement("input");
        copyText.value = gifPreviewUrl; //document.getElementById("gif-uploaded").src;
        document.body.appendChild(copyText);
        copyText.select();
        document.execCommand("copy");
        console.log("la concha de tu hermana");
        copyText.style.display = "none";

  });
}



let galleryContainer = document.getElementById ('customgif-display');

function customGifGallery() {
    if (localStorage.getItem("GifsURL")) {
      const gifsURL = JSON.parse(localStorage.getItem("GifsURL"));
      gifsURL.map(function (e) {
        const currentGif = e;
        const gifImg = document.createElement("IMG");
  
        gifImg.setAttribute("src", currentGif);
        gifImg.setAttribute("class", "mygif-item");
        gifImg.setAttribute("id", "mygif-item");
  
        galleryContainer.appendChild(gifImg);
      });
    }
  }
customGifGallery();

let recordedGifWindow = document.getElementById('preview-container');
recordedGifWindow.style.display = "none";
let uploadWindow = document.getElementById('upload-window');
uploadWindow.style.display = "none";
stopGif.addEventListener('click', () => {choose_display(recordSection, recordedGifWindow);});
let controller = new AbortController();
let signal = controller.signal
let cancelUpload = () => {
    controller.abort();
    console.log("Upload aborted");
    window.location.href = "creategifos.html";

}


let uploadBlob = () => {
        
        let form = new FormData();
        form.append("file", blobData, "myGif.gif");

        const apiKey = 'eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf';
        const endpoint = `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`;

        fetch(endpoint, {
            signal,
            method: "POST",
            body: form,
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const myGif = data.data.id;
            if (localStorage.getItem("MyGifs")) {
              const myCurrentGifs = JSON.parse(localStorage.getItem("MyGifs"));
              myCurrentGifs.push(myGif);
              localStorage.setItem("MyGifs", JSON.stringify(myCurrentGifs));
            } else {
              localStorage.setItem("MyGifs", JSON.stringify([myGif]));
            }
    
            const id = JSON.parse(localStorage.getItem("MyGifs"));
            const length = id.length;
            const uploadGif = id[length - 1];
    
            const key = 'eSKl3Klsw1ostnWJkPttlnG6Y26OlGbf';
            const idEndpoint = `https://api.giphy.com/v1/gifs/${uploadGif}?api_key=${key}`;
    
            fetch(idEndpoint)
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                  console.log("saving gif...");
                saveGifInLocalStorage(data);
                previewGif(data);
              })
              .catch(function (error) {
                return error;
              });
          })
        .catch(function (error) {
            return error;
        });

}

let repeatButton = document.getElementById ('repeat-create');
repeatButton.addEventListener('click', cancelUpload);

let uploadButton = document.getElementById('upload-btn');
uploadButton.addEventListener('click', () => {choose_display(recordedGifWindow, uploadWindow); uploadBlob(); uploadingScreen();});

let abortButton = document.getElementById('cancel-upload');
abortButton.addEventListener('click', cancelUpload);

let saveScreen = document.getElementById('savescreen-container');
saveScreen.style.display = "none";
let uploadingScreen = () => {
    setTimeout(function() {choose_display(uploadWindow, saveScreen)} , 3500);
}


let displayMyGifs = () => {
    for (let i=0; i< myBlob.length; i++) {
        let window = document.createElement('div');
        let newGif = document.createElement('img');
        newGif.setAttribute('style', 'height: 280px');
        newGif.id = 'newGif'+[i];
        checkExistingBlobs();
        newGif.src = myBlob[i];
        window.appendChild(newGif);
    }

}

displayMyGifs();

let endButton = document.getElementById('end-button');
endButton.addEventListener('click', function () {
    saveScreen.style.display = "none";
    if (localStorage.getItem("GifsURL")) {
        const gifsURL = JSON.parse(localStorage.getItem("GifsURL"));

          const currentGif = gifsURL[gifsURL.length - 1];
          const gifImg = document.createElement("IMG");
    
          gifImg.setAttribute("src", currentGif);
          gifImg.setAttribute("class", "mygif-item");
          gifImg.setAttribute("id", "mygif-item");
    
          galleryContainer.appendChild(gifImg);
        
      }
});