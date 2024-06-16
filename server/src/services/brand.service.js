const { Brand } = require("../models/brand.model");

class BrandService {
    static async create(body, res) {
        const brand = new Brand(body);

        return brand.save((err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({
                success: true,
                brand: doc,
            });
        });
    }

    static async getAll(res) {
        return Brand.find({}, (err, brands) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(brands);
        });
    }

    static async delete(id, res) {
        return Brand.findByIdAndRemove({ _id: id }, (err, product) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json("Successfully removed");
            }
        });
    }

    static async update(id, body, res, next) {
        return Brand.findById(id, (err, item) => {
            if (!item) {
                return next(new Error("could not load Document"));
            } else {
                // do your update here
                item.name = body.name;
                item.save()
                    .then((item) => {
                        res.json("Update complete");
                    })
                    .catch((err) => {
                        res.status(400).send("unable to update the database");
                    });
            }
        });
    }
}

module.exports = BrandService;
