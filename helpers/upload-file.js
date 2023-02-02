import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from "url";
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const uploadFile = ({file}, validsExtensions = ['png','jpg','jpeg','gif'], folder = '') => {

  return new Promise((resolve, reject) => {

    if (!file) {
      return reject('Debe proporcionar el archivo a subir');
    }
    
    const shortenedName = file.name.split('.');
    const extension = shortenedName[shortenedName.length - 1];

    // Validar extension
    if ( !validsExtensions.includes(extension)) {
      return reject(`La extesion ${extension} no es permitida - [${validsExtensions}]`);
    }

    const fileName = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname,'../uploads/', folder,fileName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err)
      }

      resolve(fileName);
    })
  })
}