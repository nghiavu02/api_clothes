const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 3000
const initRoutes = require('./routes')
const db = require('./config/db/dbconnect')
const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
db.connect()
initRoutes(app)


app.listen(port, ()=>{
    console.log(`Server is running on the port ${port}`)
})