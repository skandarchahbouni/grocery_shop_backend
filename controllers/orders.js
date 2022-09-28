const db = require("../config/db.config")
const getCurrentDate = require("../helpers/get_current_date")

const getUserOrders = async (req, res, next) => {
    const { id_user } = req.user 
    const sql_query = `
        SELECT o.*, SUM(pr.price * ol.quantity) total, SUM(ol.quantity) items FROM ORDERS o 
        INNER JOIN Order_line ol
        ON ol.id_order = o.id_order
        INNER JOIN Products pr 
        ON pr.code_product = ol.code_product
        WHERE o.id_user = ?
        GROUP BY o.id_order
        `
    try {
        const [orders, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(orders)
    } catch (error) {
        return next(error)
    }
}

const getSingleOrder = async (req, res, next) => {
    const { id_order } = req.params
    const { id_user } = req.user 
    const sql_query = `
        SELECT o.status, ol.*, pr.code_product, pr.name, pr.price, ph.lien_photo, c.category_name FROM Order_line ol
        INNER JOIN Orders o ON o.id_order = ol.id_order
        INNER JOIN Products pr ON pr.code_product = ol.code_product
        INNER JOIN Photos ph ON pr.code_product = ph.code_product
        INNER JOIN Categories c ON c.id_category = pr.id_category
        WHERE o.id_user = ? AND ol.id_order = ?
        GROUP BY pr.code_product
    `

    try {
        const [orderLine , _] = await db.execute(sql_query, [id_user , id_order])
        if (orderLine.length === 0) return res.status(404).json("order not found")
        return res.status(200).json(orderLine)
    } catch (error) {
        return next(error)
    }
}

const addNewOrder = async (req, res, next) => {
    const { id_user } = req.user
    const { id_address, delevery_instructions, payement_method } = req.body
    const date_order = getCurrentDate()
    const status = "Processing"
    const delevery_cost = 5

    const sql_query_1 = `
        INSERT INTO ORDERS(id_user, id_address, delevery_instructions, payement_method, status, delevery_cost, date_order)
        VALUES (? , ? , ?, ?, ? ,?, ?)
    `
    const { cart } = req
    let connection
    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(sql_query_1, [id_user, id_address, delevery_instructions, payement_method, status, delevery_cost, date_order])
        const list = []
        cart.map(item => list.push(`(${ insertId }, "${item.code_product}", ${item.quantity})`))
        const values = list.join(' , ')
        const sql_query_2 = `INSERT INTO Order_line(id_order, code_product, quantity) VALUES ${values}`
        await connection.execute(sql_query_2)
        await connection.commit()
        return res.status(201).json("Order created Successfully")
    } catch (error) {
        await connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const cancelOrder = async (req, res, next) => {
    const { id_order } = req.params
    const sql_query = `
        UPDATE Orders SET status = "Canceled"
        WHERE id_order = ? 
    `
    try {
        await db.execute(sql_query, [id_order])
        return res.status(200).json("Order cancelled succesfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getUserOrders,
    getSingleOrder,
    addNewOrder,
    cancelOrder
}