const db = require("../config/db.config")

const updateUserInfo = async (req, res) => {

    try {
        return res.status(200).json("updateUserInfo")
    } catch (error) {
        
    }
}

const deleteAccount = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        DELETE FROM Users WHERE id_user = ?
    `
    try {
        await db.execute(sql_query, [id_user])
        return res.status(200).json("account deleted successfully")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    updateUserInfo,
    deleteAccount
}
