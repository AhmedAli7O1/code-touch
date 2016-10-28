var express = require('express');
var passport = require('passport');
var User = require('../models').User;
var verify = require('./verify');
var multer = require('multer');
var router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './build/images/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + "-" + datetimestamp + "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]);
    }
});

var upload = multer({ storage: storage }).single('file');

// get all users 
router.get('/', verify.admin, function (req, res, next) {
	User.find({}, function (err, users) {
		if (err) {
            return next(err);
        }
        else {
            res.json({
				state: true,
				data: users
			});
        }
	});
});

router.post('/register/pic', function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			console.log(err);
			return res.status(500).json({
				state: false,
				error: err
			});
		}

		var pic = req.file.filename;

		register(req, res, pic); // register user with given profile picture

	});

});

// register new users
router.post('/register', function (req, res) {

	register(req, res); // register user without picture 'use default'

});

function register(req, res, userPicture) {

	User.register(
		new User({ username: req.body.username }),
		req.body.password,
		function (err, user) {
			if (err) {
				return res.status(500).json({
					state: false,
					error: err.name,
					message: err.message
				});
			}

			user.firstname = req.body.firstname;
			user.lastname = req.body.lastname;
			if (userPicture) {
				user.imageUrl = "images/" + userPicture;
			}
				
			user.save(function (err, user) {
				passport.authenticate('local')(req, res, function () {
					return res.json({
						state: true,
						message: 'Registration Successful!'
					});
				});
			});

		}
	);
}

// login user account
router.post('/login', function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return res.status(401).json({
				state: false,
				error: err,
				message: err.message
			});
		}
		if (!user) {
			if (info.name === 'IncorrectUsernameError') {
                res.status(401).json({
                    state: false,
                    error: 'user_not_found',
                    message: 'Incorrect Username'
                });
            }
            else if (info.name === 'IncorrectPasswordError') {
                res.status(401).json({
                    state: false,
                    error: 'invalid_password',
                    message: 'Incorrect Password'
                });
            }
            else {
                res.status(401).json({
                    state: false,
                    error: err,
					message: info.message
                });
            }
            return;
		}

		// login the user
		req.logIn(user, function (err) {
			if (err) {
				err.status = 500;
				return next(error);
			}

			// get token and send it
			var token = verify.getToken({
				username: user.username,
				_id: user._id,
				admin: user.admin
			});

			res.json({
				state: true,
				token: token,
				userData: {
					id: user._id,
					firstName: user.firstname,
					lastName: user.lastname,
					imageUrl: user.imageUrl,
					isAdmin: user.admin
				}
			});

		});
	})(req, res, next);

});

router.get('/login/google', passport.authenticate('google', { scope: 'openid profile' }));

router.get('/login/google/callback', function (req, res, next) {

	passport.authenticate('google', function (err, user, info) {

		if (err) {
			return res.status(500).json({ error: err });
		}

		if(!user) {
			return res.status(401).json({ error: info });
		}

		req.logIn(user, function (err) {
			if (err) {
				return res.status(500).json({ error: 'could not log in!' });
			}
			
			// get token and send it
			var token = verify.getToken({
				username: user.username,
				_id: user._id
			});
			
			res.redirect('/#/login/success?token=' + token);

		});

	})(req, res, next);

});

// logout
router.get('/logout', verify.user, function (req, res) {
	req.logOut();
	res.json({
		state: true,
		message: 'logged out succesfully'
    });
});

// verify that incoming token is valid
router.get('/token', verify.token);

// get current user 'owner of this token' info
router.get('/current', verify.user, function (req, res) {
	res.status(200).json({
		userData: req.userData
	});
});

// verify that guest can register with this email
router.get('/validate-email/:email', function (req, res) {

	var email = req.params.email;

	User.findOne({ username: email }, function (err, user) {
		if (user) {
			return res.status(406).json({ error: 'user-exist', message: 'invalid email, already taken!' });
		}
		return res.status(200).json({ message: 'valid email' });
	});

});

module.exports = router;