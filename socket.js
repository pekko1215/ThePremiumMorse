module.exports = (app, http, socket)=> {
    //socket.ioの初期化
    const io = socket.listen(http);
    //expressのセッションをとってくる
    io.sockets.on('connection', (socket)=> {
        var room = "";

        socket.on('join',(name)=>{
            room = name;
            socket.join(room);
            // console.log(`Join to ${name}`)
        })
        socket.on('code',()=>{
            io.to(room).emit('receive',{});
        })
    })
}