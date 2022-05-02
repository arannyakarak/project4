const apiKey = 'eb380ce293c80acb396c9d71258f3d32';
// create the map and set the center of the map and its zoom setting
const map = L.map('map',{scrollWheelZoom:false}).setView([37.968923, -122.071100], 4);

//create a set of user selectable map tile layers. You must have at least one tile layer.
const basemaps = { 
  StreetView: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

  ,Topography: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {layers: 'TOPO-WMS'})

  ,Places: L.tileLayer.wms('http://ows.mundialis.de/services/service?', {layers: 'OSM-Overlay-WMS'})

  ,Stamen_Watercolor: L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg', {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

 ,Esri_WorldImagery: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'})

};

//create the UI to select different map layers
L.control.layers(basemaps).addTo(map);

//initialize the map with the StreetView map tiles
basemaps.StreetView.addTo(map);








// add marker
async function addMarkers() {
  removeMarkers();

  var states = await fetchStates();

  for (var i = 0; i < states.length; i++) {

    var weatherResult = await fetchWeather(apiKey, states[i].state_name);

    var Icon = L.Icon.extend({
      options: {
        shadowUrl: "http://leafletjs.com/examples/custom-icons/leaf-shadow.png",
        iconSize: [30, 85],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
      }
    }),
      loc = [weatherResult.coord.lat, weatherResult.coord.lon],
      html = "<b>usr " + i + "</b><br/>tweet " + i,
      marker = L.marker(loc, {
        icon: new Icon({
          iconUrl:
            "http://leafletjs.com/examples/custom-icons/" +
              getRandomItemFromArray()
        }),
        // title: "tweet " + i,
        // title: states[i].state_name,
        title: "Temp: " + weatherResult.main.temp + "°C",
        alt: "usr " + i,
        riseOnHover: true
      }).bindPopup(html /* ,{autoClose:false} */);
    marker.isRandom = true; // just to differenciate from any other markers available in the map
    // add just marker/ marker with popup/ just popup
    marker.addTo(map); // map.addLayer(marker); .openPopup();
  }
}
function removeMarkers() {
  map.eachLayer(function(layer) {
    if (
      layer instanceof L.Marker &&
      layer.isRandom /* ensure that we are not removing any other markers available in the map, see how the marker is added to the map */
    ) {
      layer.remove(); // layer.removeFrom(map); map.removeLayer(layer);
    }
  });
}

function getRandomIntBetween(max, min = 1) {
  // Math.random() returns 0<=random number<1
  // Math.floor() returns a int downward to its nearest int
  // 1 to max
  // Math.floor(Math.random() * max + 1);
  // min to max
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomItemFromArray(
  ar = ["leaf-green.png", "leaf-red.png", "leaf-orange.png"]
) {
  return ar[getRandomIntBetween(ar.length - 1, 0)];
}

async function fetchStates(){
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('api-token','D5ZOKr2VHZcCJfb4_tCeHI5VTXpoP-fvoTLyIy8hGIrVqsgFZThkIO9x-dEnt2wvOIg');
  headers.append('user-email','arannya.karak@gmail.com');
      try {
          let response1 = await fetch(`https://www.universal-tutorial.com/api/getaccesstoken`, {
              // mode: 'no-cors',
              // credentials: 'include',
              method: 'GET',
              headers: headers
          });
          // let response = await fetch(`https://api.waqi.info/feed/${city}/?token=c3d00f04680ed6402e8567a9314b1df8073cae74`);
          let data1 = await response1.json();
          console.log("START");
          console.log(data1.auth_token);
          console.log("END");
      // } catch (err1) {
      //     //this only runs if an error occurs in above process
      //     console.log('Oops!', err1);
      // }

    ////////

    let tkn = "Bearer " + data1.auth_token;
    
    
   let headers2 = new Headers();

   headers2.append('Content-Type', 'application/json');
   headers2.append('Accept', 'application/json');
   headers2.append('Authorization', tkn);
      //   try {
            let response2 = await fetch(`https://www.universal-tutorial.com/api/states/United%20States`, {
                method: 'GET',
                headers: headers2
            });
            let data2 = await response2.json();
          //   console.log("START");
          //   console.log(data2);
          // for(let i = 0; i < data2.length; i++){
          //     console.log(data2[i].state_name);
          // }
          //   console.log("END");
            return data2;
        } catch (err1) {
            //this only runs if an error occurs in above process
            console.log('Oops!', err1);
        }

    /////
}

async function fetchWeather(key,city){
  
  let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
  let data = response.json();
  return data;
}
