/**
 * DevTools Theme — Match Chrome DevTools theme (light/dark)
 */
export class DevToolsTheme {
    /** Get current DevTools theme */
    static getTheme(): 'dark' | 'light' | 'default' {
        if (chrome.devtools?.panels?.themeName) return chrome.devtools.panels.themeName as any;
        return 'default';
    }

    /** Check if dark theme */
    static isDark(): boolean { return this.getTheme() === 'dark'; }

    /** Apply theme-aware CSS variables to document */
    static apply(): void {
        if (typeof document === 'undefined') return;
        const dark = this.isDark();
        const vars: Record<string, string> = dark
            ? { '--dt-bg': '#242424', '--dt-text': '#e8eaed', '--dt-border': '#3c4043', '--dt-surface': '#292929', '--dt-primary': '#8ab4f8' }
            : { '--dt-bg': '#ffffff', '--dt-text': '#202124', '--dt-border': '#dadce0', '--dt-surface': '#f8f9fa', '--dt-primary': '#1a73e8' };
        Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));

        // Also apply basic styles
        const style = document.createElement('style');
        style.textContent = `body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;font-size:12px;background:var(--dt-bg);color:var(--dt-text)}`;
        document.head.appendChild(style);
    }

    /** Listen for theme changes */
    static onThemeChange(callback: (theme: string) => void): void {
        if (chrome.devtools?.panels?.onThemeChanged) {
            (chrome.devtools.panels as any).onThemeChanged.addListener(callback);
        }
    }
}
