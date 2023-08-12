const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const router = express.Router()

const User = require("../models/User")

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" })
    }

    // Create a new user
    const newUser = new User({ email, password: password })
    await newUser.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ error: "An error occurred while registering user" })
  }
})

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate a JWT token
    const token = jwt.sign({ sub: user._id }, "your_secret_key")

    res.json({ message: "Login successful", token })
  } catch (error) {
    console.error("Error logging in:", error)
    res.status(500).json({ error: "An error occurred while logging in" })
  }
})

module.exports = router
