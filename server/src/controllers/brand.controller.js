const BrandService = require("../services/brand.service");

class BrandController {
    async create(req, res) {
        return await BrandService.create(req.body, res);
    }

    async getAll(req, res) {
        return await BrandService.getAll(res);
    }

    async update(req, res) {
        return await BrandService.update(req.params.id, req.body, res, next);
    }

    async delete(req, res) {
        return await BrandService.delete(req.params.id, res);
    }
}

module.exports = new BrandController();
