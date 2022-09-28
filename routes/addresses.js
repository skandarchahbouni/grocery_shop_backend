const router = require('express').Router()
const addressesController = require('../controllers/addresses')
const verifyOwnerAddress = require('../middlewares/verify_owner_address')

router.get('/', addressesController.getUserAddresses)
router.post('/add-new-address', addressesController.addNewAddress)
router.put('/:id_address/set-default', verifyOwnerAddress, addressesController.setDefaultAddress)
router.delete('/:id_address', verifyOwnerAddress, addressesController.deleteAddress)

module.exports = router 