// Establish socket connection
const socket = io();

// Check if geolocation is supported by the browser
if (navigator.geolocation) {
    // Watch for continuous position updates
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
}

// Initialize Leaflet map
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tiles to the map
L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Chetan"
}).addTo(map);

// Object to store markers
const markers = {};

// Socket.io event listeners
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]); // Center map on received coordinates

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update marker position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker from map
        delete markers[id]; // Delete marker object
    }
});
