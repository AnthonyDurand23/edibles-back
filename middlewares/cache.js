const db = require('../app/database-redis');

//on va utiliser un utilitaire fourni avec node qui permet de transformer une fonction utilisant un callback standard (avec une signature (error, result) => {}) en une fonction qui marche avec des promesses
const {promisify} = require('util');

//vu qu'on fait une copie de la méthode, elle perd son contexte, this n'a plus de valeur à l'intérieur de son code
//on remédie à ça en liant la fonction copiée avec un object
//c'est cet object qui sera désigné par this dans le code de la fonction
const asyncClient = {
    get: promisify(db.get).bind(db),
    set: promisify(db.set).bind(db),
    setex: promisify(db.setex).bind(db),
    del: promisify(db.del).bind(db),
    exists: promisify(db.exists).bind(db)
}

const PREFIX = 'edibles';

const TIMEOUT = 60 * 30; // 30 minutes

let keys = [];


const cache = async (request, response, next) => {
    const key = `${PREFIX}:${request.payload.id}:${request.url}`;               
  
    if (keys.includes(key)) {  
        const json = await asyncClient.get(key);
        const value = JSON.parse(json);
        response.json(value);
    } else {
        const originalJson = response.json.bind(response);
        response.json = async data => {
            const jsonData = JSON.stringify(data);
            await asyncClient.set(key, jsonData);
            keys.push(key);
            console.log('Version modifiée de response.json');
            originalJson(data);
        }

        next();
    }
}

const flush = async (request, __, next) => {
    const key = `${PREFIX}:${request.payload.id}:products`;
        // for (const key of keys) {
        //     console.log('Removing key', key);
        // }
        await asyncClient.del(key);
        keys = keys.filter(function(value) {
            const id = value.split(':');
            if(id[1] != request.payload.id) {
                return value
            };
        });
        // keys.length = 0;

        next();
};

module.exports = {
    cache,
    flush
};