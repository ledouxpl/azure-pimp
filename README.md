# Azure Privileged Identity Management Pal (Azure PIMP)

![Azure PIMP Logo](img/azure_pimp_logo.png)

> Your pal for fast and smooth Azure PIM navigation 🚀

[🔗 View on GitHub](https://github.com/ledouxpl/azure-pimp)

---

## 💡 What is this?

**Azure PIMP** is a lightweight Chrome extension that detects Azure Resource URLs in your browser and gives you
one-click access to the **Privileged Identity Management (PIM)** blade in the Azure Portal for said resource — helping
you get to "Activate Role" faster.

## ⚙️ Features

- ✅ Detects Azure Resource URLs automatically
- 🔔 Extension icon updates dynamically when a resource is detected
- 🔗 Opens directly into Azure PIM view for the detected resource
- 🕘 Tracks your last 5 recently accessed PIM resources
- 📋 Right-click context menu shows current resource + history
- 💾 Persistent history across browser tabs, windows, and restarts

## 📦 Installation (Manual Dev Load)

1. Clone or download this repository

   ```bash
   git clone https://github.com/ledouxpl/azure-pimp.git
   cd azure-pimp
   ```

2. In Chrome (or Brave):

   - Go to `chrome://extensions`
   - Enable **Developer Mode**
   - Click **"Load unpacked"**
   - Select the `azure-pimp/` directory

3. You're all set! Browse to any Azure Resource URL and watch the extension icon come alive.

## 🔍 Example Azure Resource URL

```
https://portal.azure.com/#@yourtenant.onmicrosoft.com/resource/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/my-rg/providers/Microsoft.Web/sites/my-webapp
```

This will:

- Trigger the extension
- Show a ✅ badge
- Allow direct navigation to the resource's PIM page via the extension popup or context menu

## 📂 Project Structure

```
azure-pimp/
├── background.js             ← Extension logic & tab evaluation
├── content.js                ← Runs on every page to match Azure resource URLs
├── manifest.json             ← Chrome extension config
├── popup.html                ← Shown when a resource is detected
├── onboarding.html           ← Welcome splash on install/update
├── icons/                    ← Extension icons
└── img/
    └── azure_pimp_logo.png   ← Logo displayed in onboarding & README
```

## 🤝 Contributing

Pull requests and ideas welcome! If you’ve got a useful enhancement or a fun idea, feel free to fork and PR.

---

Made with ☕ and 💙 by [@ledouxpl](https://github.com/ledouxpl)
