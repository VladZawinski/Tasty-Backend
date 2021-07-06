const express = require('express')
const app = express()

const mongoose = require('mongoose');
const db = mongoose.connection;

require('dotenv').config()

mongoose.connect(process.env.ATLAS_URL,{ useNewUrlParser: true, useUnifiedTopology: true})

db.on('error', console.error.bind(console, 'connection error'))
db.on('open', function(){
     console.log('Connected to database');
})

app.use(express.json())
require('./routes/routes')(app)

const port = process.env.PORT || 8080

app.listen(port, () => {
     console.log(`Server started listening at ${port}`);
})