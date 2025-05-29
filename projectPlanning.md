# 🧠 Smart Job Form Autofill Chrome Extension – Development Plan

## 🎯 Goal
Create a Chrome Extension using **React + Vite + HTML** to intelligently autofill job application forms. It uses **Universal Sentence Encoder (USE)** via TensorFlow.js to classify form labels, and stores user data **locally** using Chrome's storage API.

---

## 🏗️ Tech Stack Overview

- **UI**: React + Vite
- **ML**: TensorFlow.js + Universal Sentence Encoder
- **Storage**: `chrome.storage.local`
- **Extension Format**: Manifest V3
- **Design**: Single-page application for options with tab or sidebar navigation

---

## 🔧 Core Pages & Components

### 1. `Popup`
- Toggle Auto-fill ON/OFF
- Link to the full configuration panel

### 2. `Options` (Single-page UI with tabs or sections)
Contains sections like:
- **Profile Information**
- **Documents**
- **Autofill Preferences**
- **Custom Labels**
- **Advanced Settings**

All edits are done inline and saved immediately using `chrome.storage.local`.

---

## 🔄 Classifier Engine

### Uses:
- **Universal Sentence Encoder** (via TensorFlow.js)
- Compares embedded label text to predefined categories
- Returns best-matching category with a confidence score

### Easy Extensibility:
- Store categories in a centralized JSON or array:
```ts
const FIELD_CATEGORIES = [
  { id: "full_name", display: "Full Name", examples: ["Your full name", "Name", "Full legal name"] },
  { id: "email", display: "Email", examples: ["Email", "Email address", "Your email"] },
  { id: "phone", display: "Phone", examples: ["Phone number", "Contact phone", "Mobile number"] },
  // Add new categories here
];
```

## Example Flow

1. **Embed detected label**  
   Use the `<label>` innerText.

2. **Embed all category examples**  
   Prepare embeddings for each entry in the `FIELD_CATEGORIES`.

3. **Compute cosine similarity**  
   Measure the similarity between the detected label and each category example.

4. **Pick best match above threshold**  
   Select the best matching category if it exceeds a predefined similarity threshold.

---

## 📁 Recommended Folder Structure

```
virtu-hunter-chrome-extension/
│
├── public/                        # Static assets (if needed by Vite)
│   └── icons/                     # Extension icons
│
├── src/
│   ├── assets/
│   │   ├── img/                   # Images, logos, etc.
│   │   └── styles/                # Global CSS, Tailwind, etc.
│   │
│   ├── components/                # Reusable React components
│   │   ├── common/                # Buttons, inputs, etc.
│   │   └── form/                  # Form-specific components
│   │
│   ├── content/                   # Content scripts injected into web pages
│   │   └── autofill.ts            # Main autofill logic
│   │
│   ├── pages/                     # Top-level React pages
│   │   ├── Options/               # Options page (SPA)
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── DocumentsSection.tsx
│   │   │   └── ...
│   │   └── Popup/                 # Popup UI
│   │       └── Popup.tsx
│   │
│   ├── popup/                     # Popup entry point and assets
│   │   └── index.tsx
│   │
│   ├── background/                # Background scripts (service worker)
│   │   └── index.ts
│   │
│   ├── classifier/                # ML logic (USE, similarity, categories)
│   │   ├── useLoader.ts           # Universal Sentence Encoder loader
│   │   ├── classify.ts            # Label classification logic
│   │   └── categories.ts          # FIELD_CATEGORIES definition
│   │
│   ├── storage/                   # Chrome storage utilities
│   │   └── storage.ts
│   │
│   ├── utils/                     # General utility functions
│   │   └── ...
│   │
│   └── manifest.json              # Manifest V3 (can also be at root)
│
├── background.js                  # (If not using TypeScript/modules)
├── index.html
├── popup.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── projectPlanning.md
```

**Key Points:**
- Group React pages under `src/pages/` and reusable components under `src/components/`.
- Place ML/classifier logic in `src/classifier/` for clarity and extensibility.
- Use `src/content/` for content scripts injected into job forms.
- Store Chrome storage helpers in `src/storage/`.
- Keep manifest and static HTML at the root or in `public/` as needed by Vite.
