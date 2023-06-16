const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHbs = require("express-handlebars");
const errorController = require("./controllers/errorControllers");
const app = express();
// app.engine(
//     "hbs",
//     expressHbs({
//         defaultLayout: "main-layout",
//         extname: "hbs",
//     })
// );
// app.set("view engine", "hbs");
// app.set("view engine", "pug");
app.set("view engine", "ejs");

app.set("views", "views");

const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
