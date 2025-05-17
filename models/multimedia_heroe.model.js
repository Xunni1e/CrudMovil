const { Schema, model } = require('mongoose');

const MultimediaHeroeSchema = Schema({
    IdHeroe: {
        type: Schema.Types.ObjectId,
        ref: 'Heroe'
    },    
    IdMultimedia: {
        type: Schema.Types.ObjectId,
        ref: 'Multimedia'
    },    
/*
    fecha_creacion: {
        type: Date,
		default: Date.now,
		required: 'Debe tener una fecha de Creacion.'
    },
    fecha_actualizacion: {type: Date},
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    */
 });


 
 MultimediaHeroeSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'MultimediaHeroe', MultimediaHeroeSchema );

