const { Router } = require('express');
const { getHero, getHeros, postHero, putHero, deleteHero, getImage, getHeroByPublisher, getHeroById, getHeroByName } = require('../controller/hero');
const { UploadFile } = require('../middlewares/UploadFile');
const { validar } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJWT');

const router = Router();
router.get('/', getHeros);
router.get('/:id', getHero);
router.get('/img/:id', getImage)
router.get('/publisher/:id', getHeroByPublisher)
router.get('/id/:id', getHeroById)
router.get('/name/:id', getHeroByName)
router.post('/',[
    validarJWT,
    UploadFile,
    validar
], postHero);
router.put('/:id',[
    validarJWT,
    validar
], putHero);
router.delete('/:id',[
    validarJWT,
    validar,
], deleteHero);

module.exports = router;