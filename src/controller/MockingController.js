import {fakerES_MX as faker} from '@faker-js/faker'
import { CustomError } from "../utils/CustomError.js";
import { TIPOS_ERROR } from "../utils/EErrors.js";

export class MockingController {
    static generateProductsMocks = async (req,res,next)=> {
        try {
            
            let products = []
            
            for(let i=0; i<=100; i++){
                products.push({
                    _id: faker.database.mongodbObjectId(),
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: faker.string.alphanumeric(6),
                    price: faker.commerce.price({ min: 30000, max: 120000 }),
                    status: true,
                    stock: faker.number.int({ min: 1, max: 100 }),
                    category: faker.commerce.productAdjective(),
                    thumbnails: "Sin Imagen",
                })
            }
            
            res.setHeader('Content-type', 'application/json')
            res.status(200).json({products})
            
        } catch (error) {
            req.logger.fatal(JSON.stringify({
                name:error.name, 
                message:error.message,
                stack:error.stack
            }, null, 5))
            next(error)
        }
        
    }
}