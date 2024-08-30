import mongoose from "mongoose";
import paginate from 'mongoose-paginate-v2'

const productsCollection = "products"
const productsSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        description: {type: String, required: true},
        code: {type: String, required: true, unique: true},
        price: {type: Number, required: true},
        stock: {type: Number, required: true},
        category: {type: String, required: true},
        owner: {type: String, default: "admin"},
    },
    {
        timestamps: true
    }
)

productsSchema.plugin(paginate)

export const productsModelo = mongoose.model(
    productsCollection,
    productsSchema
)