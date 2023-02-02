import { Router } from 'express';
import { check } from 'express-validator';
import { loadFile, showImg, updateImage, updateImageCloudinary } from '../controllers/uploads.js';
import { collectionsAvailables } from '../helpers/db-validators.js';
import { validarCampos, validarArchivoSubir } from '../middlewares/index.js';

export const uploads_router = Router()

uploads_router.post('/', validarArchivoSubir,loadFile);

uploads_router.put('/:collection/:id', [
  check('id','El id debe ser de mongo').isMongoId(),
  check('collection').custom(c => collectionsAvailables(c, ['users','products'])),
  validarArchivoSubir,
  validarCampos
], updateImageCloudinary);

uploads_router.get('/:collection/:id', [
  check('id','El id debe ser de mongo').isMongoId(),
  check('collection').custom(c => collectionsAvailables(c, ['users','products'])),
  validarCampos
], showImg)