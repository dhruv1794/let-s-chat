var express = require('express')
var app = express();
var http = require('http').Server(app);
var IO = require('socket.io')(http);
var mongoose = require('mongoose');

var DB_URL = 'mongodb://admin:password@ds221339.mlab.com:21339/mongo-chat'
var bodyParser = require('body-parser')
app.use(express.static(__dirname)) // this is to render index.html 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


var Message = mongoose.model('Message',{
    name:String,
    message:String
})

app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
    
   
})
app.post('/messages',(req,res)=>{
    var message = new Message(req.body)
    message.save((err)=>{
        if(err){
            sendStatus(500)
        }else{
            //message.push(req.body)
            IO.emit('message',req.body)
            res.sendStatus(200)
        }
    })
   
})
IO.on('connection',(socket)=>{
    console.log('User connected!')
})
mongoose.connect(DB_URL,(error)=>{
    console.log('connection successful')
})

//below code when not in socket mode 
// var server = app.listen(3010, ()=>{
//     console.log('App is listening to port', server.address().port)
// })

var server = http.listen(3010, ()=>{
    console.log('App is listening to port', server.address().port)
})