const jwt = require(`jsonwebtoken`);

module.exports = {
    makeToken: function(user) {
        try {
            return jwt.sign(
                //payload
                {
                    user
                },
                //le mot de passe de chiffrement
                process.env.SECRET,
                //header
                {
                    algorithm: `HS256`,
                    expiresIn: `60m`
                }
            );
        } catch (error) {
            throw error;
        }
    },
    validateToken: function(token) {
        try {
            return jwt.verify(
                token,
                process.env.SECRET,
                {
                    algorithms: [`HS256`]
                }
            );
        } catch (error) {
            throw error;
        }
    },
};
