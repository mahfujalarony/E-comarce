const Order = require('../models/orders');
const Product = require('../models/ProductModel');

const placeOrder = async (req, res) => {
  const { productId, quantity, name, city, district, sub_district, postalCode, landmark, phoneNumber } = req.body;
  const userId = req.user.userId;
  console.log('userId', userId); 
 

  try {
  
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    const order = new Order({
      userId,
      productId,
      quantity,
      name,
      city,
      district,
      sub_district,
      postalCode,
      landmark,
      phoneNumber,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { placeOrder };