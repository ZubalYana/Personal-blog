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
    firstname: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    profileDescription: { type: String },
    placesVisited: { type: String },
    placesToVisit: { type: String },
});
    
const User = mongoose.model('User', userSchema);
    
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')))

//user registration
app.post('/auth/register', async (req, res) => {
    const { firstname, lastName, email, password, profileDescription, placesVisited, placesToVisit } = req.body;

    console.log('Request body:', req.body); // Log the request body for debugging

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstname,
        lastName,
        email,
        profileDescription,
        placesVisited,
        placesToVisit,
        password: hashedPassword
    });

    try {
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error saving user:', error); // Log the error
        res.status(400).json({ message: 'User already exists or other error' });
    }
});

//user log in
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const secureFlag = process.env.NODE_ENV === 'production';
        res.cookie('token', token, { httpOnly: true, secure: secureFlag });
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});


//user logout
app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
        // return res.sendFile(path.join(__dirname, 'public', 'auth.html'));
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

app.get('/', (req, res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})

app.get('/user', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})