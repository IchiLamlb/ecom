const UserService = require("../services/user.service");
const uploadDisk = require("../configs/multer.config");
const cloudinary = require("../configs/cloudinary.config");
const path = require("path");

class UserController {
    async login(req, res, next) {
        const { email, password } = req.body;
        return await UserService.login({ email, password }, res);
    }

    register(req, res) {
        return UserService.register(req.body, res);
    }

    async getAll(req, res) {
        return UserService.getAll(res);
    }

    async update(req, res, next) {
        const { id } = req.params;
        return UserService.updateById(id, req.body, res, next);
    }

    async resetUser(req, res) {
        return await UserService.resetUser(req.body.email, res);
    }

    async resetPassword(req, res) {
        return await UserService.resetPassword(req.body, res);
    }

    async updatePassword(req, res) {
        const { id } = req.params;
        return await UserService.updatePassword(id, req.body, res);
    }

    async updateProfile(req, res) {
        const { id } = req.params;
        return await UserService.updateProfile(id, req.body, res);
    }

    getAuth(req, res) {
        res.status(200).json({
            isAdmin: req.user.role === 0 ? false : true,
            isAuth: true,
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            lastname: req.user.lastname,
            role: req.user.role,
            cart: req.user.cart,
            history: req.user.history,
        });
    }

    async logout(req, res) {
        res.clearCookie("w_auth");
        res.clearCookie("ad_auth");
        return await UserService.logout(req.user._id, res);
    }

    async addToCart(req, res) {
        const { quantity } = req.body;
        const { productId, price } = req.query;
        return await UserService.addToCart(
            {
                userId: req.user._id,
                productId,
                quantity,
                price,
            },
            res
        );
    }

    async updateCart(req, res) {
        const { key } = req.body;
        const { productId } = req.query;
        return await UserService.updateCart(
            {
                userId: req.user._id,
                productId,
                key,
            },
            res
        );
    }

    async removeFromCart(req, res) {
        const { _id } = req.query;
        return await UserService.removeFromCart(
            {
                userId: req.user._id,
                cardId: _id,
            },
            res
        );
    }

    async successBuy(req, res) {
        const { paymentData, cartDetail, amount } = req.body;
        await UserService.successBuy(
            {
                amount,
                cartDetail,
                paymentData,
                user: req.user,
            },
            res
        );
    }

    async uploadFile(req, res) {
        uploadDisk.single("file")(req, res, (err) => {
            if (err) {
                return res.json({ success: false, err });
            }
            return res.json({ success: true, image: req.file.path });
        });
    }

    async uploadImage(req, res) {
        await cloudinary.uploader.upload(
            req.files.file.path,
            (result) => {
                return res.status(200).send({
                    public_id: result.public_id,
                    url: result.url,
                });
            },
            {
                public_id: `${Date.now()}`,
                resource_type: "auto",
            }
        );
    }

    async removeImage(req, res) {
        let publicId = req.query.public_id;

        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) return res.json({ success: false, error });
            res.status(200).send("ok");
        });
    }

    async getFiles(req, res) {
        const dir = path.resolve(".") + "/uploads/";

        console.log(`check path:::`, dir);

        fs.readdir(dir, (err, items) => {
            return res.status(200).send(items);
        });
    }

    async downloadFile(req, res) {
        const file = path.resolve(".") + `/uploads/${req.params.id}`;
        res.download(file);
    }
}

module.exports = new UserController();
