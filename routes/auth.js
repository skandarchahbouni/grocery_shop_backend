const router = require('express').Router()
const authController = require('../controllers/auth')

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)
router.get('/logout', authController.logout)
router.post('/forgot-password', authController.forgotPassword)

module.exports = router