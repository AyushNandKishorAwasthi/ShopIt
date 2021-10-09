// const dotenv = require('dotenv');
const mongoConnect = require('./config/database');
const cloudinary = require('cloudinary');
if(process.env.NODE_ENV!=='PRODUCTION'){
  require('dotenv').config({ path: './backend/config/config.env' });
}
mongoConnect();
process.on('uncaughtException', (err) => {
  console.log('UncaughtException Shutting Down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
const app = require('./app');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_APISECRET,
});
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
});
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
