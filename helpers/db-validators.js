import { Category } from '../models/category.js';
import { Product } from '../models/product.js';
import { Role } from '../models/role.js';
import { User } from '../models/user.js';

/**
 * Validators para Usuarios
 */

export const isValidRole = async(role = '') => {
  const existRole = await Role.findOne({ role });

  if (!existRole) {
    throw new Error(`El rol ${role} no es un rol valido`)
  }
}

export const existEmail = async(email = '') => {

  const exist = await User.findOne({email});

  if (exist) {
    throw new Error(`Ya existe un usuario con ese correo`)
  }
}

export const existUserWithId = async(id) => {

  const exist = await User.findById(id);

  if (!exist) {
    throw new Error(`No existe un usuario con el id ${id}`)
  }

}

/**
 *  Validators para Usuarios
 */

/**
 *  Validators para Categorias
 */

export const existCategory = async(name = '') => {

  const exist = await Category.findOne({name:name.toUpperCase()});

  if (!exist) {
    throw new Error(`La categoria ${name} no existe`)
  }

}

export const existCategoryWithId = async(id) => {

  const exist = await Category.findById(id);

  if (!exist) {
    throw new Error(`No existe una categoria con el id ${id}`)
  }

}

/**
 *  Validators para Categorias
 */

/**
 *  Validators para Productos
 */

export const existProductWithId = async(id) => {

  const exist = await Product.findById(id);

  if (!exist) {
    throw new Error(`No existe un producto con el id ${id}`)
  }

}

/**
 *  Validators para Productos
 */

/*
* Validar colecciones permitidas
*
*/

export const collectionsAvailables = (collection = '', collections = []) => {
  const includes = collections.includes(collection);

  if (!includes) {
    throw new Error(`La coleccion ${collection} no es permitida - [${collections}]`);
  }

  return true;
}