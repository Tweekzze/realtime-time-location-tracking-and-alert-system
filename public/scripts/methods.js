let joinToast = (msg) => {
  Toastify({
      text: msg,
      duration: 3000,
      className: 'join-toast',
      // destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
}

let leftToast = (msg) => {
Toastify({
    text: msg,
    duration: 3000,
    className: 'left-toast',
    // destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #ee0979, #ff6a00)",
    },
    onClick: function(){} // Callback after click
  }).showToast();
}

// Wildlife alert toasts
let wildlifeAlert = (msg, type = 'warning') => {
  let bgColor;
  switch(type) {
    case 'danger':
      bgColor = "linear-gradient(to right, #ff4444, #cc0000)";
      break;
    case 'warning':
      bgColor = "linear-gradient(to right, #ffaa00, #ff6600)";
      break;
    case 'info':
      bgColor = "linear-gradient(to right, #0099ff, #0066cc)";
      break;
    default:
      bgColor = "linear-gradient(to right, #ffaa00, #ff6600)";
  }

  Toastify({
    text: msg,
    duration: 5000,
    className: `wildlife-${type}-toast`,
    newWindow: true,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: bgColor,
      fontSize: "14px",
      fontWeight: "bold"
    },
    onClick: function(){}
  }).showToast();
}

let calculateDistance = (lat1, lon1, lat2, lon2) => {
const R = 6371; // Radius of the Earth in kilometers

// Convert latitude and longitude from degrees to radians
const radLat1 = (lat1 * Math.PI) / 180;
const radLon1 = (lon1 * Math.PI) / 180;
const radLat2 = (lat2 * Math.PI) / 180;
const radLon2 = (lon2 * Math.PI) / 180;

// Calculate the differences between the coordinates
const deltaLat = radLat2 - radLat1;
const deltaLon = radLon2 - radLon1;

// Haversine formula
const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2;

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

// Calculate the distance
const distance = R * c;

return distance*1000;
}

// Animal simulation functions
function moveAnimal(animal) {
    const now = Date.now();
    const timeDelta = (now - animal.lastUpdate) / 1000; // seconds
    
    // Target coordinates for certain animals to move toward
    const targetCoords = [22.560360, 88.490058];
    
    // Animals that should move toward the target (predators and curious animals)
    const huntingAnimals = ['tiger', 'leopard', 'slothBear', 'rhesusMonkey', 'wildBoar'];
    
    let newLat, newLon;
    
    if (huntingAnimals.includes(animal.type)) {
        // Calculate direction toward target coordinates
        const targetDirection = Math.atan2(
            targetCoords[1] - animal.currentPos[1], 
            targetCoords[0] - animal.currentPos[0]
        );
        
        // Calculate distance to target
        const distanceToTarget = calculateDistance(
            animal.currentPos[0], animal.currentPos[1],
            targetCoords[0], targetCoords[1]
        );
        
        // If close to target (within 100m), move more randomly
        if (distanceToTarget < 100) {
            // Add some randomness when near target
            animal.direction = targetDirection + (Math.random() - 0.5) * Math.PI / 3;
        } else {
            // Move toward target with some randomness
            const randomFactor = (Math.random() - 0.5) * Math.PI / 6; // ±30 degrees
            animal.direction = targetDirection + randomFactor;
        }
        
        console.log(`${animal.name} (${animal.type}) moving toward target. Distance: ${distanceToTarget.toFixed(1)}m`);
    } else {
        // Normal random movement for peaceful animals
        if (Math.random() < 0.1) {
            animal.direction += (Math.random() - 0.5) * Math.PI / 2;
        }
    }
    
    // Calculate new position
    const deltaLat = Math.cos(animal.direction) * animal.speed * timeDelta;
    const deltaLon = Math.sin(animal.direction) * animal.speed * timeDelta;
    
    newLat = animal.currentPos[0] + deltaLat;
    newLon = animal.currentPos[1] + deltaLon;
    
    // Check if new position is within territory
    if (!isPointInPolygon([newLat, newLon], animal.territory)) {
        // For hunting animals, expand territory toward target if needed
        if (huntingAnimals.includes(animal.type)) {
            // Allow movement outside territory if moving toward target
            const distanceToTarget = calculateDistance(newLat, newLon, targetCoords[0], targetCoords[1]);
            const currentDistanceToTarget = calculateDistance(
                animal.currentPos[0], animal.currentPos[1], 
                targetCoords[0], targetCoords[1]
            );
            
            // Allow movement if it gets closer to target
            if (distanceToTarget < currentDistanceToTarget) {
                // Update position even if outside territory
                animal.currentPos = [newLat, newLon];
                animal.lastUpdate = now;
                return animal;
            }
        }
        
        // Bounce back towards territory center for normal behavior
        const centerLat = animal.territory.reduce((sum, point) => sum + point[0], 0) / animal.territory.length;
        const centerLon = animal.territory.reduce((sum, point) => sum + point[1], 0) / animal.territory.length;
        
        animal.direction = Math.atan2(centerLon - animal.currentPos[1], centerLat - animal.currentPos[0]);
        
        newLat = animal.currentPos[0] + Math.cos(animal.direction) * animal.speed * timeDelta;
        newLon = animal.currentPos[1] + Math.sin(animal.direction) * animal.speed * timeDelta;
    }
    
    animal.currentPos = [newLat, newLon];
    animal.lastUpdate = now;
    
    return animal;
}

function isPointInPolygon(point, polygon) {
    let x = point[0], y = point[1];
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];
        
        if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    
    return inside;
}

function checkAnimalProximity(userLat, userLon, animal) {
    const distance = calculateDistance(userLat, userLon, animal.currentPos[0], animal.currentPos[1]);
    
    // Debug logging
    console.log(`Checking ${animal.name}: User(${userLat.toFixed(6)}, ${userLon.toFixed(6)}) vs Animal(${animal.currentPos[0].toFixed(6)}, ${animal.currentPos[1].toFixed(6)}) = ${distance.toFixed(1)}m`);
    
    if (distance <= animal.dangerRadius) {
        console.log(`🚨 DANGER ALERT: ${animal.name} is ${distance.toFixed(1)}m away!`);
        return {
            level: 'danger',
            distance: distance,
            message: `🚨 DANGER! ${animal.name} the ${animal.type} is only ${distance.toFixed(1)}m away! Move to safety immediately!`
        };
    } else if (distance <= animal.warningRadius) {
        console.log(`⚠️ WARNING: ${animal.name} is ${distance.toFixed(1)}m away`);
        return {
            level: 'warning',
            distance: distance,
            message: `⚠️ WARNING: ${animal.name} the ${animal.type} is ${distance.toFixed(1)}m away. Please maintain safe distance.`
        };
    }
    
    return null;
}

function getAnimalIcon(animalType) {
    const icons = {
        tiger: '🐅',
        elephant: '🐘',
        leopard: '🐆',
        lion: '🦁',
        bear: '🐻',
        wolf: '🐺',
        deer: '🦌',
        rhino: '🦏'
    };
    return icons[animalType] || '🐾';
}

function getLocationByLatLon(latitude, longitude) {
// Nominatim endpoint for reverse geocoding
const nominatimEndpoint = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

// Make the GET request to Nominatim API using fetch
return fetch(nominatimEndpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        // console.log(result)
        const address = result.display_name;
        return address;
    })
    .catch(error => {
        console.error("Error during reverse geocoding:", error);
        return null;
    });
}

let mapClick = (e) => {
  console.log(e.latlng)
}