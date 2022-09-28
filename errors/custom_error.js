class CustomAPIError extends Error {
    constructor(message, statusCode) {
      super(message)
      this.statusCode = statusCode
    }
  
    static badRequest (msg){
      return new CustomAPIError(msg, 400)
    }
  
    static internal (msg){
      return new CustomAPIError(msg, 500)
    }

    static forbidden (msg) {
        return new CustomAPIError(msg, 403)
    }
  }
  
  module.exports = CustomAPIError