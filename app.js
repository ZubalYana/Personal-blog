const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const env = require('dotenv').config()
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your_jwt_secret';
const multer = require('multer');
const Post = require('./models/Post')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
mongoose.connect(`mongodb+srv://zubalana0:${process.env.password}@cluster0.z7w5ka9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{
    console.log(`Connected to mongo DB`)
})

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileDescription: { type: String },
    placesVisited: { type: String },
    placesToVisit: { type: String },
    profilePicture: { type: String },
    followers: { type: [String], default: [] },
    followings: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//user registraion
app.post('/auth/register', upload.single('profile-pic'), async (req, res) => {
    const { firstname, lastName, email, password, profileDescription, placesVisited, placesToVisit } = req.body;
    const profilePicture = req.file ? `uploads/${req.file.filename}` : null; // Ensure the path is correctly set
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstname,
            lastName,
            email,
            profileDescription,
            placesVisited,
            placesToVisit,
            password: hashedPassword,
            profilePicture
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error saving user:', error); 
        res.status(400).json({ message: error.message || 'User already exists or other error' });
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
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '72h' });
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

//middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

//get the user info
app.get('/auth/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'An error occurred while fetching user data' });
    }
});

//get all the user's posts
app.get('/api/userPosts', authMiddleware, async (req, res) => {
    try {
        const userPosts = await Post.find({ author: req.userId }).populate('author', 'firstname lastName profilePicture');
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json({ message: 'Error when getting user posts', error: err.message });
    }
});

//post creation
app.post('/api/posts', authMiddleware, upload.single('post-pic'), async (req, res) => {
    try {
        const { title, body, hashtags } = req.body;
        const pic = req.file ? req.file.path : null;
        
        const newPost = new Post({
            title,
            body,
            pic,
            hashtags,
            author: req.userId
        });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Post creation failed', error: err.message });
    }
});

//get all the posts
app.get('/api/getPosts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'firstname lastName profilePicture');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Error when getting posts', error: err.message });
    }
});

//get all the user
app.get('/api/getUser', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error when getting users:', err);
        res.status(500).json({ message: 'Error when getting users', error: err.message });
    }
});

//edit user
app.post('/auth/user/update', authMiddleware, upload.single('profilePicture'), async (req, res) => {
    try {
        const updates = {
            firstname: req.body.firstname,
            lastName: req.body.lastName,
            email: req.body.email,
            profileDescription: req.body.profileDescription,
            placesVisited: req.body.placesVisited,
            placesToVisit: req.body.placesToVisit
        };

        if (req.file) {
            updates.profilePicture = `uploads/${req.file.filename}`;
        }

        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'An error occurred while updating user data' });
    }
});

//get a specific post by ID
app.get('/api/userPosts/:id', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId).populate('author', 'firstname lastName profilePicture');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post data:', error);
        res.status(500).json({ message: 'An error occurred while fetching post data' });
    }
});

//edit post
app.post('/api/userPosts/:id', authMiddleware, upload.single('postPicture'), async (req, res) => {
    const postId = req.params.id;
    const updates = {
        title: req.body.title,
        body: req.body.body,
        hashtags: req.body.hashtags
    };
    if (req.file) {
        updates.pic = `uploads/${req.file.filename}`;
    }
    try {
        const post = await Post.findByIdAndUpdate(postId, updates, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Error updating post data:', error);
        res.status(500).json({ message: 'An error occurred while updating post data' });
    }
});

//auth
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

//main
app.get('/', (req, res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})

//user
app.get('/user', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

//logout
app.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

//post deleting
app.delete('/api/deletePost/:id', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the post', error: error.message });
    }
});

//user deleting
app.delete('/api/deleteUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        await User.findByIdAndDelete(user);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the user', error: error.message });
    }
});

//post deleting (admin)
app.delete('/api/deletePostAdmin/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this post' });
        }
        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while deleting the post', error: error.message });
    }
});
//admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})