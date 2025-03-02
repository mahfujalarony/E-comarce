const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  name: { type: String, required: true },
  product_name: { type: String, required: true},
  product_price: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  sub_district: { type: String, required: true },
  postalCode: { type: String, required: true },
  landmark: { type: String },
  phoneNumber: { type: String, required: true },
  productImageUrl: { type: String },
  status: { type: String, default: 'Pending' },
  order_date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    delivery_date: { 
        type: String, 
        default: () => {
            let date = new Date();
            date.setDate(date.getDate() + 3);
            return date.toISOString().split("T")[0];
        } 
    },
    createdAt: { type: Date, default: Date.now },
  // createdAt: { type: Date, default: Date.now },
  // deliveryDate: { 
  //   type: Date, 
  //   default: () => {
  //     let date = new Date();
  //     date.setDate(date.getDate() + 3);
  //     return date;
  //   } 
  // }
});

module.exports = mongoose.model('Order', orderSchema);
