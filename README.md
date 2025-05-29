<!-- LOGO -->
<p align="center">
  <img src="src/assets/img/logo-light.svg" alt="Virtu Hunter Logo" width="100"/>
</p>

<h1 align="center">Virtu Hunter <img src="https://img.shields.io/github/stars/rfonseca85/virtu-hunter-chrome-extension?style=social" alt="GitHub stars"></h1>

<p align="center">
  <b>Enhance your job hunting experience with AI-powered autofill for job application forms!</b><br>
  <i>Smart, privacy-first Chrome extension to save you time and effort.</i>
</p>

---

## ✨ Features

- 🤖 <b>AI-Powered Autofill</b>: Uses Universal Sentence Encoder (TensorFlow.js) to intelligently match and fill job application forms.
- 📝 <b>Profile Management</b>: Store and manage your personal, address, online profiles, application details, and more.
- 📄 <b>Document Upload</b>: Manage and upload your job-related documents for quick access.
- ⚡ <b>One-Click Autofill</b>: Instantly fill forms with your saved data on supported job sites.
- 🔒 <b>Privacy-First</b>: All your data is stored locally in your browser using Chrome's storage API.
- 🛠️ <b>Customizable</b>: Options page lets you edit your profile, documents, and (soon) custom labels and advanced settings.
- 🧩 <b>Modern UI</b>: Built with React, TailwindCSS, and Material Tailwind for a clean, responsive experience.

---

## 🏗️ Technologies Used

- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="20"/> React + Vite
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg" width="20"/> TensorFlow.js + Universal Sentence Encoder
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/chrome/chrome-original.svg" width="20"/> Chrome Extension Manifest V3
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="20"/> TailwindCSS & Material Tailwind
- <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20"/> JavaScript/JSX

---

## 🚀 Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/rfonseca85/virtu-hunter-chrome-extension.git
   cd virtu-hunter-chrome-extension
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Run in development mode**
   ```bash
   npm run dev
   ```
   This will start Vite's dev server. Build output will be in the `dist/` folder.
4. **Build for production**
   ```bash
   npm run build
   ```
5. **Load the extension in Chrome**
   - Open <code>chrome://extensions</code>
   - Enable <b>Developer mode</b>
   - Click <b>Load unpacked</b> and select the <code>dist/</code> folder

---

## 🧠 How It Works

- The extension uses a content script to scan job application forms for labels.
- Each label is classified using a machine learning model (Universal Sentence Encoder) to match it to a known field (e.g., name, email, LinkedIn, etc.).
- If a match is found and you have data saved for that field, the extension autofills the input.
- You can toggle autofill on/off from the popup and manage your data in the options page.

### Supported Autofill Fields

- First Name, Last Name, Full Name
- Email, Phone
- Address, City, Province/State, Postal Code, Country
- Website, LinkedIn, College/University
- Date Available, Desired Pay
- Referral, Motivation, Management/Agile Experience, Recent Example
- Remote Eligibility, Visa Requirement, How You Heard About the Job

---

## 📚 Project Structure

<details>
<summary>Click to expand</summary>

```
virtu-hunter-chrome-extension/
├── src/
│   ├── assets/
│   ├── classifier/         # ML logic (USE, similarity, categories)
│   ├── components/         # Reusable React components
│   ├── content/            # Content scripts (autofill logic)
│   ├── pages/              # Options and Popup UIs
│   └── ...
├── background.js
├── manifest.json
├── package.json
└── ...
```
</details>

---

## ⭐️ Show Your Support

If you like this project, please consider <a href="https://github.com/rfonseca85/virtu-hunter-chrome-extension/stargazers" target="_blank">starring it on GitHub</a>! <br>

<p align="center">
  <a href="https://github.com/rfonseca85/virtu-hunter-chrome-extension/stargazers">
    <img src="https://img.shields.io/github/stars/rfonseca85/virtu-hunter-chrome-extension?style=social" alt="GitHub stars">
  </a>
</p>

---

## 📄 License

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License. You may use, share, and adapt the code for personal and non-commercial purposes only. Commercial use is **not permitted**.

See the [LICENSE](LICENSE) file for details. 