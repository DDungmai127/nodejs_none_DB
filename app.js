const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
// const expressHbs = require("express-handlebars");
const errorController = require("./controllers/errorControllers");
const { mongoConnect } = require("./util/database");

const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");

app.set("views", "views");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
    User.findById("64a40a09c567b66bad1f08de")
        .then((user) => {
            req.user = new User(user.name, user.emai, user.cart, user._id);
            next();
        })
        .catch((err) => console.log(err));
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);

mongoConnect(() => {
    app.listen(3000);
});
