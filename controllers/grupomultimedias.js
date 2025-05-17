const { response } = require("express");
const { GrupoMultimedia } = require("../models");
const { now } = require("mongoose");

const obtenerGrupoMultimedias = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  try {
    const [total, grupomultimedias] = await Promise.all([
      GrupoMultimedia.countDocuments(query),
      GrupoMultimedia.find(query)
        .populate("usuario", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: grupomultimedias });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;

  console.log(id)

  try {
    const grupomultimedia = await GrupoMultimedia.findById(id).populate(
      "usuario",
      "nombre"
    );

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const crearGrupoMultimedia = async (req, res = response) => {
  const { estado, usuario, ...body } = req.body;

  body.nombre = body.nombre.toUpperCase();

  try {
    //Verifica si la categoria existe
    const grupomultimediaDB = await GrupoMultimedia.findOne({
      nombre: body.nombre,
    });

    if (grupomultimediaDB) {
      return res.status(400).json({
        msg: `El grupomultimedia ${body.nombre}, ya existe`,
      });
    }

    //Pasa a mayuscula el dato de la categoria
    const nombre = req.body.nombre.toUpperCase();

    // Generar la data a guardar
    const data = {
      nombre,
      usuario: req.usuario._id,
      fecha_actualizacion: null,
    };

    const grupomultimedia = new GrupoMultimedia(data);

    // Guardar DB
    await grupomultimedia.save();

    res.status(201).json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const actualizarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  try {
    //Verifica el cambio de Grupo Categoria
    if (data.nombre) {
      data.nombre = data.nombre.toUpperCase();

      //Verifica si la categoria existe
      const grupomultimediaDB = await GrupoMultimedia.findOne({
        nombre: data.nombre,
      });

      if (grupomultimediaDB) {
        return res.status(400).json({
          msg: `La categoria ${data.nombre}, ya existe`,
        });
      }
    }

    data.usuario = req.usuario._id;
    data.fecha_actualizacion = now();

    const grupomultimedia = await GrupoMultimedia.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json({ Ok: true, resp: grupomultimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const borrarGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  try {
    const grupomultimediaBorrada = await GrupoMultimedia.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );

    res.json({ Ok: true, resp: grupomultimediaBorrada });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  crearGrupoMultimedia,
  obtenerGrupoMultimedias,
  obtenerGrupoMultimedia,
  actualizarGrupoMultimedia,
  borrarGrupoMultimedia,
};
