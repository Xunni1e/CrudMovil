const { Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo  es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'La Contraseña es obligatoria']
    },
    img:{
        type: String,
    },
    
    rol:{
        type: String,
        required: [true, 'El role es obligatorio'],
        enum: ['ADMIN_ROLE','USER_ROLE']
    },
    
    /*
    rol: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: [true, 'El role es obligatorio'],
    },
    */
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default:false
    },
    fecha_creacion: {
        type: Date,
		default: Date.now,
		required: 'Debe tener una fecha de Creacion.'
    },
    fecha_actualizacion: {type: Date},
});

//Quita los campos que no quiero ver.
UsuarioSchema.methods.toJSON = function() {
    const {__v,password, _id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);