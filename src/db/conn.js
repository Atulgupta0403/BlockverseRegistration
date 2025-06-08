const mongoose = require("mongoose");
require("dotenv").config();
const conn_str = process.env.URI

mongoose.set("strictQuery", true);

mongoose.connect(conn_str).then(() => console.log("DB connection successfull")).catch((error) => {
    console.log("Error in connection");
});

mongoose.connection.on('error', err => {
    console.log(err)
});
