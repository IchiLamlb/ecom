const { Wood } = require("../models/wood.model");

class TypeService {
    static async create(body, res) {
        const type = new Wood(body);
        return type.save((err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({
                success: true,
                wood: doc,
            });
        });
    }

    static async getAll(res) {
        return Wood.find({}, (err, types) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(types);
        });
    }

    static async delete(id, res) {
        return Wood.findByIdAndRemove({ _id: id }, (err, product) => {
            if (err) {
                return res.json(err);
            } else {
                return res.json("Successfully removed");
            }
        });
    }

    static async update(id, body, res, next) {
        return Wood.findById(id, (err, item) => {
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

module.exports = TypeService;
