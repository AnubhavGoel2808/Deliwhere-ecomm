require("dotenv").config();
const mongoose = require("mongoose");
const  DB_URL  = process.env.DB_URL;

// let DB_URL = ;
// switch (process.env.NODE_ENV) {
//   case DEVELOPMENT:
//     DB_URL = process.env.DB_URL_DEV;
//     break;
//   case PRODUCTION:
//     DB_URL = process.env.DB_URL_PROD;
//     break;
//   case LOCAL:
//     DB_URL = process.env.DB_URL_LOC;
//     break;
//   case TEST:
//     DB_URL = process.env.DB_URL_TEST
//     break;
//   default:
//     DB_URL = process.env.DB_URL;
// }

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

function establishConnection() {
  console.log("\nEstablishing Database Connection . . . " , process.env.DB_URL);
  mongoose
    .connect("mongodb+srv://user0:user0@cluster0.mqiitp8.mongodb.net/?retryWrites=true&w=majority", options)
    .then(() => {
      console.info("\nDatabase Connection Established!");
    })
    .catch((err) => {
      console.log("\nDatabase Connection Failed!");
      console.error("Error Details: ", err);
      console.log("\n\nDatabase Connection Failed, Retrying . . .");
      establishConnection();
    });
}

establishConnection();
const db = mongoose.connection;
module.exports = db;

