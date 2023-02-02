import mongoose from 'mongoose';

const {Schema, model } = mongoose;

const CategorySchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

// Extraer solo los datos del modelo que nos interesan
CategorySchema.methods.toJSON = function() {
  const { __v, status, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}

export const Category = model('Category', CategorySchema);
