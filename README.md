# Browsewipe: Wiping Data, Saving People

Browsewipe is an open-source, multi-platform solution designed for securely managing and remotely wiping browser data. Whether you're an individual seeking enhanced privacy or a team administrator needing to protect sensitive information, Browsewipe gives you the control you need, right at your fingertips.

---

## 🌟 Project Vision
In an age where browser data security is paramount, Browsewipe provides a reliable tool to remotely clear cookies, history, and other sensitive information.
Our mission is to empower users to take control of their digital footprint and protect their privacy and security from anywhere.

---

## ✨ Key Features

### MVP (Minimum Viable Product)
- **Secure Authentication**: Log in with a JWT token to securely connect your browsers to the API.
- **Remote Cookie Wiping**: The browser extension receives commands from the API to instantly clear your cookies.
- **Centralized App**: The mobile app allows you to log in, trigger data wipes, and see a list of all your connected browsers and devices.
- **Backend API**: The core API handles authentication, user management, and the remote commands to trigger data-wiping actions.

### Major Features
- **Expanded Data Wiping**: Remotely clear not just cookies, but also browsing history and saved passwords.
- **Team Member Management**: Register as a team on the website to create and approve team members.
- **Team-wide Data Actions**: Administrators can remotely clear browser data for all connected team members at once.
- **Admin Dashboard (CMS)**: A dedicated dashboard provides powerful tools for user and team management, including member approval.

---

## 💻 Technology Stack
- **Backend**: Node.js with Express.js provides a fast and scalable API.
- **Mobile App**: React Native for a cross-platform mobile experience on iOS and Android.
- **Browser Extension**: Built with React, Webpack 5, and Manifest V3.

---

```markdown
# 🚀 Chrome Extension (React + Webpack)

A minimal boilerplate to build a Chrome Extension using **React**, **Webpack 5**, and **Manifest V3**.
```
---

## 📂 Project Structure

```
.
├── app/ # React Native mobile app
│ ├── .expo/ # Expo configuration files
│ ├── assets/ # Images, fonts, static resources
│ ├── node_modules/ # Dependencies
│ ├── src/ # Main source code
│ │ ├── api/ # API calls and service integrations
│ │ ├── assets/ # Local assets for app (icons, images)
│ │ ├── components/ # Shared UI components
│ │ ├── constants/ # App constants (colors, configs, etc.)
│ │ ├── hooks/ # Custom React hooks
│ │ ├── navigation/ # Navigation setup (React Navigation)
│ │ ├── redux/ # Redux state management
│ │ ├── screens/ # App screens (views)
│ │ ├── styles/ # Global and modular styles
│ │ └── utility/ # Utility functions/helpers
│ ├── .gitignore
│ ├── App.js # Main entry point
│ ├── app.json # Expo project config
│ ├── index.js # App bootstrap
│ ├── package.json
│ └── package-lock.json
│
├── backend/ # Node.js backend server
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── routes/ # Express routes
│ ├── server.js # Entry point (Express app)
│ └── package.json
│
├── extension/ # Browser extension
│ ├── dist/ # Static files (manifest.json, icons, etc.)
│ │ ├── manifest.json
│ │ └── icons/
│ ├── src/ # Development source
│ │ ├── react/ # React source code
│ │ │ ├── components/App.jsx
│ │ │ └── index.html
│ │ ├── content/ # Content scripts
│ │ │ └── index.js
│ │ ├── background/ # Background service worker
│ │ │ └── index.js
│ │ └── styles/ # CSS / SCSS files
│ ├── webpack.config.js # Webpack configuration
│ └── package.json
│
└── README.md
```

---

## ⚙️ Features
- 🔥 React 18 + JSX support
- 🎯 Manifest V3 ready
- 📦 Webpack 5 bundling
- 🧩 Popup, Background, and Content script setup
- 🖼 Example assets & icons included

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/PeterMMM/bro-extension
cd bro-extension
````

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development mode

```bash
npm run start
```

This will watch files and rebuild on changes.

### 4. Build for production

```bash
npm run build
```

The output will be available in the `dist/` folder.

---

## 🧩 Load the Extension in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and share!

---

## 🙌 Contributing

Pull requests are welcome!
For major changes, please open an issue first to discuss what you’d like to change.
