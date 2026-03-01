/**
 * DevTools Panel — Create and manage custom DevTools panels
 */
export interface PanelOptions { title: string; iconPath?: string; pagePath: string; }

export class DevToolsPanel {
    /** Create a new DevTools panel */
    static create(options: PanelOptions): Promise<chrome.devtools.panels.ExtensionPanel> {
        return new Promise((resolve, reject) => {
            chrome.devtools.panels.create(
                options.title,
                options.iconPath || '',
                options.pagePath,
                (panel) => {
                    if (chrome.runtime.lastError) { reject(new Error(chrome.runtime.lastError.message)); }
                    else { resolve(panel); }
                }
            );
        });
    }

    /** Create a panel with lifecycle callbacks */
    static async createWithLifecycle(options: PanelOptions & {
        onShow?: (window: Window) => void;
        onHide?: () => void;
    }): Promise<chrome.devtools.panels.ExtensionPanel> {
        const panel = await this.create(options);
        if (options.onShow) panel.onShown.addListener(options.onShow as any);
        if (options.onHide) panel.onHidden.addListener(options.onHide);
        return panel;
    }

    /** Get the current inspected tab ID */
    static getInspectedTabId(): number {
        return chrome.devtools.inspectedWindow.tabId;
    }

    /** Evaluate expression in the inspected page */
    static evaluate<T>(expression: string): Promise<T> {
        return new Promise((resolve, reject) => {
            chrome.devtools.inspectedWindow.eval(expression, (result, error) => {
                if (error) reject(error);
                else resolve(result as T);
            });
        });
    }
}
