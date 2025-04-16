const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const connectToDatabase = require("../models/db");
const logger = require("../logger");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");

    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      logger.error("Email id already exists");
      return res.status(400).json({ error: "Email id already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);

    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });

    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };

    const authtoken = jwt.sign(payload, JWT_SECRET);
    console.log("🚀 ~ authtoken", authtoken);

    logger.info("User registered successfully");
    res.json({ authtoken, email });
    // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
    // Task 2: Access MongoDB `users` collection
    // Task 3: Check if user credentials already exists in the database and throw an error if they do
    // Task 4: Create a hash to encrypt the password so that it is not readable in the database
    // Task 5: Insert the user into the database
    // Task 6: Create JWT authentication if passwords match with user._id as payload
    // Task 7: Log the successful registration using the logger
    // Task 8: Return the user email and the token as a JSON
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
