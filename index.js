const express = require('express');
const app = express();
const http = require('http').createServer(app);

const socket = require('socket.io');

app.set('views',__dirname + '/views');
app.set('view engine', 'ejs');

require('./router')(app,http);
app.use('/',express.static(__dirname + '/public'));

require('./socket')(app,app.listen(33334),socket);

console.log("Start Server at " + new Date);