const CapBypassWrapped = require('./CapBypassWrapped');

// Replace 'your_client_key' with your actual client key
const clientKey = 'your_client_key';

// Create an instance of CapBypassWrapped
const capBypass = new CapBypassWrapped(clientKey);

// Example usage
(async () => {
    // Create a task
    const taskResponse = await capBypass.createTask(
        "FunCaptchaTaskProxyLess", // Task type
        "https://example.com",     // Website URL
        "example_public_key",      // Website public key
        "example_subdomain",       // FunCaptcha API JS subdomain
        "http://username:password@proxy.example.com:1234" // Proxy
    );

    console.log("Task creation response:", taskResponse);

    if (taskResponse && taskResponse.taskId) {
        // Get task result
        const taskResult = await capBypass.getTaskResult(taskResponse.taskId);
        console.log("Task result:", taskResult);
    }

    // Get account balance
    const balance = await capBypass.getBalance();
    console.log("Account balance:", balance);
})();
