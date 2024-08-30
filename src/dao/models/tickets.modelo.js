import mongoose from 'mongoose'

export const ticketsModelo = mongoose.model(
    "tickets",
    new mongoose.Schema(
        {
            code:{type: String, unique: true},
            purchase_datetime: Date,
            purchaser: String,
            amount: Number
        },
        {
            timestamps: true, strict: false
        }
    )
)