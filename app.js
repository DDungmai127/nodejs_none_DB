const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/errorControllers");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);

const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");

const MONGODB_URI = "mongodb+srv://dangdung:12072003@cluster0.mdrwvlf.mongodb.net/shop";

const store = new mongoDBStore({
    uri: MONGODB_URI,
    collection: "session",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({ secret: "my secret", resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
    .connect(
        "mongodb+srv://dangdung:12072003@cluster0.mdrwvlf.mongodb.net/shop?retryWrites=true&w=majority"
    )
    .then((result) => {
        User.findOne().then((user) => {
            if (!user) {
                const user = new User({
                    name: "Max",
                    email: "max@test.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });

        app.listen(3000);
    })
    .catch((err) => console.log(err));
