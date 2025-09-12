function main(username, ulat, ulon) {
  const clientList = document.querySelector("#clients");
  const warnings = document.querySelector('.warnings')
  const bottomCard = document.querySelector(".bottom-card");
  const mylatlon = document.querySelector(".my-latlon");
  const view = document.querySelector(".view");
  const viewContainer = document.querySelector(".view-container");
  // Removed myposition and recomends declarations as buttons were deleted
  
  // Socket.io setup with automatic connection
  // In production, it will connect to the server's domain
  // In development, it will connect to localhost
  let socket = io({
    transports: ['websocket', 'polling'], // Prioritize WebSockets
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  // initializing
  let map = L.map("map").setView([ulat, ulon], 14);
  map.on('click', mapClick);
  console.log(ulat, ulon);
  
  // Create user location marker with default Leaflet icon
  // Using default Leaflet icon for the current user
  const userIcon = new L.Icon.Default();
  // Add username to marker tooltip for identification
  let userTooltip = L.tooltip({
    permanent: true,
    direction: 'top',
    className: 'username-tooltip',
    offset: [0, -30] // Position tooltip above the marker
  }).setContent(username);

  // Create initial user marker
  let userMarker = L.marker([ulat, ulon], { icon: userIcon })
    .bindTooltip(userTooltip)
    .addTo(map)
    .bindPopup(`
      <div class="user-popup">
        <h4><i class="ri-user-location-line"></i> Your Location</h4>
        <p><strong>Coordinates:</strong> ${ulat.toFixed(6)}, ${ulon.toFixed(6)}</p>
        <p><strong>Status:</strong> Live Tracking Active</p>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}</p>
      </div>
    `);

  // Set global references for location tracking
  if (typeof setGlobalReferences === 'function') {
    setGlobalReferences(socket, map, userMarker);
  }
  
  // Draw park boundaries
  var polygonPark = L.polygon(coordinates, { color: "forestgreen", fillColor: "lightgreen", fillOpacity: 0.3 })
  .addTo(map)
  .bindPopup("UEM Kolkata National Park! Welcome to the wildlife sanctuary!");
  
var polygonWildlife = L.polygon(wildlifeZone, { color: "orange", fillColor: "yellow", fillOpacity: 0.2 })
  .addTo(map)
  .bindPopup("Wildlife Sanctuary Zone! High animal activity area - stay alert!");

var polygonVisitor = L.polygon(visitorCenter, { color: "blue", fillColor: "lightblue", fillOpacity: 0.4 })
  .addTo(map)
  .bindPopup("Visitor Center! Safe zone with facilities and information.");

  // Animal markers storage
  let animalMarkers = {};
  let lastAlerts = {}; // To prevent spam alerts

  // Enhanced animal proximity checking function
  function checkAllAnimalProximity(userLat, userLon) {
    let nearestDangerAnimal = null;
    let nearestDangerDistance = Infinity;
    let warningAnimals = [];
    
    for (let animalKey in animals) {
      const animal = animals[animalKey];
      const proximityCheck = checkAnimalProximity(userLat, userLon, animal);
      
      if (proximityCheck) {
        const alertKey = `${animal.id}_${proximityCheck.level}`;
        const now = Date.now();
        
        // Track nearest dangerous animal
        if (proximityCheck.level === 'danger' && proximityCheck.distance < nearestDangerDistance) {
          nearestDangerAnimal = animal;
          nearestDangerDistance = proximityCheck.distance;
        } else if (proximityCheck.level === 'warning') {
          warningAnimals.push({animal, distance: proximityCheck.distance});
        }
        
        // Only show alert if it hasn't been shown recently (prevent spam)
        if (!lastAlerts[alertKey] || now - lastAlerts[alertKey] > 15000) { // 15 second cooldown
          wildlifeAlert(proximityCheck.message, proximityCheck.level);
          lastAlerts[alertKey] = now;
          
          // Update animal alert display
          updateAnimalAlertDisplay(animal, proximityCheck);
          
          // Play alert sound for danger
          if (proximityCheck.level === 'danger') {
            playAlertSound();
          }
        }
      }
    }
    
    // Update threat level based on proximity
    if (nearestDangerAnimal) {
      updateThreatLevel('danger');
    } else if (warningAnimals.length > 0) {
      updateThreatLevel('warning');
    } else {
      updateThreatLevel('safe');
    }
  }

  // Function to update animal alert display
  function updateAnimalAlertDisplay(animal, proximityCheck) {
    const alertsContainer = document.querySelector('.animal-alerts');
    if (!alertsContainer) return;
    
    // Remove existing alert for this animal
    const existingAlert = document.querySelector(`[data-animal-id="${animal.id}"]`);
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `animal-alert ${proximityCheck.level} animate__animated animate__fadeInRight`;
    alertDiv.setAttribute('data-animal-id', animal.id);
    alertDiv.innerHTML = `
      <div class="alert-icon">${animal.icon}</div>
      <div class="alert-content">
        <div class="alert-title">${animal.name} (${animal.type})</div>
        <div class="alert-distance">${proximityCheck.distance.toFixed(1)}m away</div>
        <div class="alert-threat">${proximityCheck.level.toUpperCase()}</div>
      </div>
      <div class="alert-close" onclick="this.parentElement.remove()">×</div>
    `;
    
    alertsContainer.appendChild(alertDiv);
    
    // Auto-remove alert after 10 seconds
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove();
      }
    }, 10000);
  }

  // Function to play alert sound (optional)
  function playAlertSound() {
    try {
      // Create audio context for alert sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio alert not available:', error);
    }
  }


  socket.emit("client-join-location", {
    lat: ulat,
    lon: ulon,
    username: username,
  });
  // notify user join
  socket.on("client-join-server", (data) => {
    joinToast(
      `${data.username ? data.username : data.id} has joined the park!`
    );
    //notifyMe(`${data.username ? data.username : data.id} joined just now!`, `${data.username ? data.username : data.id} has joined to the park!`)
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system">UEM Kolkata Wildlife Tracker</a>',
   }).addTo(map);

  //Map tile layer
  viewContainer.addEventListener('click', (e)=>{
    if(e.target.id === 'sat') {
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system">UEM Kolkata Wildlife Tracker</a>',
        }).addTo(map);
     viewContainer.innerHTML = '<div class="street view" id="str"></div>'

    }else {
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 20,
            attribution:
            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a traget="_blank" href="https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system">UEM Kolkata Wildlife Tracker</a>',
        }).addTo(map);
        viewContainer.innerHTML = '<div class="satellite view" id="sat"></div>'       
    }
  })
  

  let liveSetView = false;
  let present_destination = [ulat, ulon]; // Initialize with starting position
  // Removed myposition handler as button is deleted


  ok = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const acc = position.coords.accuracy;
    present_destination = [lat, lon];
    if (liveSetView) {
      map.setView([data.lat, data.lon], 14);
    }
    socket.emit("client-location", { lat, lon, acc, username: username, platform: platform.description});
    mylatlon.innerHTML = `Lat: ${lat} Lon: ${lon}`;
    
    // Check proximity to animals with enhanced alerting
    checkAllAnimalProximity(lat, lon);
  
    // bottomCard.innerHTML = `
    //     <div class="distance">${
    //       distance < 1
    //         ? (distance * 1000).toFixed(2) + "<span>M</span>"
    //         : distance.toFixed(2) + "<span>KM</span>"
    //     }</div>
    //     <div class="location">IISER Kolkata National Park</div>
    //     `;
    // getLocationByLatLon(lat, lon)
    // .then(address => {
    //     address = address+','
    //     locationName = address.split(',')[0]
    //     mylatlon.innerHTML += `<br>${locationName}`
    //     // console.log(locationName)
    // })
  };


  error = (err) => {
    err.code == 1
      ? console.log("Please alllow location service from your device!")
      : console.log("Something went wrong!", err);
  };

  options = {
    enableHighAccuracy: true,
    timeout: 3000,
  };

  navigator.geolocation.watchPosition(ok, error, options);

  // Animal simulation and rendering
  function updateAnimals() {
    // Move animals
    for (let animalKey in animals) {
      animals[animalKey] = moveAnimal(animals[animalKey]);
    }
    
    // Check for proximity alerts if we have user position
    if (present_destination && present_destination.length >= 2) {
      checkAllAnimalProximity(present_destination[0], present_destination[1]);
    }
    
    // Update animal markers on map
    renderAnimals();
    
    // Update animal dashboard if open
    if (wildlifeDashboardOpen) {
      updateAnimalCards();
    }
  }
  
  function renderAnimals() {
    // Remove existing animal markers
    for (let markerId in animalMarkers) {
      if (map.hasLayer(animalMarkers[markerId])) {
        map.removeLayer(animalMarkers[markerId]);
      }
    }
    animalMarkers = {};
    
    // Add updated animal markers with custom animal icons
    for (let animalKey in animals) {
      const animal = animals[animalKey];
      const animalEmoji = animal.icon || getAnimalIcon(animal.type);
      
      // Create custom HTML icon with animal emoji
      const animalIcon = L.divIcon({
        html: `<div class="animal-marker ${animal.threatLevel.toLowerCase()}" title="${animal.name}">${animalEmoji}</div>`,
        className: 'custom-animal-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });
      
      const animalMarker = L.marker(animal.currentPos, { icon: animalIcon })
        .addTo(map)
        .bindPopup(`
          <div class="animal-popup">
            <h4>${animalEmoji} ${animal.name}</h4>
            <p><em>${animal.scientificName}</em></p>
            <p><strong>Species:</strong> ${animal.type}</p>
            <p><strong>Threat Level:</strong> <span class="threat-${animal.threatLevel.toLowerCase()}">${animal.threatLevel}</span></p>
            <p><strong>Habitat:</strong> ${animal.habitat}</p>
            <p><strong>Danger Radius:</strong> ${animal.dangerRadius}m</p>
            <p><strong>Warning Radius:</strong> ${animal.warningRadius}m</p>
          </div>
        `)
        .bindTooltip(`${animalEmoji} ${animal.name} (${animal.type})`, {
          permanent: false,
          direction: "top",
          className: "animal-tooltip"
        });
      
      animalMarkers[animal.id] = animalMarker;
    }
  }
  
  // Start animal simulation
  console.log('Starting animal simulation...');
  setInterval(updateAnimals, 3000); // Update every 3 seconds
  renderAnimals(); // Initial render

  let d = 100;
  let polylineGroup = L.layerGroup().addTo(map)
  // Realtime user navigation
  let connected_users = {};
  let processedUsers = new Set(); // Track processed users
  let updateMap = () => {
    clientList.innerHTML = ``;
    warnings.innerHTML = ``
    
    polylineGroup.clearLayers()
    
    // Reset processed users for this update cycle
    processedUsers.clear();

    for (let key in connected_users) {
      if (connected_users.hasOwnProperty(key)) {
        // Update or create marker with userMarkerManager
        userMarkerManager.updateMarker(map, {
          id: key,
          username: connected_users[key].username,
          lat: connected_users[key].lat,
          lon: connected_users[key].lon,
          platform: connected_users[key].platform,
          lastUpdate: connected_users[key].lastUpdate || Date.now()
        });
        
        // Add this user to processed set
        processedUsers.add(key);
        
        // Check park status for this user
        park_stat = rayCasting(
          [connected_users[key].lat, connected_users[key].lon],
          coordinates
        );
        let closestPoint = L.GeometryUtil.closest(map, polygonPark, [connected_users[key].lat, connected_users[key].lon], true);
        // console.log(closestPoint)
        let distance = calculateDistance(closestPoint.lat, closestPoint.lng, connected_users[key].lat, connected_users[key].lon)
        
        // Check proximity to animals for this user
        let animalWarnings = '';
        for (let animalKey in animals) {
          const animal = animals[animalKey];
          const userAnimalDistance = calculateDistance(
            connected_users[key].lat, 
            connected_users[key].lon,
            animal.currentPos[0], 
            animal.currentPos[1]
          );
          
          if (userAnimalDistance <= animal.dangerRadius) {
            animalWarnings += `<div class="animal-danger">🚨 ${animal.name} (${animal.type}) is ${userAnimalDistance.toFixed(1)}m away!</div>`;
          } else if (userAnimalDistance <= animal.warningRadius) {
            animalWarnings += `<div class="animal-warning">⚠️ ${animal.name} (${animal.type}) is ${userAnimalDistance.toFixed(1)}m away</div>`;
          }
        }
        
        clientList.innerHTML += `
            <div class="client-card">
            <div class="id">${connected_users[key].username}</div>
            <div class="platform">From <span>${connected_users[key].platform}</span></div>
            <div class="latlon">Lat: ${connected_users[key].lat} | Lon: ${
          connected_users[key].lon
        }</div>
            <div class="status">Park status: ${
              park_stat ? "Inside Park!" : `Outside Park (<b>${ distance < 1000
                  ? (distance).toFixed(2) + "<span>m from park boundary</span>"
                  : (distance/1000).toFixed(2) + "<span>km from park</span><b>"
              })`
            }</div>
            ${animalWarnings}
            </div>
            `;
            
            L.polyline([
              [closestPoint.lat, closestPoint.lng],
              [connected_users[key].lat, connected_users[key].lon]
            ], {color: 'forestgreen'}).addTo(polylineGroup)
            
        // Park boundary warnings 
        if(park_stat) {
          warnings.innerHTML += `
          <div class="harm"><b>[SAFE]</b> ${connected_users[key].username} is <span>inside</span> the national park!</div>
          `
        } else if(parseInt(distance)  >= 50 && parseInt(distance) <= 100) {
          warnings.innerHTML += `
          <div class="warn"><b>[INFO]</b> ${connected_users[key].username} is <span>${distance.toFixed(2)}m</span> from park entrance</div>
          `
        } else if(parseInt(distance) > 0 && parseInt(distance) <= 50) {
          warnings.innerHTML += `
          <div class="danger"><b>[NEAR]</b> ${connected_users[key].username} is <span>${distance.toFixed(2)}m</span> from park entrance</div>
          `
        } else if(parseInt(distance) == 0){
          warnings.innerHTML += `
          <div class="harm"><b>[ENTRY]</b> ${connected_users[key].username} has <span>entered</span> the national park!</div>
          `
        } 
      }
    }
    
    // No need to do marker cleanup here as it's handled by the userMarkerManager
    // when users disconnect
    
    // But let's make sure the markers match the connected users
    // Get all current user IDs
    const connectedUserIds = Object.keys(connected_users);
    
    // Update stats display
    document.getElementById('total-viewers').textContent = connectedUserIds.length;
    
    // Count users inside park
    const insideParkCount = Object.values(connected_users).filter(user => {
      return rayCasting([user.lat, user.lon], coordinates);
    }).length;
    
    document.getElementById('inside-park').textContent = insideParkCount;
  };

  socket.on("server-location", (data) => {
    connected_users[data.id] = {
      lat: data.lat,
      lon: data.lon,
      acc: data.acc,
      username: data.username,
      platform: data.platform,
      lastUpdate: Date.now()
    };
    
    // Update or create marker for this user
    userMarkerManager.updateMarker(map, {
      id: data.id,
      username: data.username,
      lat: data.lat,
      lon: data.lon,
      platform: data.platform,
      lastUpdate: Date.now()
    });
    
    // Add activity to feed
    addActivityToFeed(`${data.username || 'A visitor'} has connected`, 'Just now');
    
    updateMap();
  });

  // Handle real-time location updates
  socket.on("user-location-updated", (data) => {
    console.log('Received location update for user:', data.username, data.lat, data.lon);
    
    // Update the user data
    if (connected_users[data.id]) {
      connected_users[data.id].lat = data.lat;
      connected_users[data.id].lon = data.lon;
      connected_users[data.id].acc = data.accuracy;
      connected_users[data.id].lastUpdate = data.timestamp;
    } else {
      // Create new user if not exists
      connected_users[data.id] = {
        lat: data.lat,
        lon: data.lon,
        acc: data.accuracy,
        username: data.username,
        platform: data.platform,
        lastUpdate: data.timestamp
      };
    }
    
    // Update or create marker for this user
    userMarkerManager.updateMarker(map, {
      id: data.id,
      username: data.username,
      lat: data.lat,
      lon: data.lon,
      platform: data.platform,
      lastUpdate: data.timestamp
    });
    
    // Update the map display
    updateMap();
  });

  socket.on("disconnected_user", (data) => {
    // Remove user marker using the manager
    userMarkerManager.removeMarker(map, data.id);
    
    // Add activity to feed for disconnection
    if (connected_users[data.id]) {
      addActivityToFeed(`${connected_users[data.id].username || 'A visitor'} has disconnected`, 'Just now');
    }
    
    delete connected_users[data.id];
    
    // No need to call updateMap() since we manually removed the marker
    // Just update the client list and warnings
    clientList.innerHTML = ``;
    warnings.innerHTML = ``;
    for (let key in connected_users) {
      if (connected_users.hasOwnProperty(key)) {
        // Update client list and warnings as before
        // This is a simplified version of the updateMap function
        const user = connected_users[key];
        const park_stat = rayCasting([user.lat, user.lon], coordinates);
        const closestPoint = L.GeometryUtil.closest(map, polygonPark, [user.lat, user.lon], true);
        const distance = calculateDistance(closestPoint.lat, closestPoint.lng, user.lat, user.lon);
        
        // Check proximity to animals for this user
        let animalWarnings = '';
        for (let animalKey in animals) {
          const animal = animals[animalKey];
          const userAnimalDistance = calculateDistance(user.lat, user.lon, animal.currentPos[0], animal.currentPos[1]);
          
          if (userAnimalDistance <= animal.dangerRadius) {
            animalWarnings += `<div class="animal-danger">🚨 ${animal.name} (${animal.type}) is ${userAnimalDistance.toFixed(1)}m away!</div>`;
          } else if (userAnimalDistance <= animal.warningRadius) {
            animalWarnings += `<div class="animal-warning">⚠️ ${animal.name} (${animal.type}) is ${userAnimalDistance.toFixed(1)}m away</div>`;
          }
        }
        
        clientList.innerHTML += `
            <div class="client-card">
            <div class="id">${user.username}</div>
            <div class="platform">From <span>${user.platform}</span></div>
            <div class="latlon">Lat: ${user.lat} | Lon: ${user.lon}</div>
            <div class="status">Park status: ${
              park_stat ? "Inside Park!" : `Outside Park (<b>${ distance < 1000
                  ? (distance).toFixed(2) + "<span>m from park boundary</span>"
                  : (distance/1000).toFixed(2) + "<span>km from park</span><b>"
              })`
            }</div>
            ${animalWarnings}
            </div>
            `;
        
        L.polyline([
          [closestPoint.lat, closestPoint.lng],
          [user.lat, user.lon]
        ], {color: 'forestgreen'}).addTo(polylineGroup);
        
        // Park boundary warnings 
        if(park_stat) {
          warnings.innerHTML += `
          <div class="harm"><b>[SAFE]</b> ${user.username} is <span>inside</span> the national park!</div>
          `
        } else if(parseInt(distance) >= 50 && parseInt(distance) <= 100) {
          warnings.innerHTML += `
          <div class="warn"><b>[INFO]</b> ${user.username} is <span>${distance.toFixed(2)}m</span> from park entrance</div>
          `
        } else if(parseInt(distance) > 0 && parseInt(distance) <= 50) {
          warnings.innerHTML += `
          <div class="danger"><b>[NEAR]</b> ${user.username} is <span>${distance.toFixed(2)}m</span> from park entrance</div>
          `
        } else if(parseInt(distance) == 0){
          warnings.innerHTML += `
          <div class="harm"><b>[ENTRY]</b> ${user.username} has <span>entered</span> the national park!</div>
          `
        } 
      }
    }
    
    leftToast(
      `${data.username ? data.username : data.id} has left the park!`
    );
  });

  // Handle visitors update for park info panel
  socket.on("visitors-update", (visitors) => {
    updateActiveVisitorsDisplay(visitors);
  });

 

  let rayCasting = (coords, polygon) => {
    let x = coords[0];
    let y = coords[1];

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      let xi = polygon[i][0],
        yi = polygon[i][1];
      let xj = polygon[j][0],
        yj = polygon[j][1];

      let intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

      if (intersect) inside = !inside;
    }

    return inside;
  };

  // Removed recommendation places code as recomend-container was deleted

}

// ===== Enhanced Wildlife Tracking UI Functions =====
let wildlifeDashboardOpen = false;
let parkInfoPanelOpen = false;
let currentThreatLevel = 'safe';

// Initialize enhanced UI components when document loads
document.addEventListener('DOMContentLoaded', function() {
    initializeEnhancedUI();
});

function initializeEnhancedUI() {
    // Wildlife dashboard toggle
    const dashboardBtn = document.getElementById('wildlife-dashboard-btn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', toggleWildlifeDashboard);
    }
    
    const closeDashboard = document.querySelector('.close-dashboard');
    if (closeDashboard) {
        closeDashboard.addEventListener('click', closeWildlifeDashboard);
    }
    
    // Park info panel toggle
    const parkInfoBtn = document.getElementById('park-info-btn');
    if (parkInfoBtn) {
        parkInfoBtn.addEventListener('click', toggleParkInfoPanel);
    }
    
    const closePanel = document.querySelector('.close-panel');
    if (closePanel) {
        closePanel.addEventListener('click', closeParkInfoPanel);
    }
    
    // Emergency alerts toggle
    const emergencyBtn = document.getElementById('emergency-alerts-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', showEmergencyAlerts);
    }
    
    // Animal cards click handlers
    document.querySelectorAll('.animal-card').forEach(card => {
        card.addEventListener('click', function() {
            const animalId = this.dataset.animalId;
            focusOnAnimal(animalId);
        });
    });
    
    // Initialize threat level
    updateThreatLevel('safe');
    
    // Update wildlife statistics
    updateWildlifeStats();
}

// Toggle wildlife dashboard
function toggleWildlifeDashboard() {
    const dashboard = document.querySelector('.wildlife-dashboard');
    wildlifeDashboardOpen = !wildlifeDashboardOpen;
    
    if (wildlifeDashboardOpen) {
        dashboard.classList.add('active');
        updateAnimalCards();
    } else {
        dashboard.classList.remove('active');
    }
}

function closeWildlifeDashboard() {
    const dashboard = document.querySelector('.wildlife-dashboard');
    if (dashboard) {
        dashboard.classList.remove('active');
        wildlifeDashboardOpen = false;
    }
}

// Toggle park info panel
function toggleParkInfoPanel() {
    const panel = document.querySelector('.park-info-panel');
    parkInfoPanelOpen = !parkInfoPanelOpen;
    
    if (parkInfoPanelOpen) {
        panel.classList.add('active');
    } else {
        panel.classList.remove('active');
    }
}

function closeParkInfoPanel() {
    const panel = document.querySelector('.park-info-panel');
    if (panel) {
        panel.classList.remove('active');
        parkInfoPanelOpen = false;
    }
}

// Show emergency alerts
function showEmergencyAlerts() {
    const alertsContainer = document.querySelector('.animal-alerts');
    if (!alertsContainer) return;
    
    // Get current animal threats from the global animals array
    let currentThreats = [];
    if (typeof animals !== 'undefined' && animals.length > 0) {
        currentThreats = animals.filter(animal => 
            animal.threatLevel === 'high' || animal.threatLevel === 'medium'
        );
    }
    
    // Clear existing alerts
    alertsContainer.innerHTML = '';
    
    if (currentThreats.length > 0) {
        currentThreats.forEach(animal => {
            const alert = createThreatAlert(animal);
            alertsContainer.appendChild(alert);
        });
    } else {
        const safeAlert = document.createElement('div');
        safeAlert.className = 'alert safe-alert animate__animated animate__slideInRight';
        safeAlert.innerHTML = `
            <div class="alert-content">
                <i class="ri-shield-check-line"></i>
                <span>All wildlife areas are currently safe</span>
            </div>
        `;
        alertsContainer.appendChild(safeAlert);
    }
    
    // Auto-hide alerts after 5 seconds
    setTimeout(() => {
        alertsContainer.innerHTML = '';
    }, 5000);
}

// Create threat alert element
function createThreatAlert(animal) {
    const alert = document.createElement('div');
    alert.className = `alert ${animal.threatLevel}-alert animate__animated animate__slideInRight`;
    alert.innerHTML = `
        <div class="alert-content">
            <div class="alert-icon">${animal.icon || '🦌'}</div>
            <div class="alert-text">
                <strong>${animal.name}</strong>
                <span>Threat Level: ${animal.threatLevel.toUpperCase()}</span>
            </div>
            <i class="ri-close-line alert-close"></i>
        </div>
    `;
    
    // Add close functionality
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
    
    return alert;
}

// Update animal cards in dashboard
function updateAnimalCards() {
    if (typeof animals === 'undefined') return;
    
    animals.forEach(animal => {
        const card = document.querySelector(`[data-animal-id="${animal.id}"]`);
        if (card) {
            const statusIndicator = card.querySelector('.animal-status');
            const threatBadge = card.querySelector('.threat-badge');
            
            // Update status indicator
            if (statusIndicator) {
                statusIndicator.className = `animal-status ${animal.active ? 'active' : 'inactive'}`;
            }
            
            // Update threat badge
            if (threatBadge) {
                threatBadge.className = `threat-badge ${animal.threatLevel}`;
                threatBadge.textContent = animal.threatLevel;
            }
        }
    });
}

// Focus on specific animal on map
function focusOnAnimal(animalId) {
    if (typeof animals === 'undefined' || typeof map === 'undefined') return;
    
    const animal = animals.find(a => a.id == animalId);
    if (animal && animal.lat && animal.lng) {
        map.setView([animal.lat, animal.lng], 18);
        
        // Close dashboard if open
        closeWildlifeDashboard();
        
        // Show info about the animal
        showAnimalInfo(animal);
    }
}

// Show animal info popup
function showAnimalInfo(animal) {
    const info = `
        <div class="animal-popup">
            <h4>${animal.icon} ${animal.name}</h4>
            <p><em>${animal.scientificName}</em></p>
            <p><strong>Threat Level:</strong> <span class="threat-${animal.threatLevel}">${animal.threatLevel.toUpperCase()}</span></p>
            <p><strong>Status:</strong> ${animal.active ? 'Active' : 'Inactive'}</p>
        </div>
    `;
    
    // Create a temporary popup
    const popup = L.popup()
        .setLatLng([animal.lat, animal.lng])
        .setContent(info)
        .openOn(map);
}

// Update wildlife statistics
function updateWildlifeStats() {
    if (typeof animals === 'undefined') {
        return;
    }
    
    const totalAnimals = animals.length;
    const activeAnimals = animals.filter(a => a.active).length;
    const threatsDetected = animals.filter(a => 
        a.threatLevel === 'high' || a.threatLevel === 'medium'
    ).length;
    
    // Update stat displays
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[0]) statNumbers[0].textContent = totalAnimals;
    if (statNumbers[1]) statNumbers[1].textContent = activeAnimals;
    if (statNumbers[2]) statNumbers[2].textContent = threatsDetected;
    
    // Update animal count in status panel
    const animalCount = document.querySelector('.animal-count .count');
    if (animalCount) {
        animalCount.textContent = activeAnimals;
    }
}

// Update threat level display
function updateThreatLevel(level) {
    currentThreatLevel = level;
    const indicator = document.querySelector('.threat-level');
    if (!indicator) return;
    
    const icon = indicator.querySelector('i');
    const text = indicator.querySelector('span');
    
    // Remove all threat classes
    indicator.classList.remove('safe', 'warning', 'danger');
    indicator.classList.add(level);
    
    // Update icon and text based on threat level
    switch(level) {
        case 'safe':
            if (icon) icon.className = 'ri-shield-check-line';
            if (text) text.textContent = 'Area Safe';
            break;
        case 'warning':
            if (icon) icon.className = 'ri-alert-line';
            if (text) text.textContent = 'Caution Advised';
            break;
        case 'danger':
            if (icon) icon.className = 'ri-error-warning-line';
            if (text) text.textContent = 'High Alert';
            break;
    }
}

// Enhanced animal position updates
function updateAnimalDisplay() {
    if (typeof animals !== 'undefined') {
        updateWildlifeStats();
        
        if (wildlifeDashboardOpen) {
            updateAnimalCards();
        }
        
        // Calculate overall threat level
        const threatLevels = animals.map(a => a.threatLevel);
        let overallThreat = 'safe';
        
        if (threatLevels.includes('high')) {
            overallThreat = 'danger';
        } else if (threatLevels.includes('medium')) {
            overallThreat = 'warning';
        }
        
        updateThreatLevel(overallThreat);
    }
}

// Function to update active visitors display
function updateActiveVisitorsDisplay(visitors) {
    const visitorsList = document.getElementById('active-visitors-list');
    if (!visitorsList) return;
    
    const visitorIds = Object.keys(visitors);
    const totalViewers = visitorIds.length;
    
    // Update viewer statistics
    const totalViewersElement = document.getElementById('total-viewers');
    if (totalViewersElement) {
        totalViewersElement.textContent = totalViewers;
    }
    
    // Count visitors inside park (this would need park boundary check logic)
    let insideParkCount = 0;
    visitorIds.forEach(socketId => {
        const visitor = visitors[socketId];
        if (visitor && visitor.lat && visitor.lon) {
            // You can add park boundary check here
            // For now, assuming all are inside park
            insideParkCount++;
        }
    });
    
    const insideParkElement = document.getElementById('inside-park');
    if (insideParkElement) {
        insideParkElement.textContent = insideParkCount;
    }
    
    if (totalViewers === 0) {
        visitorsList.innerHTML = `
            <div class="empty-visitors">
                <i class="ri-user-unfollow-line"></i>
                <span>No active visitors currently</span>
            </div>
        `;
        return;
    }
    
    let visitorsHTML = '';
    visitorIds.forEach(socketId => {
        const visitor = visitors[socketId];
        if (visitor && visitor.username) {
            // Get first letter of username for avatar
            const firstLetter = visitor.username.charAt(0).toUpperCase();
            
            visitorsHTML += `
                <div class="visitor-row">
                    <div class="visitor-avatar">${firstLetter}</div>
                    <div class="visitor-info">
                        <div class="visitor-name">${visitor.username}</div>
                        <div class="visitor-details">${visitor.platform || 'Unknown'} • ${visitor.lastUpdate ? new Date(visitor.lastUpdate).toLocaleTimeString() : 'Just now'}</div>
                    </div>
                    <div class="visitor-status"></div>
                </div>
            `;
        }
    });
    
    visitorsList.innerHTML = visitorsHTML || `
        <div class="empty-visitors">
            <i class="ri-user-unfollow-line"></i>
            <span>No active visitors currently</span>
        </div>
    `;
}

// Function to add an activity to the activity feed
function addActivityToFeed(text, time = 'Just now') {
    const activityFeed = document.getElementById('activity-feed');
    if (!activityFeed) return;
    
    // Create new activity entry
    const activityHTML = `
        <div class="activity-row">
            <span class="activity-dot"></span>
            <div class="activity-info">
                <span class="activity-text">${text}</span>
                <span class="activity-time">${time}</span>
            </div>
        </div>
    `;
    
    // Add to the beginning of the feed
    activityFeed.innerHTML = activityHTML + activityFeed.innerHTML;
    
    // Limit to 5 entries to avoid cluttering
    const activities = activityFeed.querySelectorAll('.activity-row');
    if (activities.length > 5) {
        for (let i = 5; i < activities.length; i++) {
            activities[i].remove();
        }
    }
}

// Add enhanced alert styles
const alertStyles = `
    .alert {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-left: 4px solid;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    }
    
    .alert.high-alert {
        border-left-color: #f44336;
        background: rgba(244, 67, 54, 0.1);
    }
    
    .alert.medium-alert {
        border-left-color: #ff9800;
        background: rgba(255, 152, 0, 0.1);
    }
    
    .alert.safe-alert {
        border-left-color: #4caf50;
        background: rgba(76, 175, 80, 0.1);
    }
    
    .alert-content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .alert-icon {
        font-size: 1.5rem;
    }
    
    .alert-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
    
    .alert-text strong {
        font-family: var(--gb);
        color: #333;
    }
    
    .alert-text span {
        font-family: var(--lato);
        font-size: 0.9rem;
        color: #666;
    }
    
    .alert-close {
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    }
    
    .alert-close:hover {
        color: #333;
    }
    
    .animal-popup h4 {
        margin: 0 0 0.5rem 0;
        color: #2d8f3f;
        font-family: var(--gb);
    }
    
    .animal-popup p {
        margin: 0.3rem 0;
        font-family: var(--lato);
    }
    
    .threat-high { color: #f44336; font-weight: bold; }
    .threat-medium { color: #ff9800; font-weight: bold; }
    .threat-low { color: #ffc107; font-weight: bold; }
    .threat-safe { color: #4caf50; font-weight: bold; }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Inject enhanced alert styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = alertStyles;
    document.head.appendChild(styleSheet);
}
