// backend/routes/api/session.js
const express = require('express');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// backend/routes/api/session.js
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// ...
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];


// Log in
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        const user = await User.findOne({ where: { email: credential, hashedPassword: password } });

        if (!user) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        const token = await setTokenCookie(res, user);

        const {id, firstName, lastName, username } = user

        return res.json({
            id,
            firstName,
            lastName,
            email: credential,
            username,
            token
        });
    }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);

// Restore session user
router.get(
    '/',
    requireAuth,
    (req, res, next) => {
        const { id, firstName, lastName, email, username } = req.user;

        return res.json({
            id,
            firstName,
            lastName,
            email,
            username
        })
    }
);


module.exports = router;
