# 💄 Beauty Store – E-Commerce Web App

A full-featured e-commerce platform for beauty and cosmetic products built using **Laravel**, **React.js**, **Inertia.js**, and **Tailwind CSS**.

## ✨ Features

- 🛍️ Product listing with dynamic images and categories
- 🔍 Search and filter system
- 🧾 Detailed product view
- 🛒 Cart and checkout functionality
- 💳 Stripe payment integration
- 🧑 Admin panel for product management
- 🌐 Multi-page navigation with Inertia.js
- 🌙 Light & dark mode support

## 🚀 Tech Stack

- **Backend:** Laravel 10+, Laravel Sanctum, MySQL
- **Frontend:** React.js, Inertia.js, Tailwind CSS
- **Image Uploads:** FilePond
- **Payment:** Stripe API
- **Animation:** Framer Motion

## 📂 Project Structure

```
/app
/resources/js
    /Pages
    /Components
    /Layouts
/routes
    web.php
/database
    /migrations
```

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Mohsen-it/beauty-store.git
cd beauty-store

# Backend setup
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# Frontend setup
npm install
npm run dev
```

> ✅ Make sure to configure your `.env` file with database and Stripe credentials.

## 📸 Screenshots

![Home](https://via.placeholder.com/800x400/FFC0CB/000000?text=Beauty+Store+Home)
![Product Page](https://via.placeholder.com/800x400/FFD700/000000?text=Product+Details)

## 🛡️ Admin Features

- Add / Edit / Delete products
- View orders and payments
- Upload images via FilePond
- Dashboard analytics (planned)

## 💡 Future Improvements

- User authentication
- Order history
- Ratings and reviews
- Admin analytics dashboard
- Email notifications

## 🙌 Author

Built with 💖 by [Mohsen-it](https://github.com/Mohsen-it)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
