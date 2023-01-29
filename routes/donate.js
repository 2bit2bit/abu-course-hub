const express = require('express')

const donateController = require('../controllers/donate')

const router = express.Router()

router.get('/donate', donateController.getDonate)
router.post('/donate', donateController.postDonate)
router.get('/paystack_callback', donateController.getDonateCallback)
router.get('/receipt/:id', donateController.getDonateReciept)
router.post('/donate_error', donateController.getDonateError)


module.exports = router