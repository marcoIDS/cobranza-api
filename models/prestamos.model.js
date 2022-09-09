const Joi = require("joi");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//simple schema
const prestamosSchema = new mongoose.Schema({
    usuario: {
        type: Schema.ObjectId,
        ref: "users"
    },
    pago_semanal:{
        type: String,
        required: true
    },
    monto_total: {
      type: String,
      required: true,
    }, 
    fecha_desembolso:{
        type: Date,
        required: true
    }
});

const Prestamos = mongoose.model("prestamos", prestamosSchema);

function validatePrestamoContent(prestamo) {
    console.log(prestamo)
    const schema = Joi.object({
        usuario: Joi.string().required(),
        pago_semanal: Joi.string().required(),
        monto_total: Joi.string().required(),
        fecha_desembolso: Joi.date().required()
    });
    return schema.validate(prestamo);
}

exports.Prestamos = Prestamos;
exports.validatePrestamoContent = validatePrestamoContent;