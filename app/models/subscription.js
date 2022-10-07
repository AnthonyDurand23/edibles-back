const db = require(`../database`);

class Subscription {
    constructor(obj={}){
        for (const propName in obj) {
            this[propName] = obj[propName];
        }
    }

    //methods: 
    async insert() {
        try {
            await db.query(`SELECT new_subscription($1)`, [this]);
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }

    static async countPeremptionProductsByEndpoint() {
        try {
            const { rows } = await db.query(`SELECT * FROM count_peremption_product_by_endpoint`);
            return rows;
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }

    static async deleteSubscriptionFromDatabase(endpoint) {
        try {
            await db.query(`DELETE FROM subscription WHERE endpoint = $1`, [endpoint]);
        } catch (error) {
            throw new Error(error.detail ? error.detail : error.message);
        }
    }
}

module.exports = Subscription;