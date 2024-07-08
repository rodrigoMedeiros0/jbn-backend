const mongoose = require('mongoose');;

const Schema = mongoose.Schema

const BuildingSchema = new Schema({
    name: {type: String, required: true},
     status: {type: String, required: true},
     description: {type: String, required: true},
     differential: {type: String, required: true},
     address: {type: String, required: true},
     size: {type: Number, required: true},
     bedroom: {type: Number, required: true},
     bathroom: {type: Number, required: true},
     garage: {type: Number, required: true},
     location: {type: String, required: true},
     city: {type: String, required: true},
     uf: {type: String, required: true},
     gallery: {type: Array, required: true}
})

module.exports=mongoose.model("Building", BuildingSchema);