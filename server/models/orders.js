const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  name: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  sub_district: { type: String, required: true },
  postalCode: { type: String, required: true },
  landmark: { type: String },
  phoneNumber: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);