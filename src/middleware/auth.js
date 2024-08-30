/* export const auth = (req,res,next)=> {
    if(!req.session.usuario){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No existen usuarios autenticados`})
    }

    next()
} */

export const auth = (permisos=[])=> {
    return (req,res,next)=> {
        if(!Array.isArray(permisos)){
            return res.status(500).json({error:"Error en la parametrizacion de permisos de la ruta"})
        }

        permisos = permisos.map(p=>p.toLowerCase())

        req.logger.info("Permisos: "+permisos)

        if(permisos.includes("public")){
            return next()
        }

        if(!req.session.usuario?.rol){
            return res.status(401).json({error:"No existen usuarios autenticados, o hay problemas con el rol"})

        }

        if(!permisos.includes(req.session.usuario.rol.toLowerCase())){
            return res.status(403).json({error:"No tiene privilegios suficientes para acceder"})
        }

        next()
    }
}