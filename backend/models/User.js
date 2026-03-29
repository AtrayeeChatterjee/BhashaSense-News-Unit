const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
   
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    
    occupation: { type: String, default: "Professional" },
    location: { type: String, default: "India" },
    goals: { type: String, default: "Career Growth & Knowledge" },
    interests: { type: [String], default: ["Business", "Technology"] },
    preferredLanguage: { type: String, default: "English" }, 
    likedTopics: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);