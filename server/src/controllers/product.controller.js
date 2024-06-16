const ProductService = require("../services/product.service");

class ProductController {
    async getProductByShop(req, res) {
        return await ProductService.getProductByShop(req.body, res);
    }

    async getArticles(req, res) {
        return await ProductService.getArticles(req.query, res);
    }

    async getArticleById(req, res) {
        return await ProductService.getArticleById(req.query, res);
    }

    async createArticle(req, res) {
        return await ProductService.createArticle(req.body, res);
    }

    async updateArticle(req, res, next) {
        return await ProductService.updateArticle(req.params.id, req.body, res, next);
    }

    async getProducts(req, res) {
        return await ProductService.getProducts(req.query, res);
    }

    async searchProductByName(req, res) {
        return await ProductService.searchProductByName(req.params.name, res);
    }

    async delete(req, res) {
        return await ProductService.delete(req.params.id, res, next);
    }
}

module.exports = new ProductController();
