const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom_error')

const authenticationMiddleware = async (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return next(CustomAPIError.forbidden("no token provided."))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // you can pass just the id 
    req.user = decoded
    next()
  } catch (error) {
    return next(CustomAPIError.forbidden("not authorized to access this route"))
  }
}

module.exports = authenticationMiddleware