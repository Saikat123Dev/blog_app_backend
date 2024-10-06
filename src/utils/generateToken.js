// utils/generateToken.js
const jwt = require("jsonwebtoken");

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET); // Optional: Set expiration time
};

module.exports = generateToken; // Export the function directly
