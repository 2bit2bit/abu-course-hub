const express = require('express')
require('dotenv').config()

const errorController = require('./controllers/error')
const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')

const app = express()

const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(authRoutes)
app.use(blogRoutes)



app.use(errorController.get404)

app.listen(PORT, () => {
    console.log(`http//localhost:${PORT}`)
})