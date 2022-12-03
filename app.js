const express = require('express')
require('dotenv').config()

const errorController = require('./controllers/error')
const blogRoute = require('./routes/blog')

const app = express()


const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.static('public'))



app.use(blogRoute)

app.use(errorController.get404)

app.listen(PORT, () => {
    console.log(`http//localhost:${PORT}`)
})