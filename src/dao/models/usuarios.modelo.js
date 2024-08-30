import mongoose from 'mongoose'

export const usuariosModelo=mongoose.model('usuarios',new mongoose.Schema({
    first_name: String,
    last_name: String,
    age:Number,
    email:{
        type: String, unique:true
    }, 
    password: String,
    rol:{
        type: String, default:"user"
    },
    cart: {
        type: mongoose.Types.ObjectId, ref: "carts"
    },
    documents: {
        type: [{name: String, reference: String}]
    },
    last_connection: String
},
{
    timestamps: true, strict: false
}
))
