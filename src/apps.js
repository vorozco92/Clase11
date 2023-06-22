import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import viewRouter from './routes/views.routes.js'
import { Server } from 'socket.io'

const app = express()

const httpserver = app.listen(8080, () => console.log("Server up!"))

const io = new Server(httpserver)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewRouter)

// io.on //escuchar y recibir
// io.emit //hablar y enviar
let messages = [];

io.on('connection', socket => {
    console.log("Nuevo cliente conectado")

    io.emit('messagesLogs',messages);
    socket.on('message', data => {
        messages.push(data);
        io.emit('messagesLogs',messages);
        console.log(data)
    })

    socket.on('newUser', data => {
        socket.broadcast.emit('newUserFront',data);
        console.log(data)
    })
    
})