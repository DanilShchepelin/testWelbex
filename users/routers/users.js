const {Router} = require('express');
const { getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

const router = Router();

router.post('/login', getUser);
router.post('/registration', createUser);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

module.exports = router;