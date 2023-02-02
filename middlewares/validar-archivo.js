import { response } from "express";

export const validarArchivoSubir = (req, res = response, next) => {

  // Valida si se proporciono un archivo a subir
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      msg: 'No hay archivos para subir - varildarArchivoSubir'
    });
  }

  next();
}