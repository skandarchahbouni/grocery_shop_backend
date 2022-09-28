const db = require("../config/db.config")

const getUserWishlist = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        SELECT pr.code_product, pr.price, pr.name, pr.quantity_in_stock, p.lien_photo FROM Wishlist w 
        INNER JOIN Products pr 
        ON pr.code_product = w.code_product 
        INNER JOIN Photos p
        ON p.code_product = w.code_product 
        WHERE w.id_user = ?
        GROUP BY pr.code_product
    `
    try {
        const [wishlist, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(wishlist)
    } catch (error) {
        return next(error)
    }
}

const addProductToWishlist = async (req, res, next) => {
    const { code_product } = req.body
    const { id_user } = req.user
    const sql_query = "INSERT INTO Wishlist (id_user, code_product) VALUES (?, ?)"
    try {
        await db.execute(sql_query, [id_user, code_product])
        return res.status(200).json("added to wishlist succesfully")
    } catch (error) {
        return next(error)
    }
}

const removeProductFromWishlist = async (req, res, next) => {
    const { code_product } = req.params
    const { id_user } = req.user
    const sql_query = "DELETE FROM Wishlist WHERE id_user = ? AND code_product = ?"
    try {
        await db.execute(sql_query, [id_user, code_product])
        return res.status(200).json("deleted succesfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getUserWishlist,
    addProductToWishlist,
    removeProductFromWishlist
}
