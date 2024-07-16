const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';

mongoose.connect('mongodb+srv://root:ykuBxov2UUP7OPjI@cluster0.5ebgrqy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongo connect');
    })

    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    });
    
    const User = mongoose.model('User', userSchema);
    
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})
app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})