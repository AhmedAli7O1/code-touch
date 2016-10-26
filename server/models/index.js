'use strict';

var mongoose = require('mongoose');
var user = require('./user');

module.exports = {
	User: mongoose.model('User', user)
};