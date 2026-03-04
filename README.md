# chrome-devtools-kit

[![npm version](https://img.shields.io/npm/v/chrome-devtools-kit)](https://npmjs.com/package/chrome-devtools-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Discord](https://img.shields.io/badge/Discord-Zovo-blueviolet.svg?logo=discord)](https://discord.gg/zovo)
[![Website](https://img.shields.io/badge/Website-zovo.one-blue)](https://zovo.one)
[![GitHub Stars](https://img.shields.io/github/stars/theluckystrike/chrome-devtools-kit?style=social)](https://github.com/theluckystrike/chrome-devtools-kit)

> Build custom Chrome DevTools panels and sidebars -- panel lifecycle management, inspected page communication, network interception, and theme matching.

Part of the [Zovo](https://zovo.one) developer tools family.

## Install

```bash
npm install chrome-devtools-kit
```

Peer dependency: `@types/chrome >= 0.0.200` (optional, for TypeScript users).

## Usage

### Create a DevTools Panel

```typescript
import { DevToolsPanel } from 'chrome-devtools-kit';

// Basic panel
const panel = await DevToolsPanel.create({
  title: 'My Panel',
  pagePath: 'panel.html',
  iconPath: 'icons/panel-16.png',
});

// Panel with lifecycle callbacks
const panel = await DevToolsPanel.createWithLifecycle({
  title: 'My Panel',
  pagePath: 'panel.html',
  onShow: (window) => {
    console.log('Panel shown', window);
  },
  onHide: () => {
    console.log('Panel hidden');
  },
});
```

### Add a Sidebar to the Elements Panel

```typescript
import { DevToolsSidebar } from 'chrome-devtools-kit';

// Sidebar that evaluates an expression on the selected element
const sidebar = await DevToolsSidebar.createWithExpression(
  'Element Info',
  '$0.dataset'
);

// Sidebar that shows a custom page
const sidebar = await DevToolsSidebar.createWithPage(
  'Properties',
  'sidebar.html'
);

// Sidebar that displays an object
const sidebar = await DevToolsSidebar.createWithObject(
  'Debug Data',
  { version: '1.0.0', env: 'production' }
);
```

### Communicate with the Inspected Page

```typescript
import { InspectedPage } from 'chrome-devtools-kit';

const title = await InspectedPage.getTitle();
const url = await InspectedPage.getURL();
const nodeCount = await InspectedPage.getDOMNodeCount();
const cookies = await InspectedPage.getCookies();
const storageSize = await InspectedPage.getLocalStorageSize();
const metaTags = await InspectedPage.getMetaTags();

// Evaluate arbitrary expressions
const result = await InspectedPage.eval<string>('document.body.className');

// Reload the inspected page
InspectedPage.reload({ ignoreCache: true });

// Get the inspected tab ID
const tabId = InspectedPage.getTabId();
```

### Monitor Network Requests

```typescript
import { NetworkInterceptor } from 'chrome-devtools-kit';

const network = new NetworkInterceptor();
network.start();

// Listen for each finished request
const unsubscribe = network.onRequest((entry) => {
  console.log(`${entry.method} ${entry.url} -- ${entry.status} (${entry.time}ms)`);
});

// Query captured entries
const allEntries = network.getEntries();
const slowRequests = network.getSlow(1000);         // requests > 1000ms
const scripts = network.getByType('javascript');     // filter by MIME type
const filtered = network.filter((e) => e.status >= 400); // custom filter
const totalBytes = network.getTotalSize();

// Clean up
unsubscribe();
network.clear();
```

### Match the DevTools Theme

```typescript
import { DevToolsTheme } from 'chrome-devtools-kit';

// Apply CSS variables that match light or dark DevTools theme
DevToolsTheme.apply();
// Sets: --dt-bg, --dt-text, --dt-border, --dt-surface, --dt-primary
// Also applies base body styles (font, background, color)

// Query theme manually
const theme = DevToolsTheme.getTheme(); // 'dark' | 'light' | 'default'
const isDark = DevToolsTheme.isDark();

// React to theme changes
DevToolsTheme.onThemeChange((theme) => {
  console.log('Theme changed to:', theme);
});
```

## API

### `DevToolsPanel`

| Method | Signature | Description |
| --- | --- | --- |
| `create` | `(options: PanelOptions) => Promise<ExtensionPanel>` | Create a new DevTools panel. |
| `createWithLifecycle` | `(options: PanelOptions & { onShow?, onHide? }) => Promise<ExtensionPanel>` | Create a panel with `onShown` and `onHidden` callbacks. |
| `getInspectedTabId` | `() => number` | Get the tab ID of the page being inspected. |
| `evaluate` | `<T>(expression: string) => Promise<T>` | Evaluate a JavaScript expression in the inspected page. |

**`PanelOptions`**: `{ title: string, pagePath: string, iconPath?: string }`

### `DevToolsSidebar`

| Method | Signature | Description |
| --- | --- | --- |
| `create` | `(title: string) => Promise<ExtensionSidebarPane>` | Create a sidebar pane in the Elements panel. |
| `createWithExpression` | `(title: string, expression: string) => Promise<ExtensionSidebarPane>` | Create a sidebar that evaluates an expression on the selected element. |
| `createWithPage` | `(title: string, pagePath: string) => Promise<ExtensionSidebarPane>` | Create a sidebar that renders a custom HTML page. |
| `createWithObject` | `(title: string, data: unknown) => Promise<ExtensionSidebarPane>` | Create a sidebar that displays an object tree. |

### `InspectedPage`

| Method | Signature | Description |
| --- | --- | --- |
| `eval` | `<T>(expression: string) => Promise<T>` | Evaluate JavaScript in the inspected page. |
| `getURL` | `() => Promise<string>` | Get the page URL. |
| `getTitle` | `() => Promise<string>` | Get the page title. |
| `getDOMNodeCount` | `() => Promise<number>` | Get total number of DOM nodes. |
| `getCookies` | `() => Promise<string>` | Get `document.cookie` string. |
| `getLocalStorageSize` | `() => Promise<number>` | Get the byte length of `localStorage`. |
| `getMetaTags` | `() => Promise<Array<{ name: string, content: string }>>` | Get all `<meta>` tag name/content pairs. |
| `reload` | `(options?: { ignoreCache?: boolean, injectedScript?: string }) => void` | Reload the inspected page. |
| `getTabId` | `() => number` | Get the inspected tab ID. |

### `NetworkInterceptor`

| Method | Signature | Description |
| --- | --- | --- |
| `start` | `() => void` | Begin capturing network requests via `devtools.network.onRequestFinished`. |
| `onRequest` | `(callback: (entry: NetworkEntry) => void) => () => void` | Subscribe to new requests. Returns an unsubscribe function. |
| `getEntries` | `() => NetworkEntry[]` | Get all captured entries. |
| `filter` | `(predicate: (entry: NetworkEntry) => boolean) => NetworkEntry[]` | Filter entries with a custom predicate. |
| `getByType` | `(type: string) => NetworkEntry[]` | Get entries whose MIME type contains the given string. |
| `getSlow` | `(thresholdMs?: number) => NetworkEntry[]` | Get entries slower than the threshold (default: 1000ms). |
| `getTotalSize` | `() => number` | Sum of all response sizes in bytes. |
| `clear` | `() => void` | Clear all captured entries. |

**`NetworkEntry`**: `{ url: string, method: string, status: number, type: string, size: number, time: number, startedAt: number }`

### `DevToolsTheme`

| Method | Signature | Description |
| --- | --- | --- |
| `getTheme` | `() => 'dark' \| 'light' \| 'default'` | Get the current DevTools theme. |
| `isDark` | `() => boolean` | Check if the dark theme is active. |
| `apply` | `() => void` | Apply CSS variables and base styles matching the current theme. |
| `onThemeChange` | `(callback: (theme: string) => void) => void` | Listen for theme changes. |

**CSS variables set by `apply()`**:

| Variable | Light | Dark |
| --- | --- | --- |
| `--dt-bg` | `#ffffff` | `#242424` |
| `--dt-text` | `#202124` | `#e8eaed` |
| `--dt-border` | `#dadce0` | `#3c4043` |
| `--dt-surface` | `#f8f9fa` | `#292929` |
| `--dt-primary` | `#1a73e8` | `#8ab4f8` |

## License

MIT

## See Also

- [chrome-extension-core](https://github.com/theluckystrike/chrome-extension-core) - Essential utilities for Chrome extension development
- [chrome-extension-testing](https://github.com/theluckystrike/chrome-extension-testing) - Testing utilities for Chrome extensions
- [awesome-chrome-devtools](https://github.com/theluckystrike/awesome-chrome-devtools) - Awesome tooling and resources in the Chrome DevTools ecosystem

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Built by [Zovo](https://zovo.one)
