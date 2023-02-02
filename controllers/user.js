import {response, request} from 'express';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';


export const usersGet = async(req = request, res = response) => {
  
  const {limit = 5, offset = 0} = req.query;
  const query = {state: true}

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(offset))
      .limit(Number(limit))
  ])

  res.json({
    total,
    users
  })
}

export const usersPost = async(req, res = response) => {
  
  const {name, email, password, role} = req.body;
  const user = new User({name, email, password, role});
  
  // Encriptar la password
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  // Guardar en DB
  await user.save();

  res.json({
    user
  })
}

export const usersPut = async(req, res = response) => {

  const {id} = req.params;
  const { _id, password, google, email, ...userData } = req.body;

  if (password) {
    // Encriptar la password
    const salt = bcrypt.genSaltSync();
    userData.password = bcrypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, userData);

  res.json(user);
}

export const usersDelete = async(req, res = response) => {

  const {id} = req.params;

  // Borrar usuario
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, {state: false});

  res.json({
    user
  })
}