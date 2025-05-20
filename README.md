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

![{25BE377D-486C-48CC-91A1-01DB9EB82D52}](https://github.com/user-attachments/assets/c193e357-ca9c-40cb-ae54-285544aacabc)
![{2F5F4B7F-979D-42AD-894A-8CEA500626BD}](https://github.com/user-attachments/assets/6b03d7b5-202c-4ed9-b7b1-d8dc0d49ded5)
![{BAC9761F-F467-4C9E-8630-6D5E2969D412}](https://github.com/user-attachments/assets/7c68f03a-7912-40fc-8a10-a7d5d974c10f)
![{2392B263-E473-4D21-A503-A606887793EE}](https://github.com/user-attachments/assets/d6f2ff97-dbdc-4b28-95c8-bb9af26c937f)
![{92665D0A-A8F7-4147-8110-3B61F8B5414F}](https://github.com/user-attachments/assets/523ef26c-68c7-4964-81a5-e440befd9458)
![{31664031-8081-43A8-AA19-AA90D6B1A490}](https://github.com/user-attachments/assets/e2845fc5-f3cb-4f42-a0f9-ae4293fbc231)
![{ED28E25B-9AAD-4B76-98DF-030DF63CF524}](https://github.com/user-attachments/assets/43f32436-ced9-42bd-8af8-e0be95760b3b)


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
