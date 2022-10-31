const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  handleValidationErrors
];


router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;

    const existEmail = await User.findOne({where: {email}});
    if (existEmail) {
    res.status(403)
    return res.json({
      message: "User already exists",
      statusCode: 403,
      errors: "User with that email already exists"
    })
    }

    const existUsername = await User.findOne({where: {username}});
    if (existUsername) {
      res.status(403)
      return res.json({
      message: "User already exists",
      statusCode: 403,
      errors: "User with that username already exists"
    })
    }

    const user = await User.create({ firstName, lastName, email, username, hashedPassword: password });


    let token = await setTokenCookie(res, user);

    return res.json({
      id: user.id,
      firstName,
      lastName,
      email,
      username,
      token
    });
  }
);


module.exports = router;
