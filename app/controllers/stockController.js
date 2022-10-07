const Stock = require(`../models/stock`);

const stockController = {
    findAll: async (request, response) => {
        try {
            const userId = request.payload.id;
            const stocks = await Stock.findAll(userId);
            response.status(200).json(stocks);
        } catch(error) {
            response.status(500).send(error.message);
        }
    },

    findOne: async (request, response) => {
        try {
            const userId = request.payload.id;
            const stockId = request.params.id;
            const stock = await Stock.findOne(userId, stockId);
            response.status(200).json(stock);
        } catch(error) {
            response.status(500).send(error.message);
        }
    },

    save: async (request, response) => {
        try {
            request.body.userId = request.payload.id;
            if (request.params.id) {
                //Update stock
                request.body.id = request.params.id;
                const stock = await new Stock(request.body).save();
                response.status(200).json(stock);
            } else {
                //Create stock
                await new Stock(request.body).save();
                response.status(201).json(`Stock created`);
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    },

    delete: async(request, response) => {
        try {
            const userId = request.payload.id;
            const stockId = request.params.id;
            await Stock.delete(userId, stockId);
            response.status(200).json(`Stock deleted`);            
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    }

};

module.exports = stockController;