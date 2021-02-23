const express = require('express');
const app = express();
const mongoose  = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// middlewares
app.use(express.json());



// DB
mongoose.connect(process.env.DB_CONN, 
    { 
        useNewUrlParser: true, useUnifiedTopology: true }, () => {
        console.log('DB connected');
    }
);

// importing routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(process.env.PORT || 8081, () => console.log(`Server running`));