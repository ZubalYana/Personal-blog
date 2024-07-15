const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const PORT = 3000;
const JWT_SECRET = 'your_jwt_secret';
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})
app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})