const _ = require('lodash');
const formadible = require('formidable');
const fs = require('fs');

const { errorHandler } = require('../helpers/dbErrorHandler');
const Product = require('../models/product');

exports.productById = (req, res, next, id) => {
	Product.findById(id).exec((err, product) => {
		if (err || !product) {
			return res.status(400).json({
				error: 'Product not found',
			});
		}
		req.product = product;
		next();
	});
};

exports.read = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

exports.remove = (req, res) => {
	let product = req.product;
	product.remove((err, deletedProduct) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err),
			});
		}
		res.json({
			message: 'Product deleted successfully',
		});
	});
};

exports.update = (req, res) => {
	let form = formadible.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not be uploaded',
			});
		}

		const { name, description, price, category, quantity, shipping } = fields;
		if (!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
				error: 'All fields are mandatory',
			});
		}

		let product = req.product;
		product = _.extend(product, fields);

		if (files.photo) {
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size',
				});
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}

		product.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(result);
		});
	});
};

exports.create = (req, res) => {
	let form = formadible.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Image could not be uploaded',
			});
		}

		// check all fields
		const { name, description, price, category, quantity, shipping } = fields;
		if (!name || !description || !price || !category || !quantity || !shipping) {
			return res.status(400).json({
				error: 'All fields are mandatory',
			});
		}

		let product = new Product(fields);

		if (files.photo) {
			if (files.photo.size > 1000000) {
				return res.status(400).json({
					error: 'Image should be less than 1mb in size',
				});
			}
			product.photo.data = fs.readFileSync(files.photo.path);
			product.photo.contentType = files.photo.type;
		}

		product.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err),
				});
			}
			res.json(result);
		});
	});
};

exports.list = (req, res) => {
	const order = req.query.order ? req.query.order : 'asc';
	const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
	const limit = req.query.limit ? parseInt(req.query.limit) : 6;

	Product.find()
		.populate('category')
		.select('-photo')
		.sort([[sortBy, order]])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: 'Products not found',
				});
			}
			res.json(products);
		});
};

exports.listRelated = (req, res) => {
	const limit = req.query.limit ? parseInt(req.query.limit) : 6;

	Product.find({ _id: { $ne: req.product }, category: req.product.category })
		.limit(limit)
		.populate('category', '_id name')
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: 'Products not found',
				});
			}
			res.json(products);
		});
};
