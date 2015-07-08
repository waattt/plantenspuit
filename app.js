var express = require('express');
var socketio = require('socket.io');

var path = require('path');
var moment = require('moment');
var five = require("johnny-five");
var board = new five.Board({repl: false});

var app = express();
var server = require('http').createServer(app);
var io = socketio.listen(server);

app.use(express.static('static'));
app.use('/webcam',express.static(path.join(__dirname, 'static/webcam')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});


board.on("ready", function() {
    var pomp = new five.Led(13);
    
    io.sockets.on('connection', function (socket) {
        console.log('User connected');
        io.emit('laatst', lastTimeDate);
        socket.on('my other event', function (data) {
            pomp.on(); 
        });
        socket.on('geef water', function(msg){            
            if(geefWater(1000) == 'OK'){
                io.emit('laatst', lastTimeDate);
            }else {
                io.emit('watergeef fout', 'Foutje met watergeven');
            }
        });
    });
    
    var bezig = false;
    var lastTimeDate = moment().format();
    function geefWater(duration){
        if(bezig == false){
            bezig = true;
            pomp.on();
            setTimeout(function(){
                pomp.off();
                bezig = false;
            }, duration);
            lastTimeDate = moment().format(); 
            return 'OK';
        }else {
            return 'Is al bezig!';
        }
    }
    
});

server.listen(3000);
console.log('Listening at port 3000');