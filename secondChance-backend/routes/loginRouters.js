const express = require('express')
const router = express.Router()
const connectToDatabase = require('../models/db')
const logger = require('../logger')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const JWT_SECRET = process.env.JWT_SECRET

router.post('/', async (req, res) => {
  console.log('🚀 ~ req', req.body)
  try {
    // Task 1: Connect to `secondChance` in MongoDB through `connectToDatabase` in `db.js`.
    const db = await connectToDatabase()
    // Task 2: Access MongoDB `users` collection
    const collection = db.collection('users')
    // Task 3: Check for user credentials in database
    const theUser = await collection.findOne({ email: req.body.email })

    if (theUser) {
      const result = await bcryptjs.compare(req.body.password, theUser.password)
      console.log('🚀 ~ result', result)

      if (!result) {
        logger.error('Passwords do not match')

        return res.status(404).json({ error: 'Wrong pasword' })
      }
      // continue other tasks
    }
    // Task 4: Check if the password matches the encrypted password and send appropriate message on mismatch
    // Task 5: Fetch user details from a database

    const userName = theUser?.firstName
    const userEmail = theUser.email
    console.log('🚀 ~ userName', userName)
    console.log('🚀 ~ userEmail', userEmail)

    const payload = {
      user: {
        id: theUser._id.toString()
      }
    }
    const authtoken = jwt.sign(payload, JWT_SECRET)

    // Task 6: Create JWT authentication if passwords match with user._id as payload
    res.json({ authtoken, userName, userEmail })
    // Task 7: Send appropriate message if the user is not found
  } catch (e) {
    console.log('🚀 ~ e', e)
    return res.status(500).send('Internal server error')
  }
})

module.exports = router
