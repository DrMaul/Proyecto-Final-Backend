import mongoose from "mongoose";

const messagesCollection = "messages"
const messagesSchema = new mongoose.Schema(
    {
        user: String,
        message: String
    },
    {
        timestamps: true
    }
)

export const messagesModelo = mongoose.model(
    messagesCollection,
    messagesSchema
)