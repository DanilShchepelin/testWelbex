const {Router} = require('express');
const notes = require('./notes');

const router = Router();

router.use('/notes', notes);

module.exports = router;