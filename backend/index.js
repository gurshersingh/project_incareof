const express = require("express");
const config = require("config");
const app = express();

const wagner = require("wagner-core");

const sequelize = require("./utils/db/index");

wagner.factory("sequelize", () => sequelize.sequelize);

const paypal = require("paypal-rest-sdk");
paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id:
        "AXtcRsvw6uWWRCyqJJ3P1sz9LmvGmHqvuyDA1tYTcdKp0MKhTAdwF-OPQVV0eaXsqlb6sikAEiZkNANS",
    client_secret:
        "EC-ISxTd_29JnU4ALnO2N9QYZLO4TORZXJKgpS4xguCAjbdululWAESEJTDRaJdfCqtKDWzi6HOEL7Ih",
});

// Uncomment the below line to populate the database
// wagner.get("sequelize").sync({ force: true });
require("./models/index")(wagner.get("sequelize"), wagner);
require("./managers/index")(wagner);

require("./utils/express/index")(app, express);
require("./routes/index")(app, express, wagner);

app.use("/", (req, res, next) => {
    res.sendStatus(200);
});

app.listen(config.PORT, () => {
    console.log("Server is running on port " + config.PORT);
});
