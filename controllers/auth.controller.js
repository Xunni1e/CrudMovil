const { response } = require("express");

//const { Usuario} = require("../models/usuario");
const Usuario = require("../models/mongoUsuario.model");

const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

//const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });
        console.log(usuario);
        if (!usuario) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - correo: " + correo,
                });
        }

        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - estado: false",
                });
        }

        const validaPassword = bcryptjs.compareSync(password, usuario.password);
        // Verificar la contraseña

        if (!validaPassword) {
            return res
                .status(400)
                .json({
                    ok: false,
                    msg: "Usuario / Password no son correctos - password",
                });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: "Login ok",
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Hable con el Administrador...",
            error: error,
        });
    }
};


module.exports = {
    login
};