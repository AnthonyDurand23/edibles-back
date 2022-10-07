const db = require('../database');

/**
 * Expected json object in request body
 * @typedef Product
 * @property {string} name
 * @property {number} quantity
 * @property {date} expirationDate
 * @property {number} stockId
 */

class Product {
    constructor(obj={}){
        for (const propName in obj) {
            this[propName] = obj[propName]
        }
    }

// Methods 
// Find all products in all stoks (user id) 
    static async findAll(userId) {
        try {
            const {rows} = await db.query(`SELECT product.* from product
                                                JOIN stock_has_product ON product.id = stock_has_product.product_id
                                                JOIN stock ON stock_has_product.stock_id = stock.id
                                                WHERE stock.user_id = $1
                                                ORDER BY expiration_date;`, [userId]);
            return rows.map(row => new Product(row));

        } catch (error) {
            console.log(error);
            throw new Error(error.detail ? error.detail : error.message);
        }
    }
// Find all products in one specific stock 
    static async findAllByStock(userId, stockId) {
        try {
            const {rows} = await db.query(`SELECT product.* from product
                                                JOIN stock_has_product ON product.id = stock_has_product.product_id
                                                JOIN stock ON stock_has_product.stock_id = stock.id
                                                WHERE stock.user_id = $1 AND stock.id = $2
                                                ORDER BY expiration_date;`, [userId, stockId]);
            return rows.map(row => new Product(row));

        } catch (error) {
            console.log(error);
            throw new Error(error.detail ? error.detail : error.message);
        }
    }

// add one product in one stock 
// update one product who is in one stock
    async save() {
        try {
            const {rows} = await db.query(`SELECT id FROM stock WHERE user_id=$1`, [this.userId]);
            const stocks = rows.map(row => row.id);
            if (stocks.includes(this.stockId)) {
                // Update product in db
                if(this.id) {
                    const result = await db.query(`SELECT update_product ($1)`, [this]);
                    if (result.rows[0].update_product) {
                        return this;
                    } else {
                        throw new Error(`Product doesn't exist`);
                    }
                }
                // Add product in db
                else {
                    const {rows} = await db.query(`SELECT new_product($1) AS id`, [this]);
                    this.productId = rows[0].id;
                    await db.query(`SELECT new_stock_has_product($1)`, [this])
                } 
            } else {
                throw new Error(`Stock doesn't exist`);
            }
        
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }
// delete product from stock 
    static async delete (userId, id) {
        try {
            const {rows} = await db.query(`SELECT * from product
                                                JOIN stock_has_product ON product.id = stock_has_product.product_id
                                                JOIN stock ON stock_has_product.stock_id = stock.id
                                                WHERE stock.user_id = $1 AND product.id = $2;`, [userId, id]);
            if (!rows[0]) {
                throw new Error(`No product found`);
            }
            await db.query (`DELETE FROM product WHERE id = $1`, [id]);
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }

}

module.exports = Product;