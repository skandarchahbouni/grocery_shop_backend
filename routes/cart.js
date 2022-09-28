const router = require('express').Router()
const cartController = require('../controllers/cart')

router.get('/', cartController.getUserCart)
router.post('/add-product', cartController.addProductToCart)
router.delete('/:code_product/remove-product', cartController.removeProductFromCart)
router.put('/:code_product/incrment-quantity', cartController.incrementProductQuantity)
router.put('/:code_product/decrement-quantity', cartController.decerementProductQuantity)

module.exports = router