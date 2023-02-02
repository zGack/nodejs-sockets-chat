import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarProducto, borrarProducto, crearProducto, obtenerProducto, obtenerProductos } from '../controllers/products.js';
import { existCategory, existProductWithId } from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { isAdminRole } from '../middlewares/validar-roles.js';

export const products_router = Router()

// Obtener todas los productos - public
products_router.get('/', obtenerProductos);

// Obtener un producto por id - public
products_router.get('/:id', [
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existProductWithId),
  validarCampos,
],obtenerProducto);

// Crear categoria - privado - cualquier usuario con un token valido
products_router.post('/', [
  validarJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('category').custom(existCategory),
  validarCampos
],crearProducto);

// Actualizar - privado - cualquiera con token valido
products_router.put('/:id', [
  validarJWT,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existProductWithId),
  check('category').custom(existCategory),
  validarCampos
], actualizarProducto);

// Borrar un producto - privado - Admin
products_router.delete('/:id', [
  validarJWT,
  isAdminRole,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existProductWithId),
  validarCampos
], borrarProducto);
