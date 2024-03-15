const axios = require('axios');
const { URLSearchParams } = require('url');
const { format } = require('util');

const BASE_URL = "https://capbypass.com/api";

class CapBypassWrapped {
    constructor(clientKey, verbal = false) {
        this.clientKey = clientKey;
        this.verbal = verbal;
    }

    async makeRequest(url, method, data = null) {
        try {
            const response = await axios({
                method: method.toLowerCase(),
                url: url,
                data: data
            });
            return response.data;
        } catch (error) {
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
            let formattedProxy = match.groups.hostname;
            if (match.groups.port) formattedProxy += `:${match.groups.port}`;
            if (match.groups.username) formattedProxy += `@${match.groups.username}`;
            if (match.groups.password) formattedProxy += `:${match.groups.password}`;
            return formattedProxy;
        } else {
            return null;
        }
    }

    async createTask(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob = null) {
        const url = `${BASE_URL}/createTask`;
        const dumpedBlob = JSON.stringify({ blob: blob });
        const formattedProxy = this.formatProxy(proxy);
        const requestData = {
            clientKey: this.clientKey,
            task: {
                type: taskType,
                websiteURL: websiteUrl,
                websitePublicKey: websitePubKey,
                funcaptchaApiJSSubdomain: websiteSubdomain,
                data: dumpedBlob,
                proxy: formattedProxy
            }
        };
        return await this.makeRequest(url, 'POST', requestData);
    }

    async getResult(taskId) {
        const url = `${BASE_URL}/getTaskResult`;
        const requestData = {
            clientKey: this.clientKey,
            taskId: taskId
        };
        return await this.makeRequest(url, 'POST', requestData);
    }

    async getBalance() {
        const url = `${BASE_URL}/getBalance`;
        const requestData = {
            clientKey: this.clientKey
        };
        return await this.makeRequest(url, 'POST', requestData);
    }

    async createAndGetResult(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob = null, delay = 5) {
        const task = await this.createTask(taskType, websiteUrl, websitePubKey, websiteSubdomain, proxy, blob);
        if (task.taskId) {
            const start = Date.now();
            while (true) {
                const taskResult = await this.getResult(task.taskId);
                if (taskResult.status === 'READY') {
                    taskResult.time = (Date.now() - start) / 1000;
                    return taskResult;
                } else if ((Date.now() - start) > 200000) {
                    return { errorCode: 400, errorDescription: 'Task took too long to complete' };
                }
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }
        } else {
            return task;
        }
    }

    async createClassificationTask(taskType, image, question) {
        const url = `${BASE_URL}/createTask`;
        const check = this.isBase64Encoded(image);
        if (!check) {
            if (this.verbal) console.warn('Image is not base64 encoded');
            return { errorCode: 1, errorDescription: 'Image is not base64 encoded' };
        }
        const requestData = {
            clientKey: this.clientKey,
            task: {
                type: taskType,
                image: image,
                question: question
            }
        };
        return await this.makeRequest(url, 'POST', requestData);
    }

    async createAndGetClassificationResult(taskType, image, question, delay = 5) {
        const task = await this.createClassificationTask(taskType, image, question);
        if (task.taskId) {
            const start = Date.now();
            while (true) {
                const taskResult = await this.getResult(task.taskId);
                if (taskResult.status === 'READY') {
                    taskResult.time = (Date.now() - start) / 1000;
                    return taskResult;
                } else if ((Date.now() - start) > 200000) {
                    return { errorCode: 400, errorDescription: 'Task took too long to complete' };
                }
                await new Promise(resolve => setTimeout(resolve, delay * 1000));
            }
        } else {
            return task;
        }
    }

    isBase64Encoded(str) {
        const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
        return regex.test(str);
    }
}

module.exports = CapBypassWrapped;
