const express = require('express');
const { dbConnection } = require('./dataBase/config');
require('dotenv').config();
const cors = require('cors')
const app = express();
dbConnection();

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
//Rutas
app.use('/api/auth',require('./routes/auth'))
app.use('/api/events',require('./routes/events'))


app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})