import { response } from "express";
import { Category } from "../models/category.js";

// obtenerCategorias - paginado - total - populate
export const obtenerCategorias = async (req, res = response) => {
  
  const {limit = 5, offset = 0} = req.query;
  const query = {status: true}

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user', 'name')
      .skip(Number(offset))
      .limit(Number(limit))
  ])

  res.json({
    total,
    categories
  })
}

// obtenerCategoria - populate
export const obtenerCategoria = async (req, res = response) => {

  const {id} = req.params;

  const categoria = await Category.findById(id).populate('user','name');

  // if ( !categoria.status ){
  //   return res.status(402).json({
  //     msg: "La categoria esta deshabilitada"
  //   })
  // }

  res.json({
    categoria
  })
}

export const crearCategoria = async (req, res = response) => {


  const name = req.body.name.toUpperCase();

  // Verificar ya hay una categoria con ese nombre
  const categoriaDB = await Category.findOne({ name });

  if ( categoriaDB ) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.name}, ya existe`
    })
  }

  // Generar la data a guardar
  const data = {
    name,
    user: req.user._id
  }

  const categoria = new Category(data);

  // Guardar la categoria en la DB
  await categoria.save();

  res.status(201).json(categoria);
}

// actualizarCategoria
export const actualizarCategoria = async (req, res = response) => {
  
  // const name = req.body.name.toUpperCase();
  const {id} = req.params;
  const { status, user, ...data } = req.body
  data.name = data.name.toUpperCase()

  const exists = await Category.findOne({name: data.name});

  if ( exists ) {
    return res.status(400).json({
      msg: 'Ya existe una categoria con ese nombre'
    })
  }

  const category = await Category.findByIdAndUpdate(id, {name: data.name}, {new: true});

  res.json({
    category
  })

}

// borrarCategoria - status: false
export const borrarCategoria = async (req, res = response) => {
  
  const {id} = req.params;

  const category = await Category.findByIdAndUpdate(id, {status: false}, {new: true});

  res.json({
    category
  })

}