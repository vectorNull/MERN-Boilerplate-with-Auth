const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
            max: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        salt: String,
        role: {
            type: String,
            default: 'subscriber',
        },
        resetPasswordLink: {
            data: String,
            default: '',
        },
    },
    { timestamps: true }
);

UserSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptedPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptedPassword(plainText) === this.hashedPassword;
    },

    encryptedPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    },
};

module.exports = mongoose.model('User', UserSchema);