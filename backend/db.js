const mongoose = require("mongoose");
const mogoURI = "mongodb://localhost:27017/iNotebook_data";
const connectToMongo = () => {
  mongoose.connect(mogoURI, () => {
    console.log("mongo connect successfully");
  });
};
module.exports = connectToMongo;
