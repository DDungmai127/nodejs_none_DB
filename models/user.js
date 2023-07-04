const getDb = require("../util/database").getDb;
const mongodb = require("mongodb");
const { get } = require("../routes/adminRoutes");
class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }
    save() {
        const db = getDb();
        return db
            .collection("users")
            .insertOne(this)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => console.log(err));
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex((cp) => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItem = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItem[cartProductIndex].quantity = newQuantity;
        } else {
            // đoạn này là thêm product vào này
            updatedCartItem.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: newQuantity,
            });
        }
        const updatedCart = {
            items: updatedCartItem,
        };

        const db = getDb();
        return db.collection("users").updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            {
                $set: {
                    cart: updatedCart,
                },
            }
        );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then((products) => {
                const order = {
                    items: products,
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name,
                    },
                };
                return (
                    db
                        .collection("orders")
                        // thêm sản phẩm trong cart vào order
                        .insertOne(order)
                );
            })

            .then((result) => {
                // Làm rỗng cart
                this.cart = { items: [] };
                return db.collection("users").updateOne(
                    {
                        _id: new mongodb.ObjectId(this._id),
                    },
                    {
                        // update cart rỗng
                        $set: { cart: { items: [] } },
                    }
                );
            });
    }

    getOrders() {
        const db = getDb();
        return db
            .collection("orders")
            .find({ "user._id": new mongodb.ObjectId(this._id) })
            .toArray();
    }
    static findById(userId) {
        const db = getDb();
        return db
            .collection("users")
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then((user) => {
                console.log(user);
                return user;
            })
            .catch((err) => console.log(err));
    }

    getCart() {
        const db = getDb();
        const prodIds = this.cart.items.map((i) => i.productId);
        return db
            .collection("products")
            .find({
                _id: {
                    $in: prodIds,
                },
            })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i) => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity,
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter((item) => {
            return item.productId.toString() === productId.toString();
        });
        const db = getDb();
        return db.collection("users").updateOne(
            {
                _id: new mongodb.ObjectId(this._id),
            },
            {
                $set: { cart: { items: updatedCartItems } },
            }
        );
    }
}

module.exports = User;
