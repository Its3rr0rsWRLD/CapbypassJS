const axios = require('axios');

const BASE_URL = "https://capbypass.com/api";

class CapBypassWrapped {
    constructor(clientKey, verbal = false, customHttpClient = null) {
        this.clientKey = clientKey;
        this.verbal = verbal;
        this.customHttpClient = customHttpClient || axios;
    }

    async makeRequest(url, method, data) {
        try {
            const response = await this.customHttpClient({
                url: url,
                method: method,
                headers: { 'Content-Type': 'application/json' },
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error making request:", error);
            return {
                errorCode: error.response.status,
                errorDescription: error.response.statusText
            };
        }
    }

    formatProxy(proxy) {
        const regex = /(?:https?:\/\/)?(?:(?<username>\S+):(?<password>\S+)@)?(?<hostname>\S+):(?<port>\S+)/;
        const match = proxy.match(regex);
        if (match) {
            let formattedString = `${match.groups.hostname}`;
            if (match.groups.port) formattedString += `:${match.groups.port}`;
            if (match.groups.username) formattedString += `@${match.groups.username}`;
            if (match.groups.password) formattedString += `:${match.groups.password}`;
            return formattedString;
        } else {
            return null;
        }
    }

    async createTask(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob = null) {
        const url = `${BASE_URL}/createTask`;
        if (taskType === "FunCaptchaTask" || taskType === "FunCaptchaTaskProxyLess") {
            const dumpedBlob = JSON.stringify({ blob: blob });
            proxy = this.formatProxy(proxy);
            const response = await this.makeRequest(url, "POST", {
                clientKey: this.clientKey,
                task: {
                    type: "FunCaptchaTaskProxyLess",
                    websiteURL: websiteUrl,
                    websitePublicKey: websitePubKey,
                    funcaptchaApiJSSubdomain: websiteSubdomain,
                    data: dumpedBlob,
                    proxy: proxy
                }
            });
            if (response.status_code === 200) {
                if (this.verbal) console.log("FunCaptchaTask created successfully");
                return { taskId: response.taskId };
            } else {
                if (this.verbal) console.warn("FunCaptchaTask failed to create");
                return {
                    errorCode: response.status_code,
                    errorDescription: response.text
                };
            }
        } else {
            if (this.verbal) console.warn("Invalid task type");
            return null;
        }
    }

    async getTaskResult(taskId) {
        const url = `${BASE_URL}/getTaskResult`;
        const response = await this.makeRequest(url, "POST", {
            clientKey: this.clientKey,
            taskId: taskId
        });
        if (response.status_code === 200) {
            if (this.verbal) console.log("Task result retrieved successfully");
            return response.json();
        } else {
            if (this.verbal) console.warn("Task result retrieval failed");
            return {
                errorCode: response.status_code,
                errorDescription: response.text
            };
        }
    }

    async getBalance() {
        const url = `${BASE_URL}/getBalance`;
        const response = await this.makeRequest(url, "POST", {
            clientKey: this.clientKey
        });
        if (response.status_code === 200) {
            if (this.verbal) console.log("Balance retrieved successfully");
            return response.json();
        } else {
            if (this.verbal) console.warn("Balance retrieval failed");
            return {
                errorCode: response.status_code,
                errorDescription: response.text
            };
        }
    }
}

module.exports = CapBypassWrapped;