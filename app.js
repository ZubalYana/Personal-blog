const express = require('express')
const PORT = 3000;
const path = require('path')
const app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res)=>{
    res.sendFile(__dirname, 'public', 'index.html')
})
app.listen(PORT, ()=>{
    console.log(`Server works on PORT: ${PORT}`)
})