const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' });
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const { sendEmailWithNodemailer } = require('../helpers/email');

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    User.findOne({ email }).exec((err, user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is taken',
            });
        }

        const token = jwt.sign(
            { name, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: '10m' }
        );

        const emailData = {
            from: 'jose.rodriguez.dharma.bum@gmail.com',
            to: email,
            subject: 'ACCOUNT ACTIVATION LINK',
            html: `
                <h1>Please use the following link to activate your account</h1>
                <p>http://localhost:3000/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>http://localhost:3000</p>
            `,
        };

        sendEmailWithNodemailer(req, res, emailData);
    });
};

exports.accountActivation = (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
            err,
            decoded
        ) {
            if (err) {
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again',
                });
            }
            const { name, email, password } = jwt.decode(token);
            const user = new User({ name, email, password });
            user.save((err, user) => {
                if (err) {
                    console.log('Save user in account activation error', err);
                    return res.status(401).json({
                        error:
                            'Error saving user in database. Try signing up again.',
                    });
                }
                return res.json({
                    message: 'Signup success. Please signin',
                });
            });
        });
    } else {
        return res.json({
            message: 'Something went wrong. Try again.',
        });
    }
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please sign up',
            });
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Email and password do not match',
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        const { _id, name, email, role } = user;

        return res.json({
            token,
            user: { _id, name, email, role },
        });
    });
};
