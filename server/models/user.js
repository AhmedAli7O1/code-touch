'use strict';

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, lowercase: true },
    oAuthId: String,
    oAuthToken: String,
    firstname: String,
    lastname: String,
    displayName: String,
    verifyKey: String,
    imageUrl: {
        type: String,
        default: 'images/user.png'
    },
    status: {
        type: String,
        default: 'pending'
    },
    admin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

userSchema.virtual('fullName').get(function () {
    return this.firstname + ' ' + this.lastname;
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = userSchema;