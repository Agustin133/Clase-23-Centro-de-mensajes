const express = require('express');
const { options } = require('./index');
const { chats } = require('./create_model');
const util = require('util');
const { normalize, schema } = require('normalizr');
const { denormalize } = require('normalizr');
const { response } = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/chat',(req,res) => {
    res.sendFile(__dirname+'/chat.html');
})

let messages = [];

let Nmessages = [];

app.get('/denormalize',(req,res) => {
    const denormalizedData = denormalize(normalizedData.result, article, normalizedData.entities)
    res.json(denormalizedData);
    console.log(denormalizedData)
})

io.on('connection', (socket) => {
    console.log('Un nuevo cliente se ha conectado');
    socket.emit('messages',messages);

    socket.on('all-messages', function(data) {
        messages.push(data);
        Nmessages.push(data);
        io.sockets.emit('messages',messages);
        //console.log(messages);
        const ch = new chats(data);
        ch.save();
        async function msj() {
            const response = await chats.find();
            io.sockets.emit('messages',response)
            function print(objeto) {
                console.log(util.inspect(objeto,false,7,true));
            }
            const userSchema = new schema.Entity('users');
            const userListSchema = new schema.Array(userSchema);
            const normalizedData = normalize(Nmessages, userListSchema);
            console.log('---------- NORMAL DATA ----------');
            console.log(response);
            //print(response);
            console.log(JSON.stringify(response).length);  
            console.log('---------- NORMALIZED DATA ----------');
            console.log(normalizedData);
            print(normalizedData);
            console.log(JSON.stringify(normalizedData).length);
        }
        msj()
    });
});

http.listen( 8000, () => {
    console.log('Running on port http://localhost:8000/chat')
});