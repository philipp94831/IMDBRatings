var express = require('express');
var router = express.Router();
var controller = require('../controllers/partials');

router.get('/:partial/:view', controller.get_partial);

module.exports = router;