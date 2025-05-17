const { response } = require("express");
const { Multimedia, GrupoMultimedia, MultimediaHeroe } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");

const obtenerMultimedias = async (req, res = response) => {
  const { limite = 100, desde = 0 } = req.query;
  //const query = { estado: true };
  const query = {};

  try {
    const [total, multimedias] = await Promise.all([
      Multimedia.countDocuments(query),
      Multimedia.find(query)
        .populate("usuario", "nombre")
        .populate("IdGrupoMultimedia", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: multimedias });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerMultimedia = async (req, res = response) => {
  const { id } = req.params;

  try {
    const multimedia = await Multimedia.findById(id)
      .populate("usuario", "nombre")
      .populate("IdGrupoMultimedia", "nombre");

      res.json({ Ok: true, resp: multimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};


const obtenerMultimediasXGrupoMultimedia = async (req, res = response) => {
  const { id } = req.params;
  //const { limite = 5, desde = 0 } = req.query;
  const query = { IdGrupoMultimedia: id, estado: true };

  try {
    const [total, multimedias] = await Promise.all([
      Multimedia.countDocuments(query),
      Multimedia.find(query)
        .populate("usuario", "nombre")
        .populate("IdGrupoMultimedia", "nombre")
        //.skip(Number(desde))
        //.limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: multimedias });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerMultimediasXIdHeroe = async (req, res = response) => {
  const { id } = req.params;
  //const { limite = 5, desde = 0 } = req.query;
  const query = { IdHeroe: id};
  //const query = {};

  try {

    const [total, multimediasheroe] = await Promise.all([
      MultimediaHeroe.countDocuments(query),
      MultimediaHeroe.find(query)
        //.populate("usuario", "nombre")
        .populate("IdHeroe", "nombre")
        .populate("IdMultimedia", "url")
        //.skip(Number(desde))
        //.limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: multimediasheroe });
  } catch (error) {
    console.log(error);
    res.json({ Ok: false, resp: error });
  }
};


const obtenerFotosXIdHeroe = async (req, res = response) => {
  const { id } = req.params;
  //const { limite = 5, desde = 0 } = req.query;
  const query = { IdHeroe: id};
  //const query = {};

  try {

    const [total, multimediasheroe] = await Promise.all([
      MultimediaHeroe.countDocuments(query),
      MultimediaHeroe.find(query)
        //.populate("usuario", "nombre")
        .populate("IdHeroe", "nombre")
        .populate("IdMultimedia", "url")
        //.skip(Number(desde))
        //.limit(Number(limite)),
    ]);

    let fotos = [];

     for (i=0; i < multimediasheroe.length; i++){
      
      let dato = { _id: multimediasheroe[i].IdMultimedia._id,
                   IdHeroe: multimediasheroe[i].IdHeroe._id,
                   url: multimediasheroe[i].IdMultimedia.url}
      
      //console.log(multimediasheroe[i].IdHeroe); 
      //console.log(multimediasheroe[i].IdMultimedia); 
                   
      fotos.push(dato);
      
    }
 
    console.log(fotos); 

    res.json({ Ok: true, total: total, resp: fotos });
  } catch (error) {
    console.log(error);
    res.json({ Ok: false, resp: error });
  }
};


const crearMultimedia = async (req, res = response) => {
  const { estado, ...body } = req.body;

  try {
    const multimediaDB = await Multimedia.findOne({ url: body.url });

    if (multimediaDB) {
      return res.status(400).json({
        msg: `El URL de la multimedia ${body.url}, ya existe`,
      });
    }

    // Generar la data a guardar
    const data = {
      ...body,
      usuario: req.usuario._id,
    };

    const multimedia = new Multimedia(data);

    // Guardar DB
    await multimedia.save();

    res.status(201).json({ Ok: true, resp: multimedia });
  } catch (error) {
    console.log(error)
    res.json({ Ok: false, resp: error });
  }
};

const actualizarMultimedia = async (req, res = response) => {
  const { id } = req.params;
  //const { estado, usuario, ...data } = req.body;
  const { ...data } = req.body;

  try {
    //Verifica que la URL existe
    const multimediaDB = await Multimedia.findOne({ url: data.url });

    if (multimediaDB) {
      return res.status(400).json({
        msg: `La Multimedia ${data.url}, ya existe`,
      });
    }

    //Verifica que el Grupo Multimedia Exista
    if (data.IdGrupoMultimedia) {
      if (isValidObjectId(data.IdGrupoMultimedia)) {
        const existeGrupoMultimedia = await GrupoMultimedia.findById(
          data.IdGrupoMultimedia
        );

        if (!existeGrupoMultimedia) {
          return res.status(400).json({
            Ok: false,
            resp: `El Id del Grupo Multimedia ${data.IdGrupoMultimedia}, no existe`,
          });
        }
      } else {
        return res.status(400).json({
          Ok: false,
          resp: `El Id del Grupo Multimedia ${data.IdGrupoMultimedia}, no es un MongoBDId`,
        });
      }
    }

    //data.usuario = req.usuario._id;
    data.fecha_actualizacion = now();

    const multimedia = await Multimedia.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json({ Ok: true, resp: multimedia });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const borrarMultimedia = async (req, res = response) => {
  const { id } = req.params;

  console.log(id);

  try {
    const multimediaBorrado = await Multimedia.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );

    res.json({ Ok: true, resp: multimediaBorrado });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  crearMultimedia,
  obtenerMultimedias,
  obtenerMultimedia,
  obtenerMultimediasXGrupoMultimedia,
  actualizarMultimedia,
  borrarMultimedia,
  obtenerMultimediasXIdHeroe,
  obtenerFotosXIdHeroe
};
