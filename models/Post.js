const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    hashtags: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
