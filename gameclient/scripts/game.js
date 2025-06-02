const imgPaths = [
    "images/contact_n.png",
    "images/contact_ne.png",
    "images/contact_e.png",
    "images/contact_se.png",
    "images/contact_s.png",
    "images/contact_sw.png",
    "images/contact_w.png",
    "images/contact_nw.png",
  ];

const directionMapping = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]

var contactImages

var mapData = []
var canvas

$(document).ready(async function() {

    contactImages = await preloadImages(imgPaths)

    canvas = document.getElementById("map-canvas")
    if (canvas.getContext) {
        console.log("This browser supports canvas")

        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();

        // redrawMap()
        setInterval(updateData, 1000)
    }
    else {
        console.log("This browser does not support canvas")
    }
});

function preloadImages(paths) {
    const promises = paths.map((path) => {
      return new Promise((resolve, reject) => {
        const image = new Image();
  
        image.src = path;
  
        image.onload = () => resolve(image);
        image.onerror = () => reject(`Image failed to load: ${path}`);
      });
    });
  
    return Promise.all(promises);
}

function processResult(jsonResult) {
    console.log(jsonResult)
    mapData = JSON.parse(jsonResult);
    redrawMap()
}

function redrawMap() {

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    const MARGIN = window.innerWidth / 15
    const XFACTOR = (window.innerWidth - MARGIN * 2) / 20
    const YFACTOR = (window.innerHeight - MARGIN * 2) / 10

    if (!Array.isArray(mapData)) {
        console.error("Error: mapData is not an array", mapData);
        return;  // Stop execution if mapData is invalid
    }

    mapData.forEach(flight => {
        let index = directionMapping.indexOf(flight.direction)
        if (index != -1) {
            ctx.drawImage(contactImages[index], flight.x * XFACTOR + MARGIN, flight.y * YFACTOR + MARGIN)
            ctx.font = "15px Arial";
            ctx.fillStyle = "white"
            ctx.fillText(flight.id, flight.x * XFACTOR + MARGIN, flight.y * YFACTOR + MARGIN + 70)
        }
        else {
            ctx.font = "60px Arial";
            ctx.fillStyle = "red"
            ctx.fillText("?", flight.x * XFACTOR + MARGIN, flight.y * YFACTOR + MARGIN + YFACTOR / 2)
        }
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redrawMap();
}

function updateData() {

    // Variable to hold request
    var request;
  
    // Abort any pending request
    if (request) {
        request.abort();
    }
  
    // Fire off the request
  
    request = $.ajax({
        url: "http://localhost:3000",
        type: "GET",
        data: { }
    });
  
    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        console.log("Info: received data from map server - " + textStatus)
        processResult(response)
    });
  
    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        console.log("Error: failed to request data from map server - " + textStatus) 
    });
  
    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
  
    });
  
  }