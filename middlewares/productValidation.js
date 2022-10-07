const productValidation = function(request, response, next) {
    const joi = require("joi");

    let product = joi.object({
        code: joi.number(),
        name: joi.string().trim(true).required(),
        url_picture: joi.string().trim(true),
        quantity: joi.number().max(9999).required(),
        expirationDate: joi.date(),
        stockId: joi.number().max(99).required()
    });
    
    const {error} = product.validate(request.body);
    if(error) {
        return response.status(400).json(error.message);
    }
    next();
};


module.exports = productValidation;