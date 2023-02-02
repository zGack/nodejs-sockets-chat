import { Router } from 'express';
import { check } from 'express-validator';
import { actualizarCategoria, borrarCategoria, crearCategoria, obtenerCategoria, obtenerCategorias } from '../controllers/categories.js';
import { existCategoryWithId } from '../helpers/db-validators.js';

import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { isAdminRole } from '../middlewares/validar-roles.js';

export const categories_router = Router()

// Obtener todas las categorias - public
categories_router.get('/', obtenerCategorias);

// Obtener una categeria por id - public
categories_router.get('/:id', [
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existCategoryWithId),
  validarCampos,
],obtenerCategoria);

// Crear categoria - privado - cualquier usuario con un token valido
categories_router.post('/', [
  validarJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  validarCampos
],crearCategoria);

// Actualizar - privado - cualquiera con token valido
categories_router.put('/:id', [
  validarJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existCategoryWithId),
  validarCampos
], actualizarCategoria);

// Borrar una categoria - privado - Admin
categories_router.delete('/:id', [
  validarJWT,
  isAdminRole,
  check('id', 'No es un id de Mongo valido').isMongoId(),
  check('id').custom(existCategoryWithId),
  validarCampos
], borrarCategoria);

