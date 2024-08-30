import { TicketDAO } from "../dao/TicketsMongoDAO.js"

class TicketService{
    constructor(dao){
        this.ticketDAO = dao
    }

    async createTicket(amount, purchaser){
        return await this.ticketDAO.create(amount,purchaser)
    }
    
}

export const ticketService = new TicketService(new TicketDAO())