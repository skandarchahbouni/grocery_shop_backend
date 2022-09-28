const db = require('../config/db.config')
const remove_undefined_attributes = require('../helpers/remove_undefined')
const Address = require('../modals/addresses')

const getUserAddresses = async (req, res, next) => {
    const { id_user } = req.user 
    const sql_query = `
        SELECT a.*, u.id_user, u.is_default FROM Addresses a INNER JOIN User_Addresses u
        ON a.id_address = u.id_address
        WHERE u.id_user = ?
    `
    try {
        const [addresses, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(addresses)
    } catch (error) {
        return next(error)
    }
}

// can add a middleware to check first whether the address exists or not 
// to avoid duplicate in the database 
// Assuming that multiple users can have the same address 
const addNewAddress = async (req, res, next) => {
    const { id_user } = req.user
    const address = remove_undefined_attributes(new Address(req.body))

    const values = Object.values(address)
    const arr = new Array(values.length).fill('?')
    const sql_query_1 = `INSERT INTO Addresses (${Object.keys(address)}) Values (${arr})`
    // isDefault field is set by default to false
    const sql_query_2 = "INSERT INTO User_Addresses (id_address, id_user) VALUES (? , ?)"
    let connection
    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        const [{ insertId }] = await connection.execute(sql_query_1, values) 
        await connection.execute(sql_query_2, [insertId, id_user])
        await connection.commit()
        return res.status(200).json("Address created succesfully")
    } catch (error) {
        await connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

// set all others user addresses to false
const setDefaultAddress = async (req, res, next) => {

    const { id_address } = req.params
    const { id_user } = req.user
    const sql_query_1 = `
        UPDATE User_addresses SET is_default = false 
        WHERE id_user = ?
    `
    const sql_query_2 = `
        UPDATE User_addresses SET is_default = true
        WHERE id_address = ? AND id_user = ?
    `

    let connection
    try {
        connection = await db.getConnection()
        await connection.beginTransaction()
        await connection.execute(sql_query_1, [id_user])
        await connection.execute(sql_query_2, [id_address, id_user])
        await connection.commit()
        return res.status(200).json("Address set as default successfully")
    } catch (error) {
        await connection.rollback()
        return next(error)
    } finally {
        connection.release()
    }
}

const deleteAddress = async (req, res, next) => {
    const { id_address } = req.params
    const { id_user } = req.user

    const sql_query = "DELETE FROM User_addresses WHERE id_address = ? and id_user = ?"
    try {
        await db.execute(sql_query, [id_address, id_user])
        return res.status(200).json("Address deleted successfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getUserAddresses,
    addNewAddress,
    setDefaultAddress,
    deleteAddress
}
