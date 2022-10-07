const userValidation = function(request, response, next) {
        const joi = require("joi");

        let user = joi.object({
            email: joi.string().email().trim(true).required(),
            firstname: joi.string().required(),
            lastname: joi.string().required()
        });
        if (request.body.password || request.url === '/signup') {
                user = user.keys({
                password: joi.string().min(8).trim(true).required(),
                repeatPassword: joi.string().required().valid(joi.ref('password'))
            });
        }
        if (request.url === '/user') {
                user = user.keys({
                expiration_date_notification: joi.boolean().required(),
                default_stock: joi.string().required()
            });
        }
        const {error} = user.validate(request.body);
        if(error) {
            return response.status(400).json(error.message);
        }
        next();
};


module.exports = userValidation;