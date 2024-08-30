import multer from "multer"
import fs from "fs"
import path from 'path'
import __dirname from "../utils.js"

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        let folder
        if(file.fieldname === "profile"){
            folder = "profiles"
        }else if(file.fieldname === "product"){
            folder = "products"
        }else {
            folder = "documents"
        }

        const userFolder = path.join(__dirname,"uploads",folder)
        fs.mkdirSync(userFolder,{recursive:true})
        cb(null, userFolder)
    },
    filename: function(req,file,cb){
        if(file.fieldname == "document"){
            cb(null, req.body.documentType + "-" + file.fieldname + "-" + req.session.usuario.first_name + "-" + file.originalname)
        }
        cb(null, file.fieldname + "-" + req.session.usuario.first_name + "-" + file.originalname)
    }
})

export const upload = multer({storage:storage})