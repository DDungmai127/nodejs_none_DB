const User = require("../models/user");
exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie").split("=")[1] === "true";
    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("64a52280d8c597c856f639a4")
        .then((user) => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            // cái đoạn này là một chi tiết nhỏ, với mục đích là khi nào mà session thật sự được lưu thì nó mới load lại page
            req.session.save((err) => {
                console.log(err);
                res.redirect("/");
            });
        })
        .catch((err) => console.log(err));
};
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};
