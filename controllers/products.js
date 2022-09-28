const db = require("../config/db.config")
const group_response = require("../helpers/group_response")


// average reviews and images and groupe response 
// INNER JOIN Photos po ON po.code_product = pr.code_product wtani zid po.lien_photo

const getAllProducts = async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 1
    const skip = (page - 1) * limit

    const { name, categories, price, manufacturer, sort } = req.query
    let attributes = []
    if (name){
        attributes.push(`pr.name = '${name.trim()}'`)
    }
    if (categories){
        const list_categories = categories.split(',').filter(e => e).map(e => "'" + e.trim() + "'")
        attributes.push(`c.category_name in (${list_categories})`)
    }
    if(price){
        const price_min_max = price.split('-').map(Number)
        if (price_min_max.length === 2) {
            if (!Number.isNaN(price_min_max[0])) {
                attributes.push(`pr.price >= ${price_min_max[0]}`)
            }
            if (!Number.isNaN(price_min_max[1])) {
                attributes.push(`pr.price <= ${price_min_max[1]}`)
            }
        }
    }
    if(manufacturer){
        const manufacturer_list = manufacturer.split(',').filter(e => e).map(e => "'" + e.trim() + "'")
        attributes.push(`manufacturer in (${manufacturer_list})`)
    }

    let orderby = ''
    switch (sort) {
        case "price":
            orderby = 'ORDER BY pr.price'
            break;
        case "-price":
            orderby = 'ORDER BY pr.price DESC'
            break;
    
        default:
            break;
    }

    let sql_query
    if (attributes.length > 0){
        attributes = attributes.join(' AND ')
        sql_query = `
            SELECT pr.*, c.category_name, po.lien_photo FROM Products pr
            INNER JOIN Photos po ON po.code_product = pr.code_product
            INNER JOIN Categories c ON c.id_category = pr.id_category
            WHERE ${attributes}
            GROUP BY pr.code_product
            ${orderby}
            LIMIT ${limit} OFFSET ${skip}
        `
    } else {
        sql_query = `
        SELECT pr.*, c.category_name, po.lien_photo FROM Products pr
        INNER JOIN Photos po ON po.code_product = pr.code_product
        INNER JOIN Categories c ON c.id_category = pr.id_category
        GROUP BY pr.code_product
        ${orderby}
        LIMIT ${limit} OFFSET ${skip}
    `
    }
    
    try {
        const [products, _] = await db.execute(sql_query)
        return res.status(200).json(products)
    } catch (error) {
        return next(error)
    }
}

const getSingleProduct = async (req, res, next) => {
    const { code_product } = req.params
    const sql_query = `
        SELECT pr.*, c.category_name, po.lien_photo FROM Products pr
        INNER JOIN Photos po ON po.code_product = pr.code_product
        INNER JOIN Categories c ON c.id_category = pr.id_category
        WHERE pr.code_product = ?
    `
    const sql_query_2 = `
        SELECT * FROM products WHERE code_product = ?
    `

    try {
        const [data] = await db.execute(sql_query, [code_product])
        if (data.length === 0) return res.status(404).json("product not found")
        // grouping the response 
        const product = group_response(data)
        return res.status(200).json(product)
    } catch (error) {
        return next(error)
    }
}

const getReviews = async (req, res, next) => {
    const { code_product } = req.params
    const sql_query = "SELECT * FROM Reviews Where code_product = ?"
    try {
        const [reviews, _] = await db.execute(sql_query, [code_product])
        return res.status(200).json(reviews)
    } catch (error) {
        return next(error)
    }
}

const addReview = async (req, res, next) => {
    console.log("addReview")
    const { code_product } = req.params
    const { id_user } = req.user
    const { stars, headline, body } = req.body

    const sql_query = "INSERT INTO Reviews (id_user, code_product, stars, headline, body) VALUES (?, ?, ?, ?, ?)"
    try {
        await db.execute(sql_query, [id_user, code_product, stars, headline, body])
        return res.status(200).json("Review added succesfully")
    } catch (error) {
        return next(error)
    }
}

const getNbResults = async (req, res, next) => {

    const { name, categories, price, manufacturer } = req.query
    let attributes = []
    if (name){
        attributes.push(`pr.name = '${name.trim()}'`)
    }
    if (categories){
        const list_categories = categories.split(',').filter(e => e).map(e => "'" + e.trim() + "'")
        attributes.push(`c.category_name in (${list_categories})`)
    }
    if(price){
        const price_min_max = price.split('-').map(Number)
        if (price_min_max.length === 2) {
            if (!Number.isNaN(price_min_max[0])) {
                attributes.push(`pr.price >= ${price_min_max[0]}`)
            }
            if (!Number.isNaN(price_min_max[1])) {
                attributes.push(`pr.price <= ${price_min_max[1]}`)
            }
        }
    }
    if(manufacturer){
        const manufacturer_list = manufacturer.split(',').filter(e => e).map(e => "'" + e.trim() + "'")
        attributes.push(`manufacturer in (${manufacturer_list})`)
    }


    let sql_query
    if (attributes.length > 0){
        attributes = attributes.join(' AND ')
        sql_query = `
            SELECT count(distinct pr.code_product) nb_results FROM Products pr
            INNER JOIN Photos po ON po.code_product = pr.code_product
            INNER JOIN Categories c ON c.id_category = pr.id_category
            WHERE ${attributes}
        `
    } else {
        sql_query = `
        SELECT count(distinct pr.code_product) nb_results FROM Products pr
        INNER JOIN Photos po ON po.code_product = pr.code_product
        INNER JOIN Categories c ON c.id_category = pr.id_category
    `
    }
    
    try {
        const [nb_results, _] = await db.execute(sql_query)
        return res.status(200).json(nb_results[0])
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    getReviews,
    addReview,
    getNbResults
}