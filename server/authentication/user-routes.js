var express = require('express');
var passport = require('passport');
var User = require('../models').User;
var verify = require('./verify');
var multer = require('multer');
var router = express.Router();
var crypto = require('crypto');
var config = require('../config');

var mailjet = require ('node-mailjet')
    .connect(config.MJ_APIKEY_PUBLIC, config.MJ_APIKEY_PRIVATE);


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
			user.displayName = user.firstname + ' ' + user.lastname;
			if (userPicture) {
				user.imageUrl = "images/" + userPicture;
			}
				
			// generate email verification key and store it	
			crypto.randomBytes(30, function(err, buffer) {
				var key = buffer.toString('hex');
				user.verifyKey = key;

				// save changes made to the user into db 
				user.save((err, user) => {
					passport.authenticate('local')(req, res, function () {

						// send email verification to this user
						sendMail(user, (err) => {
							if (err) {
								console.log(err);
							}

							return res.json({
								state: true,
								message: 'Registration Successful!'
							});

						});

					});
				});

			});

		}
	);
}

router.get('/confirm/:id/:key', function (req, res) {
	var id = req.params.id;
	var key = req.params.key;

	if (!id || !key) {
		return res.redirect('/#/login/confirm?state=error&type=params');
	}

	// find user by id
	User.findOne({ _id: id })
		.exec((err, user) => {

			if (err || !user) {
				return res.redirect('/#/login/confirm?state=error&type=locate');
			}

			if (user.verifyKey !== key) {
				return res.redirect('/#/login/confirm?state=error&type=key');
			}

			user.status = 'active';
			user.save((err) => {

				if (err) {
					return res.redirect('/#/login/confirm?state=error&type=saving');
				}

				res.redirect('/#/login/confirm?state=success');

			});
			

		});

});

// send verification email to the user
function sendMail(user, cb) {

	var link = user._id + '/' + user.verifyKey;

	var sendEmail = mailjet.post('send');

	var emailData = {
		"FromEmail": "bluemaxyarkan@gmail.com",
		"FromName": "Code Touch Task",
		"Subject": "Please confirm your account at CodeTouch",
		"Html-part": '<div style="font-family: Arial;"><h1 style="color: #686868;">Code Touch Task</h1><p>Please confirm your account by clicking the following button:<a target="_blank" href="https://code-touch.herokuapp.com/users/confirm/' + link + '" style="margin-top: 20px;width: 150px;height: 30px;background: #3498DB;color: white;font-weight: 600;letter-spacing: 1px;border: none;display: block;text-decoration: none;text-align: center;padding-top: 10px;">Click</a><p>or copy this link and paste in your browser address bar</p>https://code-touch.herokuapp.com/users/confirm/' + link + '</div>',
		"Recipients": [
			{
				"Email": user.username
			}
		]
	};

	sendEmail
		.request(emailData)
		.then(() => cb())
		.catch((err) => cb(err));

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
					displayName: user.displayName,
					imageUrl: user.imageUrl,
					isAdmin: user.admin,
					status: user.status
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

	// get user data from database 
	User.findOne({ _id: req.userData.id }, function (err, user) {


	});

	User.findOne({ _id: req.userData._id })
		.exec((err, user) => {

			if (err) {
				return res.status(500).json({ error: 'error-retrieving-user', message: 'error retrieving the user!' });
			}

			if (!user) {
				return res.status(404).json({ error: 'user-not-found', message: 'user not found!' });
			}

			res.status(200).json({ 
				userData: {
					id: user._id,
					firstName: user.firstname,
					lastName: user.lastname,
					displayName: user.displayName,
					imageUrl: user.imageUrl,
					isAdmin: user.admin,
					status: user.status
				} 
			});

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