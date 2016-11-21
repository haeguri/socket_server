var express = require('express');
var http = require('http');

var app = express();

var socket = null;

var httpServer = http.createServer(app).listen(3000, function() {
    console.log("Socket IO Server has been started");
});

var io = require('socket.io').listen(httpServer);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/schedule/changed', function(req, res) {
    if (req.query.type === 'delete') {
        console.log("req.id is", req.query.id);
        io.sockets.emit('schedule_removed', {
            'id':req.query.id
        });
    } else if (req.query.type === 'add' || req.query.type === 'edit') {
        io.sockets.emit('schedule_changed');
    }
    res.send('received');
});

app.get('/noti/del', function(req, res) {
    io.sockets.emit('rmnoti', req.query.type);
    console.log("deleted type ", req.query.type);
    res.send('deleted');
});

app.get('/noti', function(req, res) {
    var noti = {
        'type':req.query.type,
        'title':req.query.title,
        'msg':req.query.msg
    };

    console.log("received type ", req.query.type);
    console.log("received title ", req.query.title);
    console.log("received msg ", req.query.msg);

    io.sockets.emit('newnoti', noti);
    res.send('received');
});