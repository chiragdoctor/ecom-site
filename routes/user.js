const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

router.get('/', (req, res) => {
	res.send('hello from node user routes');
});

module.exports = router;
