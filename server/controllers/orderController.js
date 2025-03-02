const Order = require('../models/orders');
const Product = require('../models/ProductModel');

const placeOrder = async (req, res) => {
  const { productId, quantity, name, city, district, sub_district, product_name, product_price, productImageUrl, postalCode, landmark, phoneNumber } = req.body;
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
      product_name,
      product_price,
      city,
      district,
      sub_district,
      postalCode,
      landmark,
      phoneNumber,
      productImageUrl,
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrders = async (req, res) => {
  try {
      const orders = await Order.find({ userId: req.user.id });
      if (orders.length === 0) {
         return res.status(404).json({ message: "No orders found" });
      }

      const formattedOrders = orders.map(order => ({
          id: order._id,
          product_name: order.product_name,
          quantity: order.quantity,
          price: order.price,
          productImageUrl: orders.productImageUrl,
          status: order.status,
          order_date: order.order_date,
          delivery_date: order.delivery_date,
          createdAt: format(new Date(order.createdAt), "dd-MM-yyyy"), 
      }));

      res.json(formattedOrders);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

module.exports = { placeOrder, getOrders };