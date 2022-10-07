const bcrypt = require('bcrypt');
const db = require('../database');

class NoUserError extends Error {
    constructor(email) {
        super(`No user with email: ${email}`);
    }
}

/**
 * Expected json object in request body
 * @typedef User
 * @property {string} email
 * @property {string} password
 * @property {string} firstname
 * @property {string} lastname
 */

class User {

    static NoUserError = NoUserError;

    constructor(obj={}) {
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }

    async doLogin() {
        try {
            //SELECT USER (route login)
            const {rows} = await db.query('SELECT * FROM "user" WHERE email=$1', [this.email]);
            if (!rows[0]) {
                throw new NoUserError(this.email);
            }
            const isValid = await bcrypt.compare(this.password, rows[0].password);
            if (!isValid) {
                throw new Error('Identification failed');
            }
            delete this.password;
            this.id = rows[0].id;
            this.firstname = rows[0].firstname;
            this.lastname = rows[0].lastname;
            this.expiration_date_notification = rows[0].expiration_date_notification;
            this.default_stock = rows[0].default_stock;
            return this;
        } catch(error) {
            console.log(error);
            if (error.detail) {
                throw new Error(error.detail);
            }
            throw error;
        }
    }

    async save() {
        try {
            if (this.password) this.password = await bcrypt.hash(this.password, 10);
            if (this.id) {
                //UPDATE USER
                await db.query('SELECT update_user($1)', [this]);
                if (this.password) delete this.password;
                return this;
            } else {
                //CREATE USER (route signup)
                const {rows} = await db.query('SELECT new_user($1) AS id', [this]);
                //CREATE default stock when creating a new user
                await db.query('SELECT new_stock($1)', [{"name": "Maison", "userId": rows[0].id}]);
            }
        } catch(error) {
            console.log(error);
            if (error.detail) {
                throw new Error(error.detail)
            } else {
                throw error;
            }
        }
    }

    static async delete(id) {
        try {
            //DELETE USER
            const {rows} = await db.query('SELECT * FROM "user" WHERE id=$1', [id]);
            if (!rows[0]) {
                throw new Error(`No user found`);
            }
            await db.query(`DELETE FROM product
                            WHERE product.id IN (
                                SELECT product.id FROM product
                                JOIN stock_has_product ON product.id = stock_has_product.product_id
                                JOIN stock ON stock_has_product.stock_id = stock.id
                                WHERE stock.user_id = $1
                            );`, [id]);
            await db.query('DELETE FROM "user" WHERE id = $1;', [id]);
        } catch(error) {
            if (error.detail) {
                throw new Error(error.detail);
            }
            throw error;
        }
    }


    //Method to find one user by email
    static async findByEmail(email){
        try {
            const {rows} = await db.query('SELECT * FROM "user" WHERE email = $1;', [email]);
            if (rows[0]) { 
                return new User(rows[0]); 
            }  
        } catch (error) {
            if (error.detail) {
                throw new Error(error.detail);
            }
            throw error;
        }
    }
    

    //Method to find on user by id 
    static async findById(id){
        try {
            const {rows} = await db.query(`SELECT "user".*, stock.id AS stock_id
                                            FROM "user"
                                            JOIN stock ON stock.user_id = "user".id
                                            WHERE "user".id = $1 AND "user".default_stock = stock.name`, [id]);
            if (rows[0]) { 
               return new User(rows[0]); 
           }
        } catch (error) {
            if (error.detail) {
                throw new Error(error.detail);
            }
            throw error;
        }
    }
};
module.exports = User;