const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearMultimedia,
        obtenerMultimedias,
        obtenerMultimedia,
        obtenerMultimediasXGrupoMultimedia,
        obtenerMultimediasXIdHeroe,
        obtenerFotosXIdHeroe,
        actualizarMultimedia, 
        borrarMultimedia } = require('../controllers/multimedias');
const { existeMultimediaPorId, existeGrupoMultimediaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/Multimedias
 */

//  Obtener todas las Multimedias - publico
router.get('/', obtenerMultimedias );


// Obtener una Multimedia por id - publico
router.get('/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos,
], obtenerMultimedia );

router.get('/grupomultimedia/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerMultimediasXGrupoMultimedia );




router.get('/heroe/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerMultimediasXIdHeroe);

router.get('/fotos/:id',[
    check('id', 'No es un id de Mongo válido').isMongoId(),
    //check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerFotosXIdHeroe);


// Crear Multimedia - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('url','La URL obligatoria').not().isEmpty(),
    check('IdGrupoMultimedia','No es un id de Mongo').isMongoId(),
    check('IdGrupoMultimedia').custom( existeGrupoMultimediaPorId ),
    validarCampos
], crearMultimedia );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    //validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos
],actualizarMultimedia );

// Borrar una Multimedia - Admin
router.delete('/:id',[
    //validarJWT,
    //esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeMultimediaPorId ),
    validarCampos,
],borrarMultimedia);



module.exports = router;