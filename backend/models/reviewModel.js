const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
        product:{
          type:mongoose.ObjectId,
          ref:'Product'
        },
        user: {
          type: mongoose.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
})
reviewSchema.pre('find',function(next){
  this.query = this.populate({
    path:'user',
    select:'name -_id',
  });
  next();
})

module.exports = mongoose.model('Reviews',reviewSchema);