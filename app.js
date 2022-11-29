const express = require('express')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT

app.use('/', (req, res, next) => {
    res.send('hello world')
})



app.listen(PORT, () => {
    console.log(`http//localhost:${PORT}`)
})