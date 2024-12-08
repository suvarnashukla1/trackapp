const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path'); // Importing the 'path' module

const server = http.createServer(app);
const io = socketio(server);

// Set view engine to EJS
app.set('view engine', 'ejs');

// Set up the public directory for static files
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data});
    });

    socket.on("disconnect",function(){
        io.emit("user-disconnected")
    })
    console.log("connected");
})
// Route to render the homepage
app.get('/', function(req, res) {
    res.render('index'); 
});

// Starting the server on port 3000
server.listen(3000);