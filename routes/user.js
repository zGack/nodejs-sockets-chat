import { Router } from 'express';
import { check } from 'express-validator';

import { 
  usersPost, 
  usersDelete, 
  usersGet, 
  usersPut 
} from '../controllers/user.js';
import { existEmail, existUserWithId, isValidRole } from '../helpers/db-validators.js';
import { 
  validarJWT,
  validarCampos,
  hasRole,
} from '../middlewares/index.js';

export const user_router = Router();

user_router.get('/', usersGet);

user_router.put('/:id', [
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existUserWithId),
  check('role').custom(isValidRole),
  validarCampos,
],usersPut)

user_router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'Debe ingresar una password').not().isEmpty(),
  check('email', 'Debe ingresar un correo valido').isEmail(),
  check('email').custom(existEmail),
  // check('role', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check('role').custom(isValidRole),
  validarCampos,
], usersPost)

user_router.delete('/:id', [
  validarJWT,
  // isAdminRole,
  hasRole('ADMIN_ROLE','VENTAS_ROLE'),
  check('id', 'No es un ID valido').isMongoId(),
  check('id').custom(existUserWithId),
  validarCampos,
],usersDelete)


