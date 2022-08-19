const {Router} = require('express');
const users = require('./users');

const router = Router();

router.use('/auth', users);

module.exports = router;