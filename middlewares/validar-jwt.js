import { response } from 'express';
import { header } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const validarJWT = async(req, res = response, next) => {

  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion'
    });
  }

  try {
    
    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    const user = await User.findById(uid);

    if (!user) {
      return req.status(401).json({
        msg: 'Token no valido - user no existe en DB'
      })
    }

    // verificar si el user tiene state = true
    if (!user.state) {
      return req.status(401).json({
        msg: 'Token no valido - user con state: false'
      })
    }

    req.user = user;

    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no valido'
    })
    
  }


}