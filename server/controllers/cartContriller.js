const Cart = require('../models/Cart');
const Product = require('../models/ProductModel');

exports.addToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: product.price }],
        total: product.price * quantity
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, price: product.price });
      }
      cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    if (!cart) return res.status(200).json({ items: [], total: 0 });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.status(200).json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};