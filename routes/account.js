const router = require('express').Router()
const accountController = require('../controllers/account')

// this is used for authorization routes
router.put('/', accountController.updateUserInfo)
router.delete('/', accountController.deleteAccount)

module.exports = router