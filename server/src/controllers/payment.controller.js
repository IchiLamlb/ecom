const PaymentService = require("../services/payment.service");

class PaymentController {
    async requestPayment(req, res) {
        const { amount, id } = req.body;
        return await PaymentService.requestPayment({ id, amount }, res);
    }

    async getAll(req, res) {
        return PaymentService.getAll(res);
    }

    async updatePayment(req, res, next) {
        PaymentService.updatePayment(req.params.id, req.body, res, next);
    }

    async delete(req, res, next) {
        const { id } = req.params;

        await PaymentService.delete(id, res);
    }

    async week(req, res, next) {
        const { date } = req.body;

        await PaymentService.week(date, res);
    }

    async year(req, res, next) {
        const { year } = req.body;

        await PaymentService.year(year, res);
    }

    async dateRange(req, res, next) {
        await PaymentService.dateRange(req.body, res);
    }

    async productReport(req, res, next) {
        const { end, start } = req.body;

        await PaymentService.productReport({ end, start }, res);
    }

    async customerReport(req, res, next) {
        const { end, start } = req.body;

        await PaymentService.customerReport({ end, start }, res);
    }
}

module.exports = new PaymentController();
