const APIKEY = "AlFj1WPUAp_JGN-bCJA-lccEIHvHjL5SMJ0nFyaAH0jRn6xo34mQq21o2qSV-u4y";
const numPoints = 20;
const radiusThreshold = 0.5;
const baseUrl = "/api/predict";
const radiusFeet = 500;
const testingMode = false;


let isZoomed = false;

//import * as Regions from './region.js';
function haversine(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    const toRadians = (angle) => angle * (Math.PI / 180);
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    // Haversine formula
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;

    const a =
        Math.sin(dlat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Radius of the Earth in feet
    const radius = 20902230; // feet

    // Calculate distance in feet
    const distance = radius * c;

    return distance;
}

function toCoordinates(originLatitude, originLongitude, offsetXFeet, offsetYFeet) {
    const toRadians = (angle) => angle * (Math.PI / 180);

    // Convert latitude and longitude from degrees to radians
    originLatitude = toRadians(originLatitude);
    originLongitude = toRadians(originLongitude);

    // Radius of the Earth in feet
    const radius = 20902230; // feet

    // Calculate new latitude and longitude in radians
    const newLatitude = originLatitude + (offsetYFeet / radius);
    const newLongitude = originLongitude + (offsetXFeet / (radius * Math.cos(originLatitude)));

    // Convert back to degrees
    const toDegrees = (angle) => angle * (180 / Math.PI);

    return [toDegrees(newLatitude), toDegrees(newLongitude) ];
}


class Point {
    constructor (x,y) {
        this.x = x;
        this.y=  y;
    }

    dist (other) {
        return haversine(this.x,this.y,other.x,other.y);
        //return Math.sqrt((this.x-other.x)*(this.x-other.x) + (this.y-other.y)*(this.y-other.y));
    }
}


function getPointsAroundCircle(origin,radius) {
    var points = [];
    for (var i = 0; i < numPoints; i++) {
        var angle = 2*i*Math.PI / numPoints;
        const latLongCoord = toCoordinates(origin.x,origin.y,Math.cos(angle)*radius,Math.sin(angle)*radius);
        points.push(new Point(latLongCoord[0],latLongCoord[1]));
    }
    return points;
}

function checkPoint(point,positions,minRadius) {
    for (pos of positions) {
        if (point.dist(pos) < minRadius-radiusThreshold)
            return false;
    }
    return true;
}

var map;
var heatmap;

function loadMapScenario() {
    console.log("loading map");

    

    var mapOptions = {
        credentials: APIKEY,
        center: new Microsoft.Maps.Location(41.8781, -87.6298), // Chicago coordinates
        zoom: 12,
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        disableZooming: false, // Disable user zoom
        disablePanning: false, // Disable user panning
        showDashboard: false, // Hide the dashboard
        showScalebar: false, // Hide the scale bar
        customizeOverlays: true, // Allow customizing overlays
        showMapTypeSelector: false, // Hide the map type selector
        showBreadcrumb: false, // Hide the breadcrumb control
        showLocateMeButton: false, // Hide the locate me button
        enableClickableLogo: false, // Disable clicking on the Bing logo
    };

    map = new Microsoft.Maps.Map(document.getElementById('map'), mapOptions);

    map.setOptions({
        mapTypeIds: [Microsoft.Maps.MapTypeId.road, Microsoft.Maps.MapTypeId.aerial],
        
    });
    
    document.getElementById('zoom-button').addEventListener('click', function() {
        if (!isZoomed) {
            enlargeMap();
            isZoomed = true;
        }
    });

    // Event listener to handle clicks on the enlarged map (to exit zoom)
    document.getElementById('body').addEventListener('click', function() {
        if (isZoomed) {
            shrinkMap();
            isZoomed = false;
        }
    });
}

function enlargeMap() {
    // Hide the button and fade out the rest of the webpage
    document.getElementById('zoom-button').style.display = 'none';
    document.getElementById('map-container').style.opacity = '0.5'; // Adjust opacity as needed

    // Create the enlarged map container
    const enlargedMapContainer = document.createElement('div');
    enlargedMapContainer.className = 'enlarged-map-container';

    // Create the enlarged map
    const enlargedMap = document.createElement('div');
    enlargedMap.className = 'enlarged-map';
    enlargedMap.innerHTML = document.getElementById('map').innerHTML;

    // Append the enlarged map to the container
    enlargedMapContainer.appendChild(enlargedMap);

    // Append the container to the body
    document.body.appendChild(enlargedMapContainer);
}

function shrinkMap() {
    // Show the button and restore the opacity of the webpage
    document.getElementById('zoom-button').style.display = 'block';
    document.getElementById('map-container').style.opacity = '1';

    // Remove the enlarged map container
    const enlargedMapContainer = document.getElementById('enlarged-map-container');
    enlargedMapContainer.parentNode.removeChild(enlargedMapContainer);
}

class Location {
    constructor (name,latitude,longitude,color) {
        this.name = name;
        this.color = color || "red";
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

var pushPins = [];

function updateMap(pinPoints,regions) {
    pushPins.length = 0;
    for (let index = 0; index < pinPoints.length; index++) {
        const pinPoint = pinPoints[index];
        var location = new Microsoft.Maps.Location(pinPoint.latitude,pinPoint.longitude);
        const pushpin = new Microsoft.Maps.Pushpin(location, {
            title: pinPoint.name,
            color: "blue"
        });

        pushPins.push(pushpin);

        //const i = index;
        Microsoft.Maps.Events.addHandler(pushpin, 'click', function (e) {
            const element = document.getElementById("crimeIndex"+index);
            const tableRows = document.querySelectorAll('#crime-table-body tr');
            var unHighlight = false;

            for (let i = 0; i < pushPins.length; i++) {
                pushPins[i].setOptions({ color: "blue" });
            }
            
            tableRows.forEach(row => {
                if (row == element && row.classList.contains("highlighted")) unHighlight = true;
                row.classList.remove('highlighted');
            });

            if (unHighlight) return;

            pushpin.setOptions({ color: "red" });


            if (element != null) {
                element.classList.add("highlighted");
            } else console.warn("Table entry not found for index "+index);
        });
        map.entities.push(pushpin);
    }

    for (const region of regions) {
        locations = [];
        for (var i = 0; i < region.points.length; i++) {
            locations.push(new Microsoft.Maps.Location(region.points[i].x,region.points[i].y));
        }
        var polygon = new Microsoft.Maps.Polygon(locations, region.colorSettings);
    
        map.entities.push(polygon);
    }

    if (heatmap) {
        map.layers.remove(heatmap);
    }
    Microsoft.Maps.loadModule('Microsoft.Maps.HeatMap', function () {
        // Remove existing pin points (optional)
        // map.entities.clear();
        
        // Create the heat map layer

        heatmap = new Microsoft.Maps.HeatMapLayer(pushPins, {
            intensity: 1.5, // adjust as needed
            radius: 35, // adjust radius of influence
            unit: 'feet',
            colorGradient: {
            '0': 'green',
            '0.5': 'yellow',
            '1': 'red'
            }
        });
        
        // Add the heat map layer to the map
        map.layers.insert(heatmap);
        console.log("loaded heat map",locations);
    });
}

function showLoadingScreen() {
    document.querySelector('.loading-bar').style.width = '0%';
    document.getElementById('loading-screen').style.display = 'flex';
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}


function generatePredictedCrimeMap() {
    /*var progress = 0;
    var loadingInterval = setInterval(function() {
        progress += Math.random() * 10; // Simulate progress
        if (progress >= 100) {
            clearInterval(loadingInterval);
            document.querySelector('.loading-bar').style.width = '100%';
            setTimeout(function() {
                document.getElementById('loading-screen').style.display = 'none';
                // Code to display the map and crime list
            }, 500);
        } else {
            document.querySelector('.loading-bar').style.width = progress + '%';
        }
    }, 500);*/
    showLoadingScreen();
    if (testingMode) {
        setTimeout(() => {
            loadCrimeData([
                ["STREET","UNDER 500","ROBBERY",41.87548512312312, -87.62969112312312],
                ["STREET","Over 500","ROBBERY 2",41.87459412312312, -87.63046912312312],
            ]);
            hideLoadingScreen();
        },1000);
    } else {
        const url = new URL(baseUrl,window.location.origin);
        url.searchParams.append('startDate', document.getElementById("start-date").value);
        url.searchParams.append('startTime', document.getElementById("start-time").value);
        url.searchParams.append('endDate', document.getElementById("end-date").value);
        url.searchParams.append('endTime', document.getElementById("end-time").value);
        /*console.log("fetch url: "+url);
        fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("response: ",response);
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);
            loadCrimeData(data);
            hideLoadingScreen();
        })
        .catch(error => {
            console.error('Error:', error);
        });*/

        const eventSource = new EventSource(url);
        eventSource.onmessage = (event) => {
            var data = JSON.parse(event.data);
            console.log(data.type);
            if (data.type == "progress") {
                document.querySelector('.loading-bar').style.width = Math.round(data.progress*100) + '%';
            } else if (data.type == "complete") {
                document.querySelector('.loading-bar').style.width = Math.round(data.progress*100) + '%';

                console.log(data.data);
                loadCrimeData(data.data);
                document.querySelector('.loading-bar').style.width = '100%';
                setTimeout(() => {
                    hideLoadingScreen();
                }, 500);
                eventSource.close();
            }
        }

        /*eventSource.addEventListener('complete', () => {
            console.log("event source closed!");
            eventSource.close();
        });*/
    }
        

    
}


function reverseGeocode(latitude,longitude,element) {
    
    fetch(`https://dev.virtualearth.net/REST/v1/Locations/${latitude},${longitude}?key=${APIKEY}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          return response.json();
        })
        .then(data => {
          const address = data.resourceSets[0]?.resources[0]?.address?.formattedAddress || 'Address not found';

          // Display the address
          element.textContent = address;
        })
        .catch(error => {
          // Handle errors that may occur during the fetch or JSON parsing
          console.error('Error:', error);
        });
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp*1000);
    
    var month = String(date.getMonth() + 1)
    var day = String(date.getDate()).padStart(2, '0');
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = String(date.getMinutes()).padStart(2, '0');

    var amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours != 0 ? hours : 12;

    return month + '/' + day + '/' + year + ' ' + hours + ':' + minutes + ' ' + amOrPm;
}

function addListItem(crime,index,location) {
    var crimeTableBody = document.getElementById('crime-table-body');

    var row = crimeTableBody.insertRow();
    var indexCell = row.insertCell(0);
    var timeCell = row.insertCell(1);
    var locationCell = row.insertCell(2);
    var typeCell = row.insertCell(3);
    var descriptionCell = row.insertCell(4);
    var addressCell = row.insertCell(5);

    row.setAttribute("id","crimeIndex"+index);

    /*var button = document.createElement("button");
    button.textContent = index+1;
    button.classList.add("cell-button");*/

    row.addEventListener("click", function() {
        const pushpin = pushPins[index];

        const tableRows = document.querySelectorAll('#crime-table-body tr');
        var unHighlight = false;

        for (let i = 0; i < pushPins.length; i++) {
            pushPins[i].setOptions({ color: "blue" });
        }
        
        tableRows.forEach(row2 => {
            if (row2 == row && row2.classList.contains("highlighted")) unHighlight = true;
            row2.classList.remove('highlighted');
        });

        if (unHighlight) return;

        pushpin.setOptions({ color: "red" });


        row.classList.add("highlighted");
    });
    

    //indexCell.appendChild(button);

    indexCell.textContent = index+1;
    locationCell.textContent = crime[4];
    typeCell.textContent = crime[5];
    descriptionCell.textContent = crime[6];
    addressCell.textContent = location;

    timeCell.textContent = formatDateTime(crime[3]);

    //reverseGeocode(crime[3],crime[4],addressCell);
}

function createCircle(origin,radius,transparency) {
    var perimPoints = (getPointsAroundCircle(origin,radius));
    return {"points":perimPoints,"colorSettings": {
        fillColor: new Microsoft.Maps.Color(transparency, 0, 0, 255), // Blue with transparency
        strokeColor: new Microsoft.Maps.Color(0, 0, 255, 255), // Solid blue border
        strokeThickness: 2
    }};
}

function loadCrimeData(crimeData) {
    map.entities.clear();
    document.getElementById('crime-table-body').innerHTML = '';
    
    locations = [];
    regions = [];

    // [street name, lattitude, longitude, time, location description, description, short description]

    for (var index = 0; index < crimeData.length; index++) {
        crime = crimeData[index];

        addListItem(crime,index,crime[0]);
        var location = new Location(crime[6],crime[1],crime[2]);
        locations.push(location);




        var point = new Point(crime[1],crime[2]);
        regions.push(createCircle(point,radiusFeet,45));
        regions.push(createCircle(point,radiusFeet/2,75));
    }

    updateMap(locations,regions);
}

document.addEventListener('DOMContentLoaded', function(event) { 
    document.getElementById('start-time').value = '00:00';
    document.getElementById('end-time').value = '00:00';
});