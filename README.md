## 🛍️ E-Commerce Platform Overview

I have built an advanced e-commerce website using **React.js**, **Node.js**, **MongoDB Atlas**, **Tailwind CSS**, and used **MEGA** as cloud storage.

On the homepage, products are fetched based on scroll position, which helps handle large databases efficiently. Once the products are loaded, they are cached to avoid reloading the same data again and again — improving the overall performance of the site.

Since MEGA provides encrypted storage, I first fetch the data from the backend and then convert the image files into **base64** format before rendering them on the frontend. As a result, the image loading might take a bit longer, but it ensures better security.

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

### 🛠️ Technologies Used

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas

## 🎬 Demo Video Google Drive

👉 [Click here to watch the demo video on Google Drive](https://drive.google.com/file/d/1ChJRZaQ9A0hB7KjuNuXsYcrFuhMOfZsK/view?usp=drive_link)



### 🌐 Live Demo

Check out the live version of this project on **Netlify**:
👉 [Live Demo](https://e-comarce.netlify.app/)

### 📷 Screenshots

### Home Page:
![Home Page](/client/public/home.png)

### Admin Dashboard:
![Admin Dashboard](/client/public/admin.png)



### 📄 Usage

1. **Access the website:** Open your browser and visit `https://e-comarce.netlify.app/`
2. **Admin Login:** Use the default credentials if no admin exists.
3. **User Actions:** Register, browse products, add to cart, and place orders.
4. **Admin Actions:** Manage users, products, and orders from the dashboard.


### 🚀 Installation and Setup

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

