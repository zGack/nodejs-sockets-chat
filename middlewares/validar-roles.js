import { response } from "express";

export const isAdminRole = (req, res = response, next) => {

  if (!req.user) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token'
    })
  }

  const {role, name} = req.user;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `El usuario ${name} no tiene privilegios - ADMIN`
    })
  }
  
  next();
}

export const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Se quiere verificar el role sin validar el token'
      })
    } 

    if ( !roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `El usuario debe tener uno de estos roles [${roles}]`
      })
    }
    
    next();
  }
}
