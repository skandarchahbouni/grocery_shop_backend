const db = require("../config/db.config")

const getUserCart = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        SELECT pr.code_product, pr.name, pr.price, ph.lien_photo, ca.category_name, c.quantity FROM Cart c 
        INNER JOIN Products pr 
        ON pr.code_product = c.code_product
        INNER JOIN Categories ca
        ON ca.id_category = pr.id_category
        INNER JOIN Photos ph
        ON ph.code_product = c.code_product
        WHERE c.id_user = ?
        GROUP BY pr.code_product
    `
    try {
        const [cart, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(cart)
    } catch (error) {
        return next(error)
    }
}

const addProductToCart = async (req, res, next) => {
    const { id_user } = req.user 
    const { code_product } = req.body 
    const quantity = req.body?.quantity || 1
    const sql_query = "INSERT INTO Cart (id_user, code_product, quantity) VALUES (?, ?, ?)"
    try {
        await db.execute(sql_query, [id_user, code_product, quantity])
        return res.status(200).json("product added to cart succesffuly")
    } catch (error) {
        return next(error)
    }
}

const removeProductFromCart = async (req, res, next) => {
    const { id_user } = req.user
    const { code_product } = req.params
    const sql_query = "DELETE FROM Cart WHERE id_user = ? AND code_product = ?"
    try {
        await db.execute(sql_query, [id_user, code_product])
        return res.status(200).json("product removed from cart succesfully")
    } catch (error) {
        return next(error)
    }
}

const incrementProductQuantity = async (req, res, next) => {
    // Remark : even if the cart doesn't contain the product, this will not cause an error 
    // so ne need to check first whether the product exists or not 
    const { code_product } = req.params
    const { id_user } = req.user 
    const sql_query = `
        UPDATE Cart 
        SET quantity = quantity + 1
        WHERE id_user = ? AND code_product = ?
    `
    try {
        await db.execute(sql_query, [id_user, code_product])
        return res.status(200).json("Quantity incremented succesfully")
    } catch (error) {
        return next(error)
    }
}

const decerementProductQuantity = async (req, res, next) => {
    // Remark : even if the cart doesn't contain the product, this will not cause an error 
    // so ne need to check first whether the product exists or not 
    const { id_user } = req.user 
    const { code_product } = req.params
    const sql_query = `
        UPDATE Cart 
        SET quantity = quantity - 1
        WHERE id_user = ? AND code_product = ?
    `
    try {
        await db.execute(sql_query, [id_user, code_product])
        return res.status(200).json("Quantity decremented succesfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getUserCart,
    addProductToCart,
    removeProductFromCart,
    incrementProductQuantity,
    decerementProductQuantity
}

