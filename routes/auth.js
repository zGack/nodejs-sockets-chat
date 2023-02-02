import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login } from '../controllers/auth.js';
import { validarCampos, validarJWT } from '../middlewares/index.js';
import { renovarToken } from '../controllers/auth.js';

export const auth_router = Router()

auth_router.post('/login', [
  check('email', 'El correo es obligatorio').isEmail(),
  check('password', 'La password es obligatoria').not().isEmpty(),
  validarCampos
],login);

auth_router.post('/google', [
  check('id_token', 'El id_token es necesario').not().isEmpty(),
  validarCampos
],googleSignIn);

auth_router.get('/', validarJWT, renovarToken);
