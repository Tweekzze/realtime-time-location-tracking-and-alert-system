const form = document.querySelector('#form')
const locState = document.querySelector('#loc-state')
const splash = document.querySelector('.splash')
const username = localStorage.getItem('username')
// Global variables for location tracking
let watchId;
let currentSocket;
let currentUsername;
let userMarker;
let currentMap;

// Removed clientContainer, recomendContainer references as containers were deleted

if(navigator.geolocation){
    // Request high accuracy location
    const locationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
    };

    // First get initial position
    navigator.geolocation.getCurrentPosition((position) => {
        locState.innerHTML = 'Tracking Active';
        let username = localStorage.getItem('username')

        if(username) {
            splash.classList.remove('show')
            splash.classList.add('hide')
            currentUsername = username;
            main(username, position.coords.latitude, position.coords.longitude)
            startLiveLocationTracking(username, position.coords.latitude, position.coords.longitude);
        } else {
            form.classList.remove('hide')
            form.classList.add('show')
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if(form.check.checked) {
                    localStorage.setItem('username', form.username.value)
                } 
                currentUsername = form.username.value;
                main(form.username.value, position.coords.latitude, position.coords.longitude)
                startLiveLocationTracking(form.username.value, position.coords.latitude, position.coords.longitude);
                splash.classList.add('hide')
            })
        }

    }, (error) => {
        console.error('Geolocation error:', error);
        locState.innerHTML = 'Access Denied';
        handleLocationError(error);
    }, locationOptions);

} else {
    console.log('Geolocation not supported!')
    locState.innerHTML = 'Not Supported';
}

// Function to start continuous location tracking
function startLiveLocationTracking(username, initialLat, initialLon) {
    const locationOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
    };

    // Start watching position for continuous updates
    watchId = navigator.geolocation.watchPosition((position) => {
        const newLat = position.coords.latitude;
        const newLon = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        console.log(`Live location update: ${newLat}, ${newLon} (accuracy: ${accuracy}m)`);

        // Update location display
        locState.innerHTML = `Live (±${Math.round(accuracy)}m)`;

        // Update user position on map if map exists
        if (currentMap && userMarker) {
            updateUserMarkerPosition(newLat, newLon, accuracy);
        }

        // Send location update to server if socket exists
        if (currentSocket && currentSocket.connected) {
            console.log('Sending location update to server:', { lat: newLat, lon: newLon, username });
            currentSocket.emit("location-update", {
                lat: newLat,
                lon: newLon,
                username: username,
                accuracy: accuracy,
                platform: platform.description,
                timestamp: Date.now()
            });
        } else {
            console.warn('Socket not connected, cannot send location update');
        }

    }, (error) => {
        console.error('Location tracking error:', error);
        handleLocationError(error);
    }, locationOptions);
}

// Function to update user marker position
function updateUserMarkerPosition(lat, lon, accuracy) {
    if (userMarker && currentMap) {
        // Update marker position
        userMarker.setLatLng([lat, lon]);
        
        // Update popup content with current coordinates
        const popupContent = `
            <div class="user-popup">
                <h4><i class="ri-user-location-line"></i> Your Location</h4>
                <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lon.toFixed(6)}</p>
                <p><strong>Accuracy:</strong> ±${Math.round(accuracy)} meters</p>
                <p><strong>Last Updated:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        userMarker.setPopupContent(popupContent);

        // Optionally center map on user location (uncomment if desired)
        // currentMap.setView([lat, lon], currentMap.getZoom());
    }
}

// Function to handle location errors
function handleLocationError(error) {
    let errorMessage = '';
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            locState.innerHTML = 'Permission Denied';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            locState.innerHTML = 'Unavailable';
            break;
        case error.TIMEOUT:
            errorMessage = "Location request timed out";
            locState.innerHTML = 'Timeout';
            break;
        default:
            errorMessage = "Unknown location error";
            locState.innerHTML = 'Error';
            break;
    }
    console.error(errorMessage, error);
    
    // Show user-friendly error message
    showLocationErrorAlert(errorMessage);
}

// Function to show location error alert
function showLocationErrorAlert(message) {
    const alertHtml = `
        <div class="location-error-alert">
            <i class="ri-error-warning-line"></i>
            <div class="alert-content">
                <h4>Location Tracking Issue</h4>
                <p>${message}</p>
                <p>Please enable location access and refresh the page to use live tracking.</p>
            </div>
        </div>
    `;
    
    // You can show this in a modal or notification area
    console.warn('Location Error:', message);
}

// Function to set global references (called from main function)
function setGlobalReferences(socket, map, marker) {
    currentSocket = socket;
    currentMap = map;
    userMarker = marker;
}


// Removed unused event handlers for deleted menu buttons

// Park Info Panel
const parkInfo = document.querySelector('.park-info')
if (parkInfo) {
    parkInfo.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const parkInfoPanel = document.querySelector('.park-info-panel');
        if (parkInfoPanel) {
            parkInfoPanel.classList.add('active');
        }
        // Remove window.history.back() to prevent page exit
    });
}

// Close park info panel
const closePanel = document.querySelector('.close-panel')
if (closePanel) {
    closePanel.addEventListener('click', () => {
        const parkInfoPanel = document.querySelector('.park-info-panel');
        if (parkInfoPanel) {
            parkInfoPanel.classList.remove('active');
        }
    });
}

// Active Viewers Panel
const activeViewers = document.querySelector('.active-viewers')
if (activeViewers) {
    activeViewers.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        const activeViewersPanel = document.querySelector('.active-viewers-panel');
        if (activeViewersPanel) {
            activeViewersPanel.classList.add('active');
        }
    });
}

// Close active viewers panel
const closeViewersPanel = document.querySelector('.close-viewers-panel')
if (closeViewersPanel) {
    closeViewersPanel.addEventListener('click', () => {
        const activeViewersPanel = document.querySelector('.active-viewers-panel');
        if (activeViewersPanel) {
            activeViewersPanel.classList.remove('active');
        }
    });
}




// document.addEventListener('DOMContentLoaded', function() {
    //     if (!Notification) {
    //       alert('Desktop notifications not available in your browser. Try Chromium.');
    //       return;
    //     }
      
    //     if (Notification.permission !== "granted")
    //       Notification.requestPermission();
    //   });
      
    //   function notifyMe(title, msg, logo="https://github.com/alok-devforge/realtime-time-location-tracking-and-alert-system/blob/master/public/images/3d-navigation.png?raw=true") {
    //     if (Notification.permission !== "granted")
    //       Notification.requestPermission();
    //     else {
    //       var notification = new Notification(title, {
    //         icon: logo,
    //         body: msg,
    //       });
    //     }
    //   }

// Top Navigation Menu Functionality - Updated for vertical dropdown
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navIcon = document.getElementById('nav-icon');
    const navMenu = document.getElementById('nav-menu');
    let isNavOpen = false;

    // Initialize menu as closed
    if (navMenu) {
        navMenu.classList.remove('nav-open');
        isNavOpen = false;
    }
    if (navIcon) {
        navIcon.className = 'ri-menu-line';
    }
    // Clear any hash that might show menu
    if (window.location.hash === '#nav-menu') {
        window.location.hash = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            
            isNavOpen = !isNavOpen;
            
            if (isNavOpen) {
                // Menu is opening
                navMenu.classList.add('nav-open');
                navIcon.className = 'ri-close-line';
                window.location.hash = '#nav-menu';
            } else {
                // Menu is closing
                navMenu.classList.remove('nav-open');
                navIcon.className = 'ri-menu-line';
                window.location.hash = '';
            }
        });
    }

    // Handle hash changes (back button, etc.)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash === '#nav-menu') {
            isNavOpen = true;
            if (navMenu) navMenu.classList.add('nav-open');
            if (navIcon) navIcon.className = 'ri-close-line';
        } else {
            isNavOpen = false;
            if (navMenu) navMenu.classList.remove('nav-open');
            if (navIcon) navIcon.className = 'ri-menu-line';
        }
    });
    
    // Close panels and menu when clicking outside
    document.addEventListener('click', function(e) {
        // Close menu when clicking outside
        if (isNavOpen && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            isNavOpen = false;
            navMenu.classList.remove('nav-open');
            navIcon.className = 'ri-menu-line';
            window.location.hash = '';
        }
        
        // Close park info panel when clicking outside
        const parkInfoPanel = document.querySelector('.park-info-panel');
        if (parkInfoPanel && parkInfoPanel.classList.contains('active')) {
            if (!parkInfoPanel.contains(e.target) && !e.target.closest('.park-info')) {
                parkInfoPanel.classList.remove('active');
            }
        }
        
        // Close active viewers panel when clicking outside
        const activeViewersPanel = document.querySelector('.active-viewers-panel');
        if (activeViewersPanel && activeViewersPanel.classList.contains('active')) {
            if (!activeViewersPanel.contains(e.target) && !e.target.closest('.active-viewers')) {
                activeViewersPanel.classList.remove('active');
            }
        }
    });
});