const db = require("../config/db.config")
const CustomAPIError = require("../errors/custom_error")

const verifyOrderCompleted = async (req, res, next) => {
    const { id_user } = req.user
    const { code_product } = req.params
    const sql_query = `
        SELECT ol.code_product, o.status FROM Orders o
        INNER JOIN Order_line ol 
        WHERE o.id_user = ? AND ol.code_product = ?
    `
    try {
        const [result, _] = await db.execute(sql_query, [id_user, code_product])
        if (result.length === 0) return next(CustomAPIError.forbidden("you can't rate a product which you didn't recieved"))
        if (result[0].status !== "Completed") return next(CustomAPIError.forbidden("you can't rate a product which you didn't recieved"))
        return next()
    } catch (error) {
        return next(error)
    }
}

module.exports = verifyOrderCompleted