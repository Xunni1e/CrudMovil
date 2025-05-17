const jwt = require('jsonwebtoken');
const { request, response } = require("express");
const Usuario = require('../models/mongoUsuario.model')


const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: ' No hay token en la peticion...'
        })
    }

    try {
        //Valida el token
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //console.log(uid);
        const usuario = await Usuario.findById(uid)

        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            })

        }

        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado: false'
            })

        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: ' El token no es valido...'
        })

    }


    //console.log(token);

    //next();
}


module.exports = {
    validarJWT
}