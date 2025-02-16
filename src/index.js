


class OpenAnalytics {
    /**
     * @params {object} parameters - Parameters for client instantiation
     * @params {string} parameters.apiEndpoint - API URL Endpoint
     * @params {string} parameters.userId - User's ID
     * @params {array} parameters.queue - Event queue
     */
    constructor(options = {}) {
        this.apiEndpoint = options.apiEndpoint || "";
        this.userId = null;
        this.queue = [];
        this.init();
    }

    init() {
        window.addEventListener("load", () => this.trackPageView());
        document.addEventListener("click", (event) => this.trackClick(event));
    }

    setUser(user) {
        this.userId = user.id || null;
    }

    trackPageView() {
        this.sendData({
            event: "page_view",
            url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    }

    trackClick(event) {
        const target = event.target;
        if (target && target.tagName) {
            this.sendData({
                event: "click",
                element: target.tagName,
                text: target.innerText.slice(0, 50),
                id: target.id || null,
                class: target.className || null,
                timestamp: new Date().toISOString()
            });
        }
    }

    trackEvent(eventName, properties = {}) {
        this.sendData({
            event: eventName,
            properties,
            timestamp: new Date().toISOString()
        });
    }

    sendData(data) {
        if (this.userId) {
            data.userId = this.userId;
        }

        if (navigator.sendBeacon) {
            navigator.sendBeacon(this.apiEndpoint, JSON.stringify(data))
        } else {
            fetch(this.apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).catch(err => console.error("Data send error:", err));
        }
    }
}

export default OpenAnalytics;