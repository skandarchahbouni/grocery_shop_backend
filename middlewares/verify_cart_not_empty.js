const db = require("../config/db.config")
const CustomAPIError = require("../errors/custom_error")

const verifyCartNotEmpty = async (req, res, next) => {
    const { id_user } = req.user 
    const sql_query = "SELECT * FROM Cart WHERE id_user = ?"
    try {
        const [cart, _] = await db.execute(sql_query, [id_user])
        if (cart.length === 0) return next(CustomAPIError.badRequest("Empty cart"))
        req.cart = cart
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = verifyCartNotEmpty