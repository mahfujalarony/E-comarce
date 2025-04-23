const Order = require('../models/orders');
const Product = require('../models/ProductModel');

const placeOrder = async (req, res) => {
  const { productId, quantity, name, city, district, sub_district, product_name, product_price, productImageUrl, postalCode, landmark, phoneNumber } = req.body;
 // const userId = req.user.userId;
  const userId = req.user._id;
  console.log('userId', userId); 
 

  try {
  
    const product = await Product.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    };

    
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

// const getOrders = async (req, res) => {
//   try {
//     const order = await Order.find({ userId: req.user.userId });
//     if(userId.length === 0) {
//       return res.status(404).json({ message: 'No orders found'})
//     }
//   }
// }

const getOrders = async (req, res) => {
  try {
      const orders = await Order.find({ userId: req.user._id });
      if (orders.length === 0) {
         return res.status(404).json({ message: "No orders found" });
      }

      const formattedOrders = orders.map(order => ({
          id: order._id,
          product_name: order.product_name,
          quantity: order.quantity,
          price: order.price,
          productImageUrl: order.productImageUrl,
          status: order.status,
          order_date: order.order_date,
          delivery_date: order.delivery_date,
          // createdAt: format(new Date(order.createdAt), "dd-MM-yyyy"), 
      }));

      res.json(formattedOrders);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
      const orders = await Order.find();
      res.json(orders);
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      
      order.status = 'Completed';
      order.completedAt = new Date();
      await order.save();

      res.json({ message: 'Order marked as completed', order });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatusForUser = async (req, res) => {
  try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      
      order.status = 'Cancelled';
      order.completedAt = new Date();
      await order.save();

      res.json({ message: 'Order marked as completed', order });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
};



module.exports = { placeOrder, getOrders, getAllOrders, updateOrderStatus, updateOrderStatusForUser
 };