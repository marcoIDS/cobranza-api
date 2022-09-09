const Joi = require("joi");
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//simple schema
const usersSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    phone:{
        type: String,
        required: true
    },
    address: {
      type: String,
      required: true,
    }, 
});

const Users = mongoose.model("users", usersSchema);

function validateUserContent(user) {
    console.log(user)
    const schema = Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        address: Joi.string().required()
    });
    return schema.validate(user);
}

exports.Users = Users;
exports.validateUserContent = validateUserContent;