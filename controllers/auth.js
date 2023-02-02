import { response } from "express";
import { User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

export const login = async(req, res = response) => {

  const { email, password} = req.body;

  try {
    // verificar si el email existe
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({
        msg: 'Usuario y/o Password incorrectos'
      });
    }

    // verificar si el usuario esta activo
    if (!user.state) {
      return res.status(400).json({
        msg: 'Usuario y/o Password incorrectos - status: false'
      });
    }

    // verificar la password
    const matchPassword = bcrypt.compareSync(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        msg: 'Usuario y/o Password incorrectos - password match'
      });
    }

    // generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token
    })
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: 'Error del servidor'
    })
  }
}

export const googleSignIn = async(req, res = response) => {
  const {id_token} = req.body;

  

  try {
    const {name, img, email} = await googleVerify(id_token);

    let user = await User.findOne({email});


    if (!user) {
      const data = {
        name,
        email,
        password: ':/',
        img,
        google: true
      };


      user = new User(data);

      await user.save();
      console.log('saved');

    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Hable con el administrador. Usuario Bloqueado'
      });
    }

    const token = await generarJWT(user.id);

    res.json({
      user,
      token
    })
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'El Token (googleSignIn) no se pudo verificar',
      error
    })
    
  }
}

export const renovarToken = async (req, res = response) => {
  const {user} = req;

  const token = await generarJWT(user.id);
    
  res.json({
    user,
    token
  })
}