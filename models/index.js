const Server = require('./server');
const Usuario = require('./mongoUsuario.model');
//const Heroe = require('./mySqlHeroes');

const Heroe = require('./heroe.model');
const Multimedia = require('./multimedia.model');
const MultimediaHeroe = require('./multimedia_heroe.model');
const GrupoMultimedia = require('./grupomultimedia.model');

module.exports = {
    Server,
    Usuario,

    //Heroe,
    Heroe,
    Multimedia,
    MultimediaHeroe,
    GrupoMultimedia,
}