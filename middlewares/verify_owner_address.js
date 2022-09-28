const db = require("../config/db.config")
const CustomAPIError = require("../errors/custom_error")

const verifyOwnerAddress = async (req, res, next) => {
    const { id_address } = req.params
    const { id_user } = req.user
    const sql_query = "SELECT id_address FROM User_addresses WHERE id_user = ? AND id_address = ?"

    try {
        const [address, _] = await db.execute(sql_query, [id_user, id_address])
        if (address.length === 0) return next(CustomAPIError.forbidden("Address doesn't belong to the user."))
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = verifyOwnerAddress