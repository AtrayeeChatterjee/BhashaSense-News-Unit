require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 1. IMPROVED CORS (The Security Guard)
// This explicitly allows your React app to communicate with this Node server
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));

app.use(express.json());

// 2. ROUTE IMPORTS
const newsRoutes = require('./routes/news');
const chatRoutes = require('./routes/chat');
const userRoutes = require("./routes/user");

// 3. DATABASE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/bhashasense')
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch(err => {
        console.error("Could not connect successfully");
        console.error(err.message);
    });

// 4. API ENDPOINTS

app.use("/api/users", userRoutes); 
app.use("/api/news", newsRoutes);
app.use("/api/chat", chatRoutes);

// Root Route for testing
app.get("/", (req, res) => {
    res.send("I am root, your BhashaSense API is live!");
});

// 5. SERVER START
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is listening to port ${PORT}`);
});