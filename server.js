const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
process.on('uncaughtException', (err) => {
  console.log('UncaughtException Shutting Down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
const app = require('./app');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection successfull'));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down...');
  server.close(() => {
    console.log('Process terminates.');
  });
});
