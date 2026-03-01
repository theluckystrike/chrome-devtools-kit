/**
 * Network Interceptor — Monitor network requests in DevTools
 */
export interface NetworkEntry {
    url: string;
    method: string;
    status: number;
    type: string;
    size: number;
    time: number;
    startedAt: number;
}

export class NetworkInterceptor {
    private entries: NetworkEntry[] = [];
    private listeners: Array<(entry: NetworkEntry) => void> = [];

    /** Start capturing network requests */
    start(): void {
        chrome.devtools.network.onRequestFinished.addListener((request: any) => {
            const entry: NetworkEntry = {
                url: request.request.url,
                method: request.request.method,
                status: request.response.status,
                type: request.response.content?.mimeType || 'unknown',
                size: request.response.content?.size || 0,
                time: request.time || 0,
                startedAt: new Date(request.startedDateTime).getTime(),
            };
            this.entries.push(entry);
            this.listeners.forEach((cb) => cb(entry));
        });
    }

    /** Listen for new requests */
    onRequest(callback: (entry: NetworkEntry) => void): () => void {
        this.listeners.push(callback);
        return () => { const idx = this.listeners.indexOf(callback); if (idx !== -1) this.listeners.splice(idx, 1); };
    }

    /** Get all captured entries */
    getEntries(): NetworkEntry[] { return [...this.entries]; }

    /** Filter entries */
    filter(predicate: (entry: NetworkEntry) => boolean): NetworkEntry[] { return this.entries.filter(predicate); }

    /** Get entries by type (xhr, fetch, script, stylesheet, image, etc.) */
    getByType(type: string): NetworkEntry[] { return this.entries.filter((e) => e.type.includes(type)); }

    /** Get slow requests */
    getSlow(thresholdMs: number = 1000): NetworkEntry[] { return this.entries.filter((e) => e.time > thresholdMs); }

    /** Get total transfer size */
    getTotalSize(): number { return this.entries.reduce((sum, e) => sum + e.size, 0); }

    /** Clear captured entries */
    clear(): void { this.entries = []; }
}
