const { Order } = require('../models/order');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.listOrders = (req, res) => {
  Order.find()
    .populate('user', '_id name address')
    .sort('createdAt')
    .then((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};
