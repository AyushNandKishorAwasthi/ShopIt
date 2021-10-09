const mongoose = require('mongoose');
const mongoConnect = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`MongoDB database connected to host ${con.connection.host}`);
    })
    .catch((err) => console.log(err));
};
module.exports = mongoConnect;
