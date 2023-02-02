import mongoose from "mongoose"

export const dbConnection = async() => {
  try {

    await mongoose.connect(process.env.MONGO_DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }) 

    console.log('DB Online');

  } catch (error) {
    console.log(error);
    throw new Error('Error al iniciar la db')
  }
}