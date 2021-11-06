const express = require('express');
const router = express.Router();

const classesController = require('./classesController');

router.get('/:id', classesController.getClass);

router.post('/', classesController.createClass);

/* GET classes listing. */
router.get('/', classesController.getClassList);

module.exports = router;
