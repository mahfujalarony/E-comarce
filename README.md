# 🛒 E-Commerce Website

An advanced e-commerce platform built with **React.js**, **Node.js**, **MongoDB Atlas**, and **Tailwind CSS**. This platform supports both **user** and **admin** functionalities with real-time data handling.

## 📌 Features

### User Features:
- ✅ User registration and login
- ✅ View available products
- ✅ Add products to the cart
- ✅ Place orders

### Admin Features:
- ✅ Default Admin Creation (if no admin exists)
  - **Email:** `admin@example.com`
  - **Password:** `admin`
- ✅ Manage users (view, remove)
- ✅ Manage products (create, update, delete)
- ✅ Monitor orders (view, cancel)

## 🛠️ Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas

## 🚀 Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahfujalarony/E-comarce.git
   cd e-comarce
   ```

2. **Set up the backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Set up the frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Environment Variables:**
   Create a `.env` file in the backend folder and add the following:
   ```env
   MONGO_URI=your_mongoDB_connection_string
   JWT_SECRET=your_secret_key
   ```

## 📷 Screenshots

### Home Page:
![Home Page](/client/public/home.png)

### Admin Dashboard:
![Admin Dashboard](/client/public/admin.png)

## 🌐 Live Demo

Check out the live version of this project on **Vercel**:
👉 [Live Demo](https://e-comarce-wheat.vercel.app/)

## 📄 Usage

1. **Access the website:** Open your browser and visit `https://e-comarce-wheat.vercel.app/`
2. **Admin Login:** Use the default credentials if no admin exists.
3. **User Actions:** Register, browse products, add to cart, and place orders.
4. **Admin Actions:** Manage users, products, and orders from the dashboard.



