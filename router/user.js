const { Router } = require('express');
const { getUsers, getUser, postUser, putUser, deleteUser } = require('../controller/user');
const { UploadDate } = require('../middlewares/UploadFile');
const { validar } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/',[
    UploadDate,
    validar
], postUser);
router.put('/', [
    validarJWT,
    validar
], putUser);
router.delete('/',[
    validarJWT,
    validar
], deleteUser);

module.exports = router;
