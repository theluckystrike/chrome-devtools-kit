# chrome-devtools-kit

[![npm version](https://img.shields.io/npm/v/chrome-devtools-kit)](https://npmjs.com/package/chrome-devtools-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-devtools-kit?style=social)](https://github.com/theluckystrike/chrome-devtools-kit)

A small TypeScript library for building custom Chrome DevTools panels and sidebars. Handles panel lifecycle, inspected-page communication, network request capture, and theme matching so you can focus on the UI.

Designed for Manifest V3 extensions. Wraps the raw chrome.devtools API in clean async methods and typed return values.


INSTALL

```bash
npm install chrome-devtools-kit
```

Optional peer dependency for TypeScript users: @types/chrome >= 0.0.200


EXPORTS

```typescript
import {
  DevToolsPanel,
  DevToolsSidebar,
  InspectedPage,
  NetworkInterceptor,
  DevToolsTheme,
} from 'chrome-devtools-kit';
```

The library ships five modules. Each one is described below with real usage pulled straight from the source.


DEVTOOLS PANEL

Create and manage custom panels in Chrome DevTools.

```typescript
import { DevToolsPanel } from 'chrome-devtools-kit';

// Create a basic panel
const panel = await DevToolsPanel.create({
  title: 'My Panel',
  pagePath: 'panel.html',
  iconPath: 'icons/panel-16.png',
});

// Create a panel with show/hide lifecycle hooks
const panel = await DevToolsPanel.createWithLifecycle({
  title: 'My Panel',
  pagePath: 'panel.html',
  onShow: (window) => console.log('Panel visible', window),
  onHide: () => console.log('Panel hidden'),
});

// Evaluate an expression in the inspected page
const className = await DevToolsPanel.evaluate<string>('document.body.className');

// Get the inspected tab ID
const tabId = DevToolsPanel.getInspectedTabId();
```

PanelOptions accepts title (string), pagePath (string), and an optional iconPath (string).


DEVTOOLS SIDEBAR

Add sidebar panes to the Elements panel.

```typescript
import { DevToolsSidebar } from 'chrome-devtools-kit';

// Bare sidebar pane
const sidebar = await DevToolsSidebar.create('My Sidebar');

// Sidebar that evaluates an expression against the selected element
const sidebar = await DevToolsSidebar.createWithExpression('Element Info', '$0.dataset');

// Sidebar that renders a custom HTML page
const sidebar = await DevToolsSidebar.createWithPage('Properties', 'sidebar.html');

// Sidebar that displays an object tree
const sidebar = await DevToolsSidebar.createWithObject('Debug Data', {
  version: '1.0.0',
  env: 'production',
});
```

All four methods return a Promise containing a chrome ExtensionSidebarPane.


INSPECTED PAGE

Query and control the page being inspected without leaving your DevTools context.

```typescript
import { InspectedPage } from 'chrome-devtools-kit';

const title = await InspectedPage.getTitle();
const url = await InspectedPage.getURL();
const nodeCount = await InspectedPage.getDOMNodeCount();
const cookies = await InspectedPage.getCookies();
const storageSize = await InspectedPage.getLocalStorageSize();
const metaTags = await InspectedPage.getMetaTags();

// Run any expression
const result = await InspectedPage.eval<string>('document.body.className');

// Reload with cache bypass and optional injected script
InspectedPage.reload({ ignoreCache: true, injectedScript: 'console.log("hi")' });

// Tab ID
const tabId = InspectedPage.getTabId();
```

getMetaTags returns an array of { name, content } objects covering both name and property attributes on meta elements.


NETWORK INTERCEPTOR

Capture and query finished network requests inside DevTools.

```typescript
import { NetworkInterceptor } from 'chrome-devtools-kit';

const network = new NetworkInterceptor();
network.start();

// Subscribe to each finished request
const unsubscribe = network.onRequest((entry) => {
  console.log(`${entry.method} ${entry.url} -- ${entry.status} (${entry.time}ms)`);
});

// Query captured entries
const all = network.getEntries();
const slow = network.getSlow(1000);
const scripts = network.getByType('javascript');
const errors = network.filter((e) => e.status >= 400);
const totalBytes = network.getTotalSize();

// Cleanup
unsubscribe();
network.clear();
```

NetworkEntry shape: { url, method, status, type, size, time, startedAt }

All numeric fields use milliseconds for time and bytes for size. The type field contains the MIME type string from the response.


DEVTOOLS THEME

Match the user's DevTools color scheme in your panel or sidebar UI.

```typescript
import { DevToolsTheme } from 'chrome-devtools-kit';

// Apply CSS variables and base body styles
DevToolsTheme.apply();

// Query the theme
const theme = DevToolsTheme.getTheme(); // 'dark' | 'light' | 'default'
const dark = DevToolsTheme.isDark();

// React to changes
DevToolsTheme.onThemeChange((theme) => {
  console.log('Switched to', theme);
});
```

apply() sets five CSS custom properties on the document root:

    --dt-bg        background color
    --dt-text      text color
    --dt-border    border color
    --dt-surface   surface/card color
    --dt-primary   accent/link color

It also appends a minimal style element for body font, background, and color.

Light values: #ffffff, #202124, #dadce0, #f8f9fa, #1a73e8
Dark values: #242424, #e8eaed, #3c4043, #292929, #8ab4f8


CONTRIBUTING

1. Fork the repo
2. Create a feature branch
3. Make your changes and run npm test
4. Open a pull request

```bash
npm run build    # compile TypeScript
npm run dev      # watch mode
npm test         # run tests
npm run lint     # lint source
```


LICENSE

MIT. See the LICENSE file for details.


---

Built at zovo.one, the Chrome extension studio.
github.com/theluckystrike/chrome-devtools-kit
