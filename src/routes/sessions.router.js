import { Router } from 'express';
import passport from 'passport';
import { passportCall } from '../middleware/passportCall.js';
import { SessionController } from '../controller/SessionController.js';
import { Session } from 'express-session';


export const router=Router()


//paso 3
router.post('/registro',passportCall("registro"),SessionController.registro)

router.post('/login',passportCall("login"),SessionController.login)

router.get('/github', passport.authenticate("github", {}), (req,res)=> {})

router.get('/callbackGithub', passportCall("github"), SessionController.callbackGithub)

router.get('/logout', SessionController.logout)

router.get('/current', SessionController.current)