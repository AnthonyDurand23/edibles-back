const {validateToken} = require('../services/token');

const checkJwt = function(request, response, next) {
    try {
        //On récupere le token envoyé par le front dans le Header
        const token = request.headers['authorization'];
        // On test si le token est valide
        const payload = validateToken(token);
        //Si il est valide on envoie dans request les infos du user
        request.payload = payload.user;
        //On passe au midleware suivant
        next();
    } catch (error) {
        //Si le token n'est pas valide on récupére l'erreur et on l'envoie au Front
        //jsonwebtoken fourni un message dans l'objet error : jwt expired, jwt signature is required etc ..
        response.status(500).json(error.message);
    }
};

module.exports = checkJwt;