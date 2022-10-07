const stockValidation = function(request, response, next) {
    const joi = require("joi");

    const stock = joi.object({
        name: joi.string().min(1).lowercase().required()
    });
    const {error} = stock.validate(request.body);
    if(error) {
        return response.status(400).json(error.message);
    }
    next();
};

module.exports = stockValidation;