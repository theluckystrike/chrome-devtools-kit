# chrome-devtools-kit — Build Custom Chrome DevTools Panels

[![npm](https://img.shields.io/npm/v/chrome-devtools-kit.svg)](https://www.npmjs.com/package/chrome-devtools-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)]()

> **Built by [Zovo](https://zovo.one)** — used in [JSON Formatter Pro](https://chrome.google.com/webstore/detail/json-formatter-pro)

**Utilities for building Chrome DevTools panel extensions** — panel lifecycle, Elements sidebar, network interception, inspected page communication, and theme matching.

## 📦 Install

```bash
npm install chrome-devtools-kit
```

## 🚀 Usage

```typescript
import { DevToolsPanel, DevToolsSidebar, NetworkInterceptor, InspectedPage, DevToolsTheme } from 'chrome-devtools-kit';

// Create a custom DevTools panel
const panel = await DevToolsPanel.create({
  title: 'My Panel',
  pagePath: 'panel.html',
});

// Match DevTools theme
DevToolsTheme.apply(); // Auto light/dark CSS variables

// Evaluate in inspected page
const title = await InspectedPage.getTitle();
const nodeCount = await InspectedPage.getDOMNodeCount();

// Monitor network requests
const network = new NetworkInterceptor();
network.start();
network.onRequest((entry) => {
  if (entry.time > 1000) console.warn('Slow request:', entry.url);
});
```

## ✨ Modules
- **DevToolsPanel** — Create panels with lifecycle callbacks
- **DevToolsSidebar** — Elements panel sidebars
- **NetworkInterceptor** — Capture, filter, analyze network requests
- **InspectedPage** — Evaluate JS, get DOM info, meta tags
- **DevToolsTheme** — Auto light/dark theme matching

## 📄 License
MIT — [Zovo](https://zovo.one)
