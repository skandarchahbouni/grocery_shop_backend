const router = require('express').Router()
const ordersController = require('../controllers/orders')
const authenticationMiddleware = require('../middlewares/auth')
const verifyCartNotEmpty = require('../middlewares/verify_cart_not_empty')

router.get('/', ordersController.getUserOrders)
router.get('/:id_order', ordersController.getSingleOrder)
router.post('/add-new-order', verifyCartNotEmpty ,ordersController.addNewOrder)
router.put('/:id_order/cancel', ordersController.cancelOrder)

module.exports = router