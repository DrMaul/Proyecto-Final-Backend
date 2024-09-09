import multer from "multer";
import fs from "fs";
import path from "path";
import __dirname from "../utils.js";

// Configuración de diskStorage para productos, perfiles y documentos
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder;
        if (file.fieldname === "profile") {
            folder = "profiles";
        } else if (file.fieldname === "product") {
            folder = "products";
        } else {
            folder = "documents";
        }

        const userFolder = path.join(__dirname, "uploads", folder);
        fs.mkdirSync(userFolder, { recursive: true });
        cb(null, userFolder);
    },
    filename: function (req, file, cb) {
        let filename;
        if (file.fieldname === "document") {
            filename = `${req.body.documentType}-${file.fieldname}-${req.session.usuario.first_name}-${file.originalname}`;
        } else {
            filename = `${file.fieldname}-${req.session.usuario.first_name}-${file.originalname}`;
        }

        cb(null, filename);
    }
});

// Configuración de memoryStorage para el thumbnail
const memoryStorage = multer.memoryStorage();

// Middleware para subir imágenes de productos usando diskStorage
export const upload = multer({ storage: diskStorage });

// Middleware para subir thumbnails usando memoryStorage
export const uploadMemoryStorage = multer({ storage: memoryStorage });

