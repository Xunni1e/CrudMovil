const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');

//const googleVerify = require('./google-verify');
//const subirArchivo = require('./subir-archivo');
const mongoVerify = require('./mongo-verify');


module.exports = {
    ...dbValidators,
    ...generarJWT,
  
    //...googleVerify,
    //...subirArchivo,
    ...mongoVerify,
}