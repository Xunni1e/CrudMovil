const { response, request } = require("express");

const { Usuario } = require("../models");

const bcryptjs = require("bcryptjs");
const { now } = require("mongoose");

const { generarJWT } = require("../helpers/generar-jwt");

const usuariosPost = async (req, res = response) => {
  const body = req.body;
  //const { nombre, correo, password, rol } = req.body;

  const usuario = new Usuario(body);

  //const usuario = new Usuario( nombre, correo, password, rol );

  //Verfificar el email

  const existeEmail = await Usuario.findOne({ correo: usuario.correo });
  if (existeEmail) {
    return res.status(400).json({
      msg: "El correo ya esta registrado...",
    });
  }

  try {
    //Encryptar la constraseña
    const salt = bcryptjs.genSaltSync();
    //let unpassword = usuario.password;
    usuario.password = bcryptjs.hashSync(usuario.password, salt);

    //Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      msg: "Created ok",
      usuario,
      token,
    });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const usuariosGet = async (req = request, res = response) => {
  //const { q, nombre = "No name", apikey, page = 1, limit } = req.query;

  const { limite = 5, desde = 0 } = req.query;

  //const query = { estado: true };
  const query = {};

  /*
  const usuarios = await Usuario.find(query)
     .skip(Number(desde))
     .limit(Number(limite));

  const total = await Usuario.countDocuments(query);   
  */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      //.populate("rol", "rol")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuarioGet = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(400).json({
        Ok: false,
        resp: `El Usuario ${id}, no existe`,
      });
    }

    res.json({
      ok: true,
      msg: "User ok",
      usuario,
    });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //const { estado, usuario, ...data } = req.body;

  try {
    if (password) {
      //Encryptar la constraseña
      const salt = bcryptjs.genSaltSync();
      //let unpassword = usuario.password;
      resto.password = bcryptjs.hashSync(password, salt);
    }

    /*
    if (data.rol) {
      if (isValidObjectId(data.rol)) {
        const existeRole = await Role.findById(data.rol);

        if (!existeRole) {
          return res
            .status(400)
            .json({
              Ok1: false,
              resp: `El Role ${data.rol}, no existe`,
            });
        }
      }
      else{
        return res
        .status(400)
        .json({
          Ok2: false,
          resp: `El Role ${data.rol}, no es un MongoBDId`,
        });        
       
      }     
    }
    */

    resto.fecha_actualizacion = now();
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json({
      ok: true,
      msg: "Update ok",
      usuario,
    });
  } catch (error) {
    res.json({ Ok3: false, resp: error });
  }
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  //Borrado Fisico
  //const usuario = await Usuario.findByIdAndDelete(id);
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );

    res.json({
      usuario,
    });

    res.json({
      ok: true,
      msg: "Delete ok",
      usuario,
    });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuarioGet
};
