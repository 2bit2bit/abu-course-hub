const express = require('express')

const blogController = require('../controllers/blog')

const router = express.Router()

router.use('/', blogController.getIndex)


module.exports = router