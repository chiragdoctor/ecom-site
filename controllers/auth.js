const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signup = (req, res) => {
	const user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			return res.status(400).json({ err: errorHandler(err) });
		}
		user.salt = undefined;
		user.hashed_password = undefined;
		res.json({ user });
	});
};

exports.signin = (req, res, next) => {
	// find user based on email
	const { email, password } = req.body;
	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'User with that email does not exist. Please sign up.',
			});
		}
		// authenticate user from model
		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: 'Email and password dont match',
			});
		}
		// generate a signed token with user id and secret.
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
		// persisit the token in cookie.
		res.cookie('t', token);
		const { _id, name, email, role } = user;
		//return respose with user and toekn to frontend client
		res.json({ token, user: { _id, name, email, role } });
	});
};

exports.signout = (req, res) => {
	res.clearCookie('t');
	res.json({
		message: 'Signout success',
	});
};

exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'auth',
});

exports.isAuth = (req, res, next) => {
	const user = req.profile && req.auth && req.profile._id == req.auth._id;
	if (!user) {
		return res.status(403).json({
			error: 'Access Denied!!',
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: 'Admin resource. Access Denied!!',
		});
	}
	next();
};
