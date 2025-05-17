const { response } = require("express");
const { Heroe,MultimediaHeroe} = require("../models");

const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");

const obtenerHeroes = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  //const query = { estado: true };

  try {
    const [total, heroes] = await Promise.all([
      Heroe.countDocuments(),
      Heroe.find({})
        .skip(Number(desde))
        .sort({nombre:1})
        //.limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: heroes });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {
    const heroe = await Heroe.findById(id);
      
    res.json({ Ok: true, resp: heroe });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const crearHeroe = async (req, res = response) => {
  //const { body } = req.body;

  const body = req.body;

  //console.log("BODY INICIO",body);
  
  try {

    const heroeDB = await Heroe.findOne({ nombre: body.nombre });

    if (heroeDB) {
      return res
      //.status(400)
      .json({
        Ok: false,
        msg: `El Heroe ${body.nombre}, ya existe`,
      });
    }


    //Pasa a mayuscula el dato de la categoria
    //const nombre = req.body.nombre.toUpperCase();

    // Generar la data a guardar
    /*
    const data = {
        nombre: body.nombre,
        bio: body.bio,
        img: body.img,
        aparicion: body.aparicion,
        casa: body.casa
     };
     */

    
    const heroe = new Heroe(body);

    //console.log(heroe);

    // Guardar DB
    await heroe.save();

    //console.log("CREADA",heroe);

    res
    //.status(201)
    .json({ Ok: true, msg: 'Heroe Insertado', resp: heroe});
  } catch (error) {
    console.log("ERROR:INSERTAR",error);

    res.json({ Ok: false, msg:'Error al Insertar Heroe', resp: error });
  }
};

const actualizarHeroe = async (req, res = response) => {
  const { id } = req.params;

  const data  = req.body;

  console.log(data)

  try {

    /*
    if (data.nombre) {
        const heroeDB = await Heroe.findOne({ nombre: data.nombre });

        if (heroeDB) {
          return res.status(400).json({
            msg: `El Heroe ${data.nombre}, ya existe`,
          });
        }
    }
    */
    
    const heroe = await Heroe.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.json({ Ok: true, msg: 'Heroe Actualizado', resp: heroe });
  } catch (error) {
    console.log("ERROR_MODIFICAR",error);
    res.json({ Ok: false, resp: error });
  }
};

const borrarHeroe = async (req, res = response) => {
  const { id } = req.params;
  try {

    const [total, multimediaheroe] = await Promise.all([
      MultimediaHeroe.countDocuments({ IdHeroe: id }),
      MultimediaHeroe.find({ IdHeroe: id})
        //.limit(Number(limite)),
    ]);

    if (total > 0){
      return res
      //.status(400)
      .json({
        Ok: false,
        msg: `El Heroe tiene (${total}) multimedias asignadas y no puede ser borrado....`,
      });
    }
    else{
      const heroeBorrado = await Heroe.findByIdAndDelete(id);

      res.json({ Ok: true, resp: heroeBorrado });

    }

    /*
    const opcionBorrada = await Option.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );
    */

  } catch (error) {
    console.log("ERROR_BORRADO",error);
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  crearHeroe,
  obtenerHeroes,
  obtenerHeroe,
  actualizarHeroe,
  borrarHeroe,
};
