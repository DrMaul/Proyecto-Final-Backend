import dotenv from 'dotenv'

dotenv.config({
    path: "./src/.env", override:true
})

export const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL,
    PERSISTENCE: process.env.PERSISTENCE || "FS",
    SECRET : process.env.SECRET,
    MAIL_NODEMAILER: process.env.MAIL_NODEMAILER,
    PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAILER,
    MODE: process.env.MODE,
    ADMINUSER: process.env.ADMINUSER,
    ADMINPASSWORD: process.env.ADMINPASSWORD

}