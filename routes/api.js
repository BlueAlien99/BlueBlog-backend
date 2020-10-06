const express = require('express');
const router = express.Router();

const auth = require('./api/auth');
router.use('/auth', auth);

const blog = require('./api/blog');
router.use('/blog', blog);

router.get('/', (req, res) => res.send('this is api'));

module.exports = router;