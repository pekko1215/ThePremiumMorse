module.exports = (app,server)=>{
    app.get('/',(req,res,next)=>{
        next();
    })
    app.get('/room/:roomid',(req,res,next)=>{
        res.render('room',{roomid:req.params.roomid})
    })
}
