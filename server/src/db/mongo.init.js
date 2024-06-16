const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.Promise = global.Promise;
        mongoose
            .connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log("MongoDB Connected!"))
            .catch((err) => console.log(err));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
