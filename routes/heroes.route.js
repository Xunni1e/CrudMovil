const { Router } = require('express');

const { heroesGet, 
        heroeIdGet,
        heroesComoGet,
        heroesPost,
        heroePut,
        heroeDelete,
    //pruebaPost,
    //pruebaPut,
    //pruebaDelete,
    //pruebaPatch 
} = require('../controllers/heroes.controller');

const router = Router();

router.get('/', heroesGet);

router.get('/:id', heroeIdGet);

router.get('/como/:termino', heroesComoGet);

//Para insertar un Heroe en la BD
router.post('/', heroesPost);

//Para modificar un Heroe en la BD
router.put('/:id', heroePut);

//Para eliminar un Heroe de la BD
router.delete('/:id', heroeDelete);

//router.patch('/', usuariosPatch);

module.exports = router;