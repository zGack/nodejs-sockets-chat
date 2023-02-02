import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = {uid}
    jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '4h'
    }, (err, token) => {
      if (err) {
        console.log(err);
        reject('No se pudo generar el JWT')
      } else {
        resolve(token)
      }
    });
  });
}



export const validateJWT = async (token) => {
  try {
    if (token.length < 10) {
      return null;
    }

    const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if (user) {
      if (user.state){
        return user
      }
    }
    return null;

  } catch (error) {
    return null;    
  }
}