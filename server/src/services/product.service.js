const { Product } = require("../models/product.model");
const mongoose = require("mongoose");

class ProductService {
    static async getProductByShop(body, res) {
        let order = body.order ? body.order : "desc";
        let sortBy = body.sorBy ? body.sortBy : "_id";
        let limit = body.limit ? parseInt(body.limit) : 100;
        let skip = parseInt(body.skip);
        let findArgs = {};

        for (let key in body.filters) {
            if (body.filters[key].length > 0) {
                if (key === "price") {
                    findArgs[key] = {
                        $gte: body.filters[key][0],
                        $lte: body.filters[key][1],
                    };
                } else {
                    findArgs[key] = body.filters[key];
                }
            }
        }

        findArgs["publish"] = true;
        findArgs["quantity"] = { $gt: 0 };

        Product.find(findArgs)
            .populate("brand")
            .populate("wood")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, articles) => {
                if (err) return res.status(400).send(err);
                return res.status(200).json({
                    size: articles.length,
                    articles,
                });
            });
    }

    static async getArticles(query, res) {
        let order = query.order ? query.order : "asc";
        let sortBy = query.sortBy ? query.sortBy : "_id";
        let limit = query.limit ? parseInt(query.limit) : 100;
        let findArgs = {};

        findArgs["publish"] = true;
        findArgs["quantity"] = { $gt: 0 };

        return Product.find(findArgs)
            .populate("brand")
            .populate("wood")
            .sort([[sortBy, order]])
            .limit(limit)
            .exec((err, articles) => {
                if (err) return res.status(400).send(err);
                return res.status(200).send(articles);
            });
    }

    static async getArticleById({ type, id }, res) {
        let items = id;

        if (type === "array") {
            let ids = id.split(",");

            items = [];
            items = ids.map((item) => {
                return mongoose.Types.ObjectId(item);
            });
        }

        Product.find({ _id: { $in: items } })
            .populate("brand")
            .populate("wood")
            .exec((err, docs) => {
                if (err) return res.status(400).send(err);
                return res.status(200).send(docs);
            });
    }

    static async createArticle(body, res) {
        const product = new Product(body);

        product.save((err, doc) => {
            if (err) return res.json({ success: false, err });

            return res.status(200).json({
                success: true,
                article: doc,
            });
        });
    }

    static async updateArticle(id, body, res, next) {
        Product.findByIdAndUpdate(id, body, (err, product) => {
            if (err) return next(err);
            return res.status(200).json({
                success: true,
                product,
            });
        });
    }

    static async getProducts(filters, res) {
        let conditions = {};

        if (filters.brand_id) {
            conditions = {
                brand: mongoose.Types.ObjectId(filters.brand_id),
            };
        }

        if (filters.name) {
            conditions = {
                ...conditions,
                name: { $regex: new RegExp(`^${filters.name.toLowerCase()}`, "i") },
            };
        }

        Product.find(conditions, (err, types) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(types);
        })
            .populate("brand")
            .populate("wood");
    }

    static async searchProductByName(name, res) {
        Product.find({ name: { $regex: new RegExp(name, "i") } }, (err, product) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (product.length <= 0) {
                    res.json({ success: false, message: "No product found." });
                } else {
                    res.json({ success: true, product: product });
                }
            }
        });
    }

    static async delete(id, res, next) {
        Product.findByIdAndRemove({ _id: id }, (err, product) => {
            if (err) return next(err);
            return res.status(200).json({
                success: true,
                product,
            });
        });
    }
}

module.exports = ProductService;
