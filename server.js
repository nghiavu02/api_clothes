const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 3000

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', (req, res)=>{
    res.send('hello')
})


app.listen(port, ()=>{
    console.log(`Server is running on the port ${port}`)
})