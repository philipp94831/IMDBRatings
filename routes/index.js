var express = require('express');
var router = express.Router();
var controller = require('../controllers/application');

/* GET home page. */
router.get('/', controller.get_index);
router.get('/search', controller.search);
router.get('/:id', controller.get);

module.exports = router;
