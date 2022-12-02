const express = require('express')
require('dotenv').config()

const blogRoute = require('./routes/blog')

const app = express()

const PORT = process.env.PORT

app.set('view engine', 'ejs')

app.use('/', blogRoute)



app.listen(PORT, () => {
    console.log(`http//localhost:${PORT}`)
})