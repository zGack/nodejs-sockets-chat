import { response } from "express";
import { Category } from "../models/category.js";
import { Product } from "../models/product.js";

export const obtenerProductos = async (req, res = response) => {
  
  const {limit = 5, offset = 0} = req.query;
  const query = {status: true}

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user', 'name')
      .populate('category', 'name')
      .skip(Number(offset))
      .limit(Number(limit))
  ])

  res.json({
    total,
    products
  })
}

// obtenerCategoria - populate
export const obtenerProducto = async (req, res = response) => {

  const {id} = req.params;

  const product = await Product.findById(id)
    .populate('user','name')
    .populate('category', 'name');

  return res.json({
    product
  })
}

export const crearProducto = async (req, res = response) => {

  const {status, user, category, ...body} = req.body;
  body.name = body.name.toUpperCase();

  // Verificar ya hay una categoria con ese nombre
  const productoDB = await Product.findOne({ name: body.name });
  const categoryDB = await Category.findOne({ name: category.toUpperCase() })

  if ( productoDB ) {
    return res.status(400).json({
      msg: `El producto ${productoDB.name}, ya existe`
    })
  }

  if ( !categoryDB ) {
    return res.status(400).json({
      msg: `La categoria ${category.toUpperCase()} no existe`
    })
  }

  // Generar la data a guardar
  const data = {
    user: req.user._id,
    category: categoryDB._id,
    ...body
  }

  const product = new Product(data);

  // Guardar el producto en la DB
  await product.save();

  res.status(201).json(product);
}

export const actualizarProducto = async (req, res = response) => {
  
  const {id} = req.params;
  const { status, user, ...data } = req.body

  if ( data.name ) {
    data.name = data.name.toUpperCase();
  }

  data.category = data.category.toUpperCase();

  const existsCategory = await Category.findOne({name: data.category});

  if ( !existsCategory ) {
    return res.status(400).json({
      msg: `La categoria ${data.category} no existe`
    })
  }

  const product = await Product.findByIdAndUpdate(id, {
    name: data.name,
    price: data.price,
    category: existsCategory.id,
    description: data.description,
    available: data.available
  }, {new: true});

  res.json({
    product
  })

}

export const borrarProducto = async (req, res = response) => {
  
  const {id} = req.params;

  const product = await Product.findByIdAndUpdate(id, {status: false}, {new: true});

  res.json({
    product
  })

}