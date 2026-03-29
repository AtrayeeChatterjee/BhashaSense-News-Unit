const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 1. SETUP / SIGNUP (Modified to hash password)
router.post("/setup", async (req, res) => {
    try {
        const { email, password, ...rest } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            email, 
            password: hashedPassword, 
            ...rest 
        });

        const savedUser = await newUser.save();
        
        // Create token so they are logged in immediately after setup
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({ token, user: savedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. LOGIN ROUTE 
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error: "Guru doesn't recognize this email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials." });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. GET CURRENT USER (For persistence on refresh)
router.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

// 4. UPDATE USER
router.put("/update/:id", async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. TRACK ENGAGEMENT
router.post("/track-engagement", async (req, res) => {
    try {
        const { userId, topic } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { likedTopics: topic } },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ 
            success: true, 
            message: `Guru is learning! You now like: ${topic}`,
            allLiked: user.likedTopics 
        });
    } catch (error) {
        res.status(500).json({ error: "Could not track engagement" });
    }
});

module.exports = router;