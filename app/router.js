const { Router } = require(`express`);
const checkJwt = require(`../middlewares/checkJwt`);
const userValidation = require('../middlewares/userValidation');
const stockValidation = require('../middlewares/stockValidation');
const productValidation = require('../middlewares/productValidation');
const checkJWTResetPassword = require('../middlewares/checkJWTResetPassword');
// const {cache, flush} = require('../middlewares/cache');

//Controllers Import 
const userController = require(`./controllers/userController`);
const stockController = require(`./controllers/stockController`);
const productController = require(`./controllers/productController`);
const pushNotificationController = require(`./controllers/pushNotificationController`);
const Stock = require(`./models/stock`);
const User = require(`./models/user`);
const Product = require(`./models/product`);

const router = Router();

//Routes Related to user:
//Signup
/**
 * Responds with user created id or error message
 * @route POST /signup
 * @summary Responds with user created id or error message
 * @group User
 * @param {User.model} object.body.required Object containing the properties to insert a user
 * @returns {String} 201 - An message user created
 * @returns {string} 500 - An error message
 */
router.post(`/signup`, userValidation, userController.signup);

/**
 * Expected json object in request body
 * @typedef Login
 * @property {string} email
 * @property {string} password
 */
//Login
/**
 * Responds with user object or error message
 * @route POST /login
 * @summary Responds with user object or error message
 * @group User
 * @param {Login.model} object.body.required email and password of user
 * @returns {User.model} 200 - Information of the user
 * @returns {string} 500 - An error message
 */
router.post(`/login`, userController.login);

//Get
/**
 * Responds with user object or error message
 * @route GET /user
 * @summary Responds with user object or error message
 * @group User
 * @returns {User.model} 200 - Information of the user
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.get(`/user`, checkJwt, userController.getUser);

//Delete
/**
 * Responds with user deleted or error message
 * @route DELETE /user
 * @summary Responds with user deleted or error message
 * @group User
 * @returns {String} 200 - An message user deleted
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.delete(`/user`, checkJwt, userController.deleteUser);

//Edit 
router.patch(`/user`, checkJwt, userValidation, userController.editUser);

//Routes for stock:

//Get all stocks
/**
 * Responds with all stocks of the user connected
 * @route GET /stock
 * @summary Responds with all stocks of the user connected
 * @group Stock
 * @returns {Array} 200 - An array with all stocks of the user connected
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.get(`/stock`, checkJwt, stockController.findAll);

//Get a stock
/**
 * Responds with a specific stock of the user connected
 * @route GET /stock/{id}
 * @summary Responds with a specific stock of the user connected
 * @group Stock
 * @param {number} id.path.required Id of stock 
 * @returns {Stock.model} 200 - An objet of the specific stock
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.get(`/stock/:id`, checkJwt, stockController.findOne);

//Create a stock
/**
 * Responds with stock created id or error message
 * @route POST /stock
 * @summary Responds with stock created id or error message
 * @group Stock
 * @param {Stock.model} object.body.required name of the stock to insert
 * @returns {String} 201 - An message stock created
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.post(`/stock`, checkJwt,  stockValidation, stockController.save);

//Update a stock
/**
 * Responds with information of the stock updated or an error message
 * @route PATCH /stock/{id}
 * @summary Responds with information of the stock updated or an error message
 * @group Stock
 * @param {number} id.path.required Id of stock to update
 * @param {Stock.model} object.body.required name of the stock to update
 * @returns {Stock.model} 200 - The stock updated
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.patch(`/stock/:id`, checkJwt, stockValidation, stockController.save);

//Delete a stock
/**
 * Responds with a message stock deleted or an error message
 * @route DELETE /stock/{id}
 * @summary Responds with a message stock deleted or an error message
 * @group Stock
 * @param {number} id.path.required Id of stock to delete
 * @returns {Stock.model} 200 - Message Stock deleted
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.delete(`/stock/:id`, checkJwt, stockController.delete);

//Routes for product:
//Get all products from all stocks
/**
 * Responds with all products of all stocks of the user connected
 * @route GET /product
 * @summary Responds with all products of all stocks of the user connected
 * @group Product
 * @returns {Array} 200 - An Array of all products of all stocks
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.get(`/product`, checkJwt, /*cache,*/ productController.findAll);

//Get all products from one stock
/**
 * Responds with all products of a specific stock of the user connected
 * @route GET /stock/{id}/product
 * @summary Responds with all products of a specific stock of the user connected
 * @group Product
 * @param {number} id.path.required Id of stock 
 * @returns {Product.model} 200 - An Array of all products of a specific stock
 * @returns {string} 500 - An error message
 * @security JWT
 */
 
router.get(`/stock/:id/product`, checkJwt, /*cache,*/ productController.findAllByStock);

//Create a product
/**
 * Responds with a message Product created or an error message
 * @route POST /product
 * @summary Responds with a message Product created or an error message
 * @group Product 
 * @param {Product.model} object.body.required Product object to create
 * @returns {message} 200 - A message Product created
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.post(`/product`, checkJwt, productValidation, /*flush,*/ productController.save);

//Update a product
/**
 * Responds with a the product updated or an error message
 * @route PATCH /product/{id}
 * @summary Responds with a the product updated or an error message
 * @group Product 
 * @param {Product.model} object.body.required Product object to update
 * @param {number} id.path.required Id of product to update 
 * @returns {Product.model} 200 - The Product object updated
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.patch(`/product/:id`, checkJwt, productValidation, /*flush,*/ productController.save);

//Delete a product
/**
 * Responds with a message Product deleted or an error message
 * @route DELETE /product/{id}
 * @summary Responds with a message Product deleted or an error message
 * @group Product 
 * @param {number} id.path.required Id of product to delete 
 * @returns {message} 200 - A message Product deleted
 * @returns {string} 500 - An error message
 * @security JWT
 */
router.delete(`/product/:id`, checkJwt, /*flush,*/ productController.delete);

//Forgot password 
/**
 * Expected json object in request body
 * @typedef ForgotPassword
 * @property {string} email
 */
/**
 * Responds with a message link sent to email  or an error message 
 * @route /POST /forgotPassword
 * @summary Responds with a message link sent to email  or an error message 
 * @group User
 * @param {ForgotPassword.model} object.body.required email 
 * @returns {link} 200 - Link to reset password
 * @returns {string} An error message 
 * 
 */
router.post('/forgotPassword', userController.forgotPassword);

//Reset password 
/**
 * Expected json object in request body
 * @typedef ResetPassword 
 * @property {string} password
 * @property {string} repeatPassword
 */
/**
 * Responds with message updated password or an error message 
 * @route POST /resetPassword/{id}/{token}
 * @summary Responds with message updated password or an error message 
 * @group User
 * @param {number} id.path.required Id of user who forget password 
 * @param {string} token.path.required Token to identify the user who forget password
 * @returns {string} 200 - Message Updated password
 * @returns {string}  An error message 
 */
router.post('/resetPassword/:token', checkJWTResetPassword, userController.resetPassword);

//Route for push notification subscription
router.post(`/subscribe`, checkJwt, pushNotificationController.subscribe);

module.exports = router;