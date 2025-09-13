// This file handles user marker management to ensure all users are visible on the map

// Global marker collections
let userMarkerManager = {
    markers: {},  // Store markers by user ID
    
    // Add or update a user marker
    updateMarker: function(map, userData) {
        const id = userData.id;
        const username = userData.username || id;
        const lat = userData.lat;
        const lon = userData.lon;
        
        // Create the marker with default Leaflet icon
        // Using default Leaflet icon for consistency
        const userIcon = new L.Icon.Default();
        
        // Create tooltip for username (only for other users, not current user)
        const userTooltip = L.tooltip({
            permanent: true,
            direction: 'top',
            className: 'username-tooltip',
            offset: [0, -30] // Position tooltip above the marker
        }).setContent(username);
        
        // Create popup content
        const popupContent = `
            <div class="user-popup">
                <h4><i class="ri-user-3-line"></i> ${username}</h4>
                <p><strong>Platform:</strong> ${userData.platform || 'Unknown'}</p>
                <p><strong>Coordinates:</strong> ${lat.toFixed(6)}, ${lon.toFixed(6)}</p>
                <p><strong>Last Updated:</strong> ${new Date(userData.lastUpdate || Date.now()).toLocaleTimeString()}</p>
            </div>
        `;
        
        // If marker already exists, update it
        if (this.markers[id]) {
            this.markers[id].setLatLng([lat, lon]);
            this.markers[id].setPopupContent(popupContent);
            // Update tooltip content
            if (this.markers[id].getTooltip()) {
                this.markers[id].getTooltip().setContent(username);
            }
        } 
        // Otherwise create a new marker
        else {
            this.markers[id] = L.marker([lat, lon], { icon: userIcon })
                .bindTooltip(userTooltip)
                .addTo(map)
                .bindPopup(popupContent);
            
            console.log(`Added new marker for user: ${username}`);
        }
        
        return this.markers[id];
    },
    
    // Remove a marker for a disconnected user
    removeMarker: function(map, userId) {
        if (this.markers[userId]) {
            map.removeLayer(this.markers[userId]);
            delete this.markers[userId];
            console.log(`Removed marker for user: ${userId}`);
            return true;
        }
        return false;
    },
    
    // Clear all markers (except the current user)
    clearAllMarkers: function(map, exceptUserId) {
        for (let id in this.markers) {
            if (id !== exceptUserId) {
                map.removeLayer(this.markers[id]);
                delete this.markers[id];
            }
        }
        console.log('Cleared all user markers');
    },
    
    // Get all current user IDs
    getAllUserIds: function() {
        return Object.keys(this.markers);
    },
    
    // Get marker count
    getMarkerCount: function() {
        return Object.keys(this.markers).length;
    }
};