const Joi = require("joi");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//simple schema
const abonosSchema = new mongoose.Schema({
    prestamo: {
        type: Schema.ObjectId,
        ref: "prestamos"
    },
    cantidad_abonada:{
        type: String,
        required: true
    },
    fecha_abono:{
        type: Date,
        required: true
    }
});

const Abonos = mongoose.model("abonos", abonosSchema);

function validateAbonoContent(abono) {
    console.log(abono)
    const schema = Joi.object({
        prestamo: Joi.string().required(),
        cantidad_abonada: Joi.string().required(),
        fecha_abono: Joi.date().required()
    });
    return schema.validate(abono);
}

exports.Abonos = Abonos;
exports.validateAbonoContent = validateAbonoContent;