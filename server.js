const express = require('express')
const app = express();
const server = require('http').createServer(app);
const socketio = require('socket.io')
const io = socketio(server)
const cors = require('cors')

app.use(express.static(__dirname + "/public"));

// Allow requests from any origin for development and production
const corsOptions = {
    origin: true, // Allow all origins for now
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let current_users = {}

io.on('connection', (socket) => {
    console.log("A User connected! user id: "+socket.id)

    socket.on('client-location', (data)=>{
        current_users[socket.id] = {
            username: data.username,
            platform: data.platform,
            lat: data.lat,
            lon: data.lon,
            lastUpdate: Date.now()
        };
        io.emit('server-location', {...data, id: socket.id});
        // Send updated visitor list to all clients
        io.emit('visitors-update', current_users);
    })

    // Handle live location updates
    socket.on('location-update', (data) => {
        current_users[socket.id] = {
            username: data.username,
            platform: data.platform,
            lat: data.lat,
            lon: data.lon,
            lastUpdate: data.timestamp || Date.now()
        };
        // Broadcast the updated location to all connected users
        io.emit('user-location-updated', {
            ...data, 
            id: socket.id,
            timestamp: data.timestamp || Date.now()
        });
        // Send updated visitor list to all clients
        io.emit('visitors-update', current_users);
    })

    socket.on('client-join-location', (data) => {
        io.emit('client-join-server', {...data, id: socket.id})
    })


    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        const disconnectedUser = current_users[socket.id];
        io.emit('disconnected_user', {id: socket.id, username: disconnectedUser ? disconnectedUser.username : 'Unknown'});
        delete current_users[socket.id];
        // Send updated visitor list to all clients
        io.emit('visitors-update', current_users);
      });

})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`UEM Kolkata Wildlife Tracker server is running on port ${PORT}!`)
})