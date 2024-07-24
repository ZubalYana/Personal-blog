const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})
const Post = mongoose.model('Post', postSchema);
module.exports = Post;