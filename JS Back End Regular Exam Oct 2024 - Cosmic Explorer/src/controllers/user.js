const { Router } = require("express");
const { body, validationResult } = require("express-validator");

const { isGuest } = require("../middlewares/guards");
const { login, register } = require("../services/userService");
const { createToken } = require("../services/jwtService");
const { parseError } = require("../util");

const userRouter = Router();

userRouter.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

userRouter.post('/login', isGuest(),
    body('username').trim(),
    body('password').trim(),
    async (req, res) => {
        const { username, password } = req.body;

        try {
            const result = await login(username, password);
            const token = createToken(result);
            res.cookie('token', token);

            res.redirect('/');
        } catch (err) {
            res.render('login', { data: { username }, errors: parseError(err).errors });
        }
    }
);

userRouter.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

userRouter.post('/register', isGuest(),
    body('username').trim().isLength({ min: 2, max: 20 }).withMessage('Username must be between 2 and 20 characters long'),
    body('email').trim().isLength({ min: 10 }).isEmail().withMessage('Email must be at least 10 characters long'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('repass').trim().custom((value, { req }) => value == req.body.password).withMessage('Passwords don\'t match'),
    async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            const result = await register(username, email, password);
            const token = createToken(result);
            res.cookie('token', token);

            res.redirect('/');
        } catch (err) {
            res.render('register', { data: { username, email  }, errors: parseError(err).errors });
        }
    }
);

userRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = { userRouter };