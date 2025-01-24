const mongoose = require("mongoose");
const mongoDBURI = process.env.MONGOURL;

const connectToMongo = async () => {
  try {
    const connect = await mongoose.connect(mongoDBURI);
    console.log("Connected to mongoDB successfully", connect.connection.host, connect.connection.name);
  } catch (err) {
    console.log({ error: err, message: "Connection to mongoDB failed" });
    process.exit(1);
  }
};

module.exports = connectToMongo;