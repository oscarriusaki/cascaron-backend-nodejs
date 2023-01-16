const { Router } = require('express');
const { login, validarToken } = require('../controller/login');
const { UploadDate, UploadFile } = require('../middlewares/UploadFile');
const { validar } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();

router.post('/',[
    UploadDate,
    validar
], login)
router.get('/validar',[
    validarJWT,
    UploadDate,
    validar
], validarToken)

module.exports = router;

