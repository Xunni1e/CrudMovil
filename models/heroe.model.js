const { Schema, model } = require('mongoose');

const HeroeSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    bio: {
        type: String,
        required: [true, 'La biografia es obligatoria'],
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria'],
    },
    aparicion: {
        type: Date,
		required: 'Debe tener una fecha de Aparicion'
    },
    casa: {
        type: String,
        required: [true, 'La casa es obligatoria'],
    }
});


HeroeSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}

module.exports = model( 'Heroe', HeroeSchema );