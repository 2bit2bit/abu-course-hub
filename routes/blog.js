const express = require('express')

const blogController = require('../controllers/blog')

const router = express.Router()

router.get('/articles/:articleId', blogController.getArticle)
router.get('/articles',blogController.getArticles)
router.get('/',blogController.getIndex)




module.exports = router