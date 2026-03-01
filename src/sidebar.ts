/**
 * DevTools Sidebar — Add sidebars to the Elements panel
 */
export class DevToolsSidebar {
    /** Create a sidebar pane in the Elements panel */
    static create(title: string): Promise<chrome.devtools.panels.ExtensionSidebarPane> {
        return new Promise((resolve, reject) => {
            chrome.devtools.panels.elements.createSidebarPane(title, (sidebar) => {
                if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                else resolve(sidebar);
            });
        });
    }

    /** Create a sidebar and set it to evaluate an expression on selected element */
    static async createWithExpression(title: string, expression: string): Promise<chrome.devtools.panels.ExtensionSidebarPane> {
        const sidebar = await this.create(title);
        sidebar.setExpression(expression);
        return sidebar;
    }

    /** Create a sidebar that shows a page */
    static async createWithPage(title: string, pagePath: string): Promise<chrome.devtools.panels.ExtensionSidebarPane> {
        const sidebar = await this.create(title);
        sidebar.setPage(pagePath);
        return sidebar;
    }

    /** Create a sidebar that shows object data */
    static async createWithObject(title: string, data: unknown): Promise<chrome.devtools.panels.ExtensionSidebarPane> {
        const sidebar = await this.create(title);
        sidebar.setObject(data as any);
        return sidebar;
    }
}
