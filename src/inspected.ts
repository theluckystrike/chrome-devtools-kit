/**
 * Inspected Page — Communicate with the page being inspected
 */
export class InspectedPage {
    /** Evaluate JavaScript in the inspected page */
    static eval<T>(expression: string): Promise<T> {
        return new Promise((resolve, reject) => {
            chrome.devtools.inspectedWindow.eval(expression, (result, error) => {
                if (error) reject(error);
                else resolve(result as T);
            });
        });
    }

    /** Get page URL */
    static async getURL(): Promise<string> { return this.eval('window.location.href'); }

    /** Get page title */
    static async getTitle(): Promise<string> { return this.eval('document.title'); }

    /** Get DOM node count */
    static async getDOMNodeCount(): Promise<number> { return this.eval('document.querySelectorAll("*").length'); }

    /** Get all cookies for the page */
    static async getCookies(): Promise<string> { return this.eval('document.cookie'); }

    /** Get localStorage size */
    static async getLocalStorageSize(): Promise<number> {
        return this.eval('JSON.stringify(localStorage).length');
    }

    /** Get all meta tags */
    static async getMetaTags(): Promise<Array<{ name: string; content: string }>> {
        return this.eval(`Array.from(document.querySelectorAll('meta')).map(m => ({name: m.getAttribute('name') || m.getAttribute('property') || '', content: m.getAttribute('content') || ''}))`);
    }

    /** Reload the inspected page */
    static reload(options?: { ignoreCache?: boolean; injectedScript?: string }): void {
        chrome.devtools.inspectedWindow.reload(options || {});
    }

    /** Get the inspected tab ID */
    static getTabId(): number { return chrome.devtools.inspectedWindow.tabId; }
}
