const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendResetEmail } = require('./emailService');
const crypto = require('crypto');
const fetchuser = require('../middleware/fetchuser')


const JWT_SECRET = 'NileshKumar$G'

//Route 1.: Create a user using: POST: "/api/auth/createUser". No login required.
router.post('/createUser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('dob', 'Enter your date of birth').notEmpty(),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  let success = false;

  //If there are errors, return bad request & the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }

  //Check whether the user with email already exists
  try {

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry user exist with this email !!" })
    }


    //Create a new user
    const salt = await bcrypt.genSalt(10)
    const SecPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      dob: req.body.dob,
      password: SecPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true;
    res.json({ success, authToken })
  }

  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!!");
  }

})


// ROUTE2.: Autheticate the user using: POST "/api/auth/login". Login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please try to ogin with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken })
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error!!")
  }
})

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE 4.: API for Forget User, Password: POST "/api/auth/forgetUser".

router.post('/forgetUser', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        // Set token and expiry on user model (add these fields to your model)
        user.resetPasswordToken = resetToken;
        user.resePasswordExpires = resetTokenExpiry;
        await user.save();

        // Send email with reset instructions

        await sendResetEmail(email, `Your frontend reset link with token: ${resetToken}`);

        console.log(`Reset token: ${resetToken}`);

        // res.json({resetToken});

        res.status(200).send('Password reset email sent');
    } catch (error) {
        res.status(500).send('Error in password reset process');
    }
});

module.exports = router