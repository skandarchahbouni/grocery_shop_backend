const router = require('express').Router()
const productsController = require('../controllers/products')
const authenticationMiddleware = require('../middlewares/auth')
const verifyOrderCompleted = require('../middlewares/verify_order_completed')

router.get('/', productsController.getAllProducts)
router.get('/count', productsController.getNbResults)
router.get('/:code_product', productsController.getSingleProduct)
router.get('/:code_product/reviews', productsController.getReviews)
router.post('/:code_product/add-review', authenticationMiddleware, verifyOrderCompleted , productsController.addReview)

module.exports = router