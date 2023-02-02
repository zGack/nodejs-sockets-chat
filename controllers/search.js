import { response } from "express";
import mongoose from "mongoose";

import { Category, Product, Role, User } from "../models/index.js";

const availableCollections = [
  'users',
  'categories',
  'products',
  'roles'
]

const ObjectId = mongoose.Types.ObjectId;

const searchUsers = async ( term = '', res = response) => {
  // validar si es un id de mongo valido

  const isMongoID = ObjectId.isValid(term);

  if ( isMongoID ) {
    const user = await User.findById(term);

    return res.json({
      results: (user) ? [user] : []
    });
  }

  // expresion regular para ignorar mayusculas y minusculas
  const regex = new RegExp( term, 'i' );

  const users = await User.find({ 
    $or: [{name: regex}, {email: regex}],
    $and: [{ state: true}]
   });

  res.json({
    results: users
  });

}

const searchCategories = async ( term = '', res = response) => {
  // validar si es un id de mongo valido

  const isMongoID = ObjectId.isValid(term);

  if ( isMongoID ) {
    const category = await Category.findById(term);

    return res.json({
      results: (category) ? [category] : []
    });
  }

  // expresion regular para ignorar mayusculas y minusculas
  const regex = new RegExp( term, 'i' );

  const categories = await Category.find({ 
    name: regex,
    $and: [{ status: true}]
   });

  res.json({
    results: categories
  });

}

const searchProducts = async ( term = '', res = response) => {
  // validar si es un id de mongo valido

  const isMongoID = ObjectId.isValid(term);

  if ( isMongoID ) {
    const product = await Product.findById(term).populate('category');

    return res.json({
      results: (product) ? [product] : []
    });
  }

  // expresion regular para ignorar mayusculas y minusculas
  const regex = new RegExp( term, 'i' );

  const products = await Product.find({ 
    name: regex,
    $and: [{ status: true}]
   }).populate('category');

  res.json({
    results: products
  });

}

const searchRoles = async ( term = '', res = response) => {
  // validar si es un id de mongo valido

  const isMongoID = ObjectId.isValid(term);

  if ( isMongoID ) {
    const role = await Role.findById(term);

    return res.json({
      results: (role) ? [role] : []
    });
  }

  // expresion regular para ignorar mayusculas y minusculas
  const regex = new RegExp( term, 'i' );

  const roles = await Role.find({ 
    role: regex
   });

  res.json({
    results: roles
  });

}

export const search = (req, res = response) => {

  const { collection, term } = req.params;

  if ( !availableCollections.includes(collection) ) {
    return res.status(400).json({
      msg: `La coleccion ${collection} no existe`
    })
  }

  switch (collection) {
    case 'users':
      searchUsers(term, res);
      break;
    case 'categories':
      searchCategories(term, res);
      break;
    case 'products':
      searchProducts(term, res);
      break;
    case 'roles':
      searchRoles(term, res);
      break;
    default:
      res.status(500).json({
        msg: "Busqueda de collection no implementada"
      });
      break;
  }
}