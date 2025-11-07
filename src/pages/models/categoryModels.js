const mongoose = require ('mongoose');

const categorySchema = new mongoose.Schema(
    {
   Name:{
    type: String,
    required:true,
    unique:true,
   },
    }
);
module.exports = mongoose.model('category',categorySchema);