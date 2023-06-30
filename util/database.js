const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("node-complete", "root", "12072003", {
    dialect: "mysql",
    host: "localhost",
});
module.exports = sequelize;
