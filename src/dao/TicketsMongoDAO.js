import { ticketsModelo } from "./models/tickets.modelo.js"

export class TicketDAO{
    async get(){
        return await ticketsModelo.find().lean()
    }

    async create(amount, purchaser){
        let code = Math.floor(Math.random() * 999999);
        let purchase_datetime = new Date()
        return await ticketsModelo.create({code, purchase_datetime, amount, purchaser})

    }
}