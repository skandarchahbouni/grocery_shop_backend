const db = require('../config/db.config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom_error')


const signup = async (req, res, next) => {
    const saltRounds = 10
    const { email, password } = req.body

    if (!email) return next(CustomAPIError.badRequest("missing required attribute: email"))
    if (!password) return next(CustomAPIError.badRequest("missing required attribute: password"))

    let hashed_password
    try {
        hashed_password = await bcrypt.hash(password, saltRounds)
    } catch (error) {
        return CustomAPIError.internal("something went wrong")
    }

    const sql_query = `
        INSERT INTO Users(email, password) VALUES (? , ?)
    `
    
    try {
        const [{ insertId }] = await db.execute(sql_query, [email, hashed_password])

        const user = {id_user : insertId, email}
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '5d',
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.ENVIRONMENT !== "development",
            maxAge: 5 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(user)

    } catch (error) {
        return next(error)
    }
}

const signin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email) return next(CustomAPIError.badRequest("missing required attribute: email"))
    if (!password) return next(CustomAPIError.badRequest("missing required attribute: password"))

    const sql_query = `
        SELECT * FROM Users WHERE email = ?
    `
    try {
        const [user, _] = await db.execute(sql_query, [email])
        if (user.length === 0){}
        // users.length == 1 bcz email adresse is unique 
        const current_user = user[0]
        let match
        try {
            match = await bcrypt.compare(password, current_user.password)
        } catch (error) {
            return next(error)
        }

        if (!match) {
            // password mismatch
            return next(CustomAPIError.badRequest("wrong credentials"))
        }
        // match == true

        delete current_user.password

        const token = jwt.sign(current_user, process.env.JWT_SECRET, {
            expiresIn: '5d',
        })
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 5 * 24 * 60 * 60 * 1000,
            secure: process.env.ENVIRONMENT !== "development",
        });
        return res.status(200).json(current_user)
    } catch (error) {
        return next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        res.cookie('token', {
            expires: Date.now(),
            httpOnly: true,
        })
        return res.status(200).json("logout succesfully")
    } catch (error) {
        return next(error)
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        return res.status(200).json("forgotPassword")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    signup,
    signin,
    logout,
    forgotPassword
}

