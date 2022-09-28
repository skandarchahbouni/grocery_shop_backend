const router = require('express').Router()
const wishlistController = require('../controllers/wishlist')

router.get('/', wishlistController.getUserWishlist)
router.post('/add-product', wishlistController.addProductToWishlist)
router.delete('/:code_product/remove-product', wishlistController.removeProductFromWishlist)

module.exports = router