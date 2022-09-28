const router = require('express').Router()
const CustomAPIError = require('../errors/custom_error')
const upload = require('../middlewares/upload_files')
const db = require('../config/db.config')

const save_in_db = async (req, res, next) => {

    const { files } = req

    if (!files) return next(CustomAPIError.badRequest("No image were provided"))

    const { code_product } = req.params
    const values = []
    files.forEach( file => {
        const { filename } = file
        values.push(code_product, filename)
    });

    const arr = new Array(files.length).fill('(?, ?)')
    const query = `
        INSERT INTO Photos (code_product, lien_photo) VALUES ${arr}
    `

    try {
        await db.execute(query, values)
        return res.status(200).json("uploaded succesfully")
    } catch (error) {
        return next(error)
    }
}

router.post('/multiple/:code_product', upload.array('images', 4), save_in_db)

module.exports = router