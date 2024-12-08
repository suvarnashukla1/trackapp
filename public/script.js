const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "suvarna",
}).addTo(map);

const markers = {};
socket.on("receive-location", (data) => {
    console.log("Received data:", data);
    const { id, latitude, longitude } = data;

    if (!latitude || !longitude) {
        console.error("Invalid coordinates:", latitude, longitude);
        return;
    }

    map.setView([latitude, longitude], 17);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});
