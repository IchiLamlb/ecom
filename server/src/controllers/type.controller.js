const TypeService = require("../services/type.service");

class TypeController {
    async create(req, res) {
        return await TypeService.create(req.body, res);
    }

    async getAll(req, res) {
        return await TypeService.getAll(res);
    }

    async update(req, res, next) {
        return await TypeService.update(req.params.id, req.body, res, next);
    }

    async delete(req, res) {
        return await TypeService.delete(req.params.id, res);
    }
}

module.exports = new TypeController();
