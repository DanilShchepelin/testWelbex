const {Router} = require('express');
const { getUser, getNotes, createNote, updateNote, deleteNote } = require('../controllers/notes');

const router = Router();

router.post('/login', getUser);
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
