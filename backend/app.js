const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const bodyparser = require('body-parser');

const app = express();
const errorMiddleware = require('./middlewares/error');
const paymentRouter = require('./routes/paymentRouter');
const productRouter = require('./routes/productRouter');
const userRouter = require('./routes/userRouter');
const orderRouter = require('./routes/orderRouter');
app.use(cookieParser());

// app.use(express.json({ limit: '10kB' }));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(bodyparser.urlencoded({ extended: true, limit: '10kb' }));
app.use(fileUpload());

if (process.env.NODE_ENV!=='PRODUCTION') {
  app.use(morgan('dev'));
}
//mounting router
app.use('/api/v1', userRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', paymentRouter);
app.use('/api/v1', productRouter);
app.use(errorMiddleware);
if(process.env.NODE_ENV !=='PRODUCTION'){
  require('dotenv').dotenv.config({ path: './backend/config/config.env' });
}

if(process.env.NODE_ENV==='PRODUCTION')
{
  app.use(express.static(path.join(__dirname,'../frontend/build')));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'));
  })
}

module.exports = app;
