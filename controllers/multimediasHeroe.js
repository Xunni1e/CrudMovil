const { response } = require("express");
const { MultimediaHeroe } = require("../models");

//const { isValidObjectId } = require("../helpers/mongo-verify");
//const { now } = require("mongoose");


const obtenerMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      const multimediaHeroe = await MultimediaHeroe.findById(id)
        //.populate("usuario", "nombre")
        //.populate("IdGrupoMultimedia", "nombre");
  
        res.json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }
  };

const obtenerMultimediasPorHeroe = async (req, res = response) => {
    const { id } = req.params;
  
    try {
      const multimediasHeroe = await MultimediaHeroe.find({ IdHeroe: id })
        .populate("IdMultimedia", "url")
        .populate("IdHeroe", "nombre");
  
        res.json({ Ok: true, resp: multimediasHeroe });
    } catch (error) {
      res.json({ Ok: false, resp: error });
    }
  };


const crearMultimediaHeroe = async (req, res = response) => {
    const { estado, usuario, ...body } = req.body;

    try {
        const multimediaHeroeDB = await MultimediaHeroe.findOne({ IdHeroe: body.IdHeroe, IdMultimedia: body.IdMultimedia });

        if (multimediaHeroeDB) {
            return res.status(400).json({
                msg: `La multimedia, ya existe para este Heroe`,
            });
        }

        // Generar la data a guardar
        const data = {
            ...body,
            //usuario: req.usuario._id,
        };

        const multimediaHeroe = new MultimediaHeroe(data);

        // Guardar DB
        await multimediaHeroe.save();

        res.status(201).json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const actualizarMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    try {

        //Verifica que la URL existe
        //const multimediaHeroeDB = await Multimedia.findOne({ url: data.url });
        const multimediaHeroeDB = await MultimediaHeroe.findOne({ IdHeroe: body.IdHeroe, IdMultimedia: body.IdMultimedia });

        if (multimediaHeroeDB) {
            return res.status(400).json({
                msg: `La multimedia, ya existe para este Heroe`,
            });
        }


        /*
        //Verifica que la Multimedia Exista
        if (data.IdMultimedia) {
            if (isValidObjectId(data.IdMultimedia)) {
                const existeMultimedia = await Multimedia.findById(
                    data.IdMultimedia
                );

                if (!existeMultimedia) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Multimedia ${data.IdMultimedia}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Multimedia ${data.IdMultimedia}, no es un MongoBDId`,
                });
            }
        }

        //Verifica que el Heroe Exista
        if (data.IdHeroe) {
            if (isValidObjectId(data.IdHeroe)) {
                const existeHeroe = await Heroe.findById(
                    data.IdHeroe
                );

                if (!existeHeroe) {
                    return res.status(400).json({
                        Ok: false,
                        resp: `El Id Heroe ${data.IdHeroe}, no existe`,
                    });
                }
            } else {
                return res.status(400).json({
                    Ok: false,
                    resp: `El Id Heroe ${data.IdHeroe}, no es un MongoBDId`,
                });
            }
        }
        */

        //data.usuario = req.usuario._id;
        //data.fecha_actualizacion = now();

        const multimediaHeroe = await MultimediaHeroe.findByIdAndUpdate(id, data, {
            new: true,
        });

        res.json({ Ok: true, resp: multimediaHeroe });
    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

const borrarMultimediaHeroe = async (req, res = response) => {
    const { id } = req.params;

    try {

        const multimediaHeroeBorrado = await MultimediaHeroe.findByIdAndDelete(id);

        /*
        const multimediaHeroeBorrado = await MultimediaHeroe.findByIdAndUpdate(
          id,
          { estado: false, fecha_actualizacion: now() },
          { new: true }
        );
        */

        res.json({ Ok: true, resp: multimediaHeroeBorrado });

    } catch (error) {
        res.json({ Ok: false, resp: error });
    }
};

module.exports = {

    obtenerMultimediaHeroe,
    crearMultimediaHeroe,
    actualizarMultimediaHeroe,
    borrarMultimediaHeroe,
    obtenerMultimediasPorHeroe

};
