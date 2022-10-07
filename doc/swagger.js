

module.exports = {
    swaggerDefinition: {
        info: {
            description: 'Edibles REST API',
            title: 'Edibles',
            version: '1.0.0',
        },
        host: process.env.NODE_ENV === 'production' ?
            process.env.HEROKU_URL : 
            `localhost:${process.env.PORT}`
        ,
        basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['../app/**/*.js'] //Path to the API handle folder
};
