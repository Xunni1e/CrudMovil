const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { obtenerMultimediaHeroe,
        crearMultimediaHeroe,
        actualizarMultimediaHeroe, 
        obtenerMultimediasPorHeroe,
        borrarMultimediaHeroe } = require('../controllers/multimediasHeroe');
const { existeMultimediaPorId,existeHeroePorId,existeMultimediaHeroePorId } = require('../helpers/db-validators');

const router = Router();


router.get('/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaHeroePorId ),
    validarCampos
],obtenerMultimediaHeroe );

router.get('/heroe/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    //check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeMultimediaHeroePorId ),
    //validarCampos
],obtenerMultimediasPorHeroe );


// Crear Multimedia - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    //check('url','La URL obligatoria').not().isEmpty(),
    check('IdMultimedia','No es un id de Mongo').isMongoId(),
    check('IdMultimedia').custom( existeMultimediaPorId ),
    check('IdHeroe','No es un id de Mongo').isMongoId(),
    check('IdHeroe').custom( existeHeroePorId ),
    validarCampos
], crearMultimediaHeroe );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaHeroePorId ),
    validarCampos
],actualizarMultimediaHeroe );

// Borrar una Multimedia - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaHeroePorId ),
    validarCampos,
],borrarMultimediaHeroe);


module.exports = router;