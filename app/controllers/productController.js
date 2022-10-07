const Product = require(`../models/product`);

const productController = {
    findAll: async (request, response) => {
        try {
            const userId = request.payload.id;
            const products = await Product.findAll(userId);
            response.status(200).json(products);
        } catch(error) {
            response.status(500).send(error.message);
        }
    },

    findAllByStock: async (request, response) => {
        try {
            const userId = request.payload.id;
            const stockId = request.params.id;
            const products = await Product.findAllByStock(userId, stockId);
            response.status(200).json(products);
        } catch(error) {
            response.status(500).send(error.message);
        }
    },

    save: async (request, response) => {
        try {
            request.body.userId = request.payload.id;
            if (request.params.id) {
                //Update product
                request.body.id = request.params.id;
                const product = await new Product(request.body).save();
                response.status(200).json(product);
            } else {
                //Create product
                await new Product(request.body).save();
                response.status(201).json(`Product created`);
            }
        } catch (error) {
            response.status(500).send(error.message);
        }
    },

    delete: async(request, response) => {
        try {
            const userId = request.payload.id;
            const productId = request.params.id;
            await Product.delete(userId, productId);
            response.status(200).json(`Product deleted`);            
        } catch (error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    }
};

module.exports = productController;