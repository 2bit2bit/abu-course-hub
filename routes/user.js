const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.get('/create-article', userController.getCreateArticle)
router.post('/create-article', userController.postCreateArticle)

router.get('/my-articles', userController.getMyArticles)

// router.put('/edit-article/:articleId/update_state', userController.postUpdateState)

router.get('/edit-article/:articleId', userController.getEditArticle)
router.post('/edit-article/:articleId', userController.postEditArticle)

// router.delete('/delete-article/:articleId', userController.postDeletetArticle)

module.exports = router