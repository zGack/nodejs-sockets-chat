import { response } from "express"
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from "url";
import * as Cloudinary from 'cloudinary';

import { uploadFile } from "../helpers/upload-file.js";
import { Product, User } from "../models/index.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const noImgPath = path.join(__dirname, '../assets/no-image.jpg');

const cloudinary = Cloudinary.v2;
cloudinary.config(process.env.CLOUDINARY_URL);

export const loadFile = async (req, res = response) => {

  try {
    const name = await uploadFile(req.files, undefined, 'imgs');
    res.json({name});
  } catch (error) {
    res.status.json({error});
  }
}

export const updateImage = async (req, res = response) => {

  const {id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg: `Caso ${collection} no implementado`})
  }

  // Limpiar imagenes previas
  if (model.img) {
    // Borrar la imagen del servidor
    const imgPath = path.join(__dirname, '../uploads/', collection, model.img);
    
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  const name = await uploadFile(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model)
}

export const showImg = async (req, res = response) => {
  
  const {id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.sendFile(noImgPath);
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.sendFile(noImgPath);
      }
      break;
    default:
      return res.status(500).json({msg: `Caso ${collection} no implementado`})
  }

  // Limpiar imagenes previas
  if (model.img) {
    // Borrar la imagen del servidor
    const imgPath = path.join(__dirname, '../uploads/', collection, model.img);
    
    if (fs.existsSync(imgPath)) {
      return res.sendFile(imgPath);
    }
  }

  return res.sendFile(noImgPath);
}

export const updateImageCloudinary = async (req, res = response) => {

  const {id, collection} = req.params;

  let model;

  switch (collection) {
    case 'users':
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'products':
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg: `Caso ${collection} no implementado`})
  }

  // Limpiar imagenes previas
  if (model.img) {
    const nameArr = model.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const {tempFilePath} = req.files.file;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model)

}