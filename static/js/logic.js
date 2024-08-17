// URL to the earthquake data (All Earthquakes in the Past 7 Days)
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
var geojson;
// Create the map object centered on the world with a starting zoom level
var map = L.map("map", {center: [37.09, -95.71], zoom: 5});

// Add the tile layer (background map) to the Leaflet map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch the earthquake data
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    // Process each earthquake feature
    data.features.forEach(feature => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;

      // Determine marker color based on depth
      const color = getDepthColor(depth);
      // Determine marker size based on magnitude
      const size = getMarkerSize(magnitude);

      // Create a circle marker and add it to the map
      L.circleMarker([latitude, longitude], {
        radius: size,
        fillColor: color,
        color: '#000',
        weight: 1,
        fillOpacity: 0.8
      })
      .bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`)
      .addTo(map);
    });
  });

// Helper function to get color based on earthquake depth
function getDepthColor(depth) {
  return depth > 90 ? '#ff5f65' :
         depth > 70 ? '#fca35d' :
         depth > 50 ? '#fdb72a' :
         depth > 30 ? '#f7db11' :
                      '#dcf400';
}

// Helper function to get marker size based on earthquake magnitude
function getMarkerSize(magnitude) {
  return magnitude * 4;
}

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend'),
      depths = [0, 30, 50, 70, 90],
      labels = [];

  div.innerHTML += '<strong>Depth (km)</strong><br>';
  for (var i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getDepthColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(map);
