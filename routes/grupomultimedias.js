const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearGrupoMultimedia,
        obtenerGrupoMultimedias,
        obtenerGrupoMultimedia,
        actualizarGrupoMultimedia, 
        borrarGrupoMultimedia } = require('../controllers/grupomultimedias');
const { existeGrupoMultimediaPorId } = require('../helpers/db-validators');

const router = Router();


/**
 * {{url}}/api/GrupoMultimedias
 */

//  Obtener todas las GrupoMultimedias - publico
router.get('/', obtenerGrupoMultimedias );


// Obtener una GrupoMultimedia por id - publico
router.get('/:id',[
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
], obtenerGrupoMultimedia );

// Crear GrupoMultimedia - privado - cualquier persona con un token válido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearGrupoMultimedia );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    validarJWT,
    //check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos
],actualizarGrupoMultimedia );

// Borrar una GrupoMultimedia - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeGrupoMultimediaPorId ),
    validarCampos,
],borrarGrupoMultimedia);



module.exports = router;