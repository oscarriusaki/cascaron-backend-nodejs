const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/user');

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.put('/', putUser);
router.delete('/', deleteUser);

module.exports = router;
