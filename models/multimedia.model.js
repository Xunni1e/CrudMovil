/*BrandProviderMultimedia
id	1		NO	int	10	0	
url	2	''	NO	text			
type	3	'image'	NO	enum			
brandProviderProductId	4		NO	int	10	0	
optionsStatus	5	'active'	NO	enum			
optionsCreatedat	6	current_timestamp(6)	NO	datetime			
optionsUpdatedat	7	current_timestamp(6)	NO	datetime			
*/


const { Schema, model } = require('mongoose');

const MultimediaSchema = Schema({
    url: {
        type: String,
        required: [true, 'La url es obligatoria'],
    },
    tipo: {
        type: String,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    IdGrupoMultimedia: {
        type: Schema.Types.ObjectId,
        ref: 'GrupoMultimedia'
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


MultimediaSchema.methods.toJSON = function() {
    const { __v, ...data  } = this.toObject();
    return data;
}


module.exports = model( 'Multimedia', MultimediaSchema );

