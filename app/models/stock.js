const db = require(`../database`);

/**
 * Expected json object in request body
 * @typedef Stock
 * @property {string} name
 */


class Stock {
    constructor(obj={}){
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }


    //methods: 

    // find all stocks according to the user
    static async findAll(userId) {
        try {
            const {rows} = await db.query(`SELECT * FROM stock WHERE user_id=$1 `, [userId]);
            return rows.map(row => new Stock(row));

        } catch (error) {
            console.log(error);
            throw new Error(error.detail ? error.detail : error.message);
        }
    }


    //Find one according to the user
    static async findOne(userId, id) {
        try {
            const {rows} = await db.query(`SELECT * FROM stock WHERE user_id = $1 AND id = $2`,[userId, id]);
            if (!rows[0]){
                throw new Error(`Stock not available`);
            }
            return new Stock(rows[0]);
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }

    async save() {
        try {
        // Update stock in db
            if(this.id) {
                const result = await db.query(`SELECT update_stock ($1)`, [this]);
                if (result.rows[0].update_stock) {
                    return this;
                } else {
                    throw new Error(`Stock doesn't exist`);
                }
            }
            // Add stock in db
            else {
                const {rows} = await db.query(`SELECT new_stock($1)`, [this]);
            } 
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }


    //Delete a stock 
    static async delete (userId, id) {
        try {
            const {rows} = await db.query(`SELECT * FROM stock WHERE id=$1 AND user_id=$2`, [id, userId]);
            if (!rows[0]) {
                throw new Error(`No stock found`);
            }
            if (rows[0].name === `Maison`) {
                throw new Error(`This stock can't be deleted`);
            }
            await db.query (`DELETE FROM stock WHERE id = $1`, [id]);
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }
};

module.exports = Stock; 