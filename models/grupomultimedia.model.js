const { Schema, model } = require('mongoose');

const GrupoMultimediaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
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
});


GrupoMultimediaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'GrupoMultimedia', GrupoMultimediaSchema );