const Url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// set up URL link
d3.json(Url).then(function (data) {
    let earthquake = data.features
  createFeatures(earthquake);
});
let circlemarkers = []
function createFeatures(earthquakeData) {

  // Creating Popups
  function onEachFeature(feature) {
    let depth = feature.geometry.coordinates[2]
    circlemarkers.push(L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {radius: [feature.properties.mag]*20000,
        fillColor: markercolor(depth), 
        fillOpacity:.6,
        weight: .5})
      .bindPopup(`<h3>Location: ${feature.properties.place}</h3>
        <hr><p>Magnitude: ${feature.properties.mag}</p>
        <hr><p>Depth: ${feature.geometry.coordinates[2]}</p>`));
    
  }
 
  // creating geoJSON with feature
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function markercolor(depth){
  if (depth >= 100) {
    return "red";
} else if (depth>=50) {
    return "orange";
} else if (depth >=10) {
    return "yellow";
} else if (depth >= 5) {
    return "green";
} else {
    return "blue";
}
 
}


function createMap(earthquakes) {
    
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {})

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };
  let circlegroup = L.layerGroup(circlemarkers)
  // Creating overlay
  let overlayMaps = {
    earthquakes: circlegroup
  };
   
  // Creation of map
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, circlegroup]
  });
  

  //create layers legend
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


}