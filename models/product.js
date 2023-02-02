import mongoose from 'mongoose';

const {Schema, model } = mongoose;

const ProductSchema = Schema({
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
  },
  price: {
    type: Number,
    default: 0
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String
  },
  available: {
    type: Boolean,
    default: true
  },
  img: {
    type: String
  }
})

// Extraer solo los datos del modelo que nos interesan
ProductSchema.methods.toJSON = function() {
  const { __v, status, _id, ...data } = this.toObject();
  data.id = _id;
  return data;
}

export const Product = model('Product', ProductSchema);
